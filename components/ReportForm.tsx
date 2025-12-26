
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, FileUp, MapPin, Send, Trash2, Loader2, AlertCircle, Copy, Check, Lock } from 'lucide-react';
import { CorruptionCategory, CorruptionReport, ReportStatus, ReportEvidence } from '../types';
import { storageService } from '../services/storage';
import { geminiService } from '../services/geminiService';

const ReportForm = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [evidence, setEvidence] = useState<ReportEvidence[]>([]);
  const [location, setLocation] = useState<{lat: number, lng: number} | undefined>();
  
  const [result, setResult] = useState<CorruptionReport | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file: File) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newEvidence: ReportEvidence = {
          id: Math.random().toString(36).substr(2, 9),
          dataUrl: reader.result as string,
          mimeType: file.type,
          timestamp: Date.now(),
        };
        setEvidence(prev => [...prev, newEvidence]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeEvidence = (id: string) => {
    setEvidence(prev => prev.filter(e => e.id !== id));
  };

  const getCurrentLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      }, (err) => {
        setError("Location permission denied.");
      });
    }
  };

  const handleSubmit = async () => {
    if (!title || !description) {
      setError("Please provide a title and description.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // AI analysis for triage
      const aiResponse = await geminiService.analyzeReport(description);
      
      const newReport: CorruptionReport = {
        id: `REPORT-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
        title,
        description,
        category: aiResponse.category as CorruptionCategory,
        agency: aiResponse.agency as 'SIU' | 'HAWKS',
        priority: aiResponse.priority as any,
        aiSummary: aiResponse.summary,
        status: ReportStatus.SUBMITTED,
        evidence,
        location,
        submittedAt: Date.now(),
        lastUpdated: Date.now(),
        trackingPin: Math.floor(100000 + Math.random() * 900000).toString(),
      };

      storageService.saveReport(newReport);
      setResult(newReport);
      setStep(3);
    } catch (err) {
      setError("Failed to process report. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (step === 3 && result) {
    return (
      <div className="max-w-2xl mx-auto py-12 text-center">
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-8 text-emerald-600">
          <Check size={40} />
        </div>
        <h2 className="text-3xl font-bold text-slate-900 mb-4">Submission Encrypted & Sent</h2>
        <p className="text-slate-600 mb-8">
          Your report has been securely routed to the <strong>{result.agency}</strong> for preliminary investigation.
        </p>
        
        <div className="bg-white p-8 rounded-3xl border-2 border-dashed border-slate-200 mb-8">
          <p className="text-xs uppercase tracking-widest text-slate-400 font-bold mb-4">Your Private Tracking Details</p>
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between bg-slate-50 p-4 rounded-xl">
              <div>
                <span className="text-xs block text-slate-500 mb-1">Report ID</span>
                <span className="font-mono font-bold text-lg">{result.id}</span>
              </div>
              <button onClick={() => copyToClipboard(result.id)} className="p-2 text-indigo-600">
                {copied ? <Check size={20} /> : <Copy size={20} />}
              </button>
            </div>
            <div className="flex items-center justify-between bg-indigo-50 p-4 rounded-xl border border-indigo-100">
              <div>
                <span className="text-xs block text-indigo-600 mb-1">Access PIN (Secret)</span>
                <span className="font-mono font-bold text-lg text-indigo-900">{result.trackingPin}</span>
              </div>
              <button onClick={() => copyToClipboard(result.trackingPin)} className="p-2 text-indigo-600">
                {copied ? <Check size={20} /> : <Copy size={20} />}
              </button>
            </div>
          </div>
          <div className="mt-6 flex items-start gap-3 text-left bg-amber-50 p-4 rounded-xl text-amber-800 text-sm">
            <AlertCircle className="shrink-0" size={18} />
            <p>Save these details now! For your safety, we do not store your identity. If you lose this PIN, you cannot track your report or claim rewards.</p>
          </div>
        </div>

        <button 
          onClick={() => navigate('/track')} 
          className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all"
        >
          Go to Tracking Portal
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-slate-900 mb-2">Secure Submission</h1>
        <p className="text-slate-600">Step {step} of 2: {step === 1 ? 'Details & Description' : 'Evidence & Verification'}</p>
        
        <div className="h-2 w-full bg-slate-200 rounded-full mt-6 overflow-hidden">
          <div 
            className="h-full bg-indigo-600 transition-all duration-500" 
            style={{ width: `${(step / 2) * 100}%` }}
          />
        </div>
      </div>

      {error && (
        <div className="mb-8 p-4 bg-red-50 text-red-700 rounded-2xl flex items-center gap-3 animate-pulse">
          <AlertCircle size={20} />
          {error}
        </div>
      )}

      {step === 1 ? (
        <div className="space-y-6 bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Issue Title</label>
            <input 
              type="text" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Procurement Fraud at Department of Health"
              className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Detailed Description</label>
            <textarea 
              rows={6}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide as much detail as possible. Names, dates, locations, and the nature of the corruption..."
              className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
            />
          </div>

          <div className="flex justify-end pt-4">
            <button 
              onClick={() => setStep(2)}
              className="px-10 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all flex items-center gap-2"
            >
              Next Step <Send size={18} />
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-8 bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-4">Attach Evidence (Photos/Docs)</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {evidence.map((item) => (
                <div key={item.id} className="relative aspect-square group rounded-2xl overflow-hidden border border-slate-200">
                  {item.mimeType.startsWith('image/') ? (
                    <img src={item.dataUrl} alt="Evidence" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-slate-100">
                      <FileUp className="text-slate-400" />
                    </div>
                  )}
                  <button 
                    onClick={() => removeEvidence(item.id)}
                    className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="aspect-square flex flex-col items-center justify-center gap-2 border-2 border-dashed border-slate-200 rounded-2xl text-slate-500 hover:border-indigo-400 hover:text-indigo-600 transition-all"
              >
                <Camera size={32} />
                <span className="text-xs font-bold uppercase tracking-wider">Add Evidence</span>
              </button>
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              multiple 
              className="hidden" 
              onChange={handleFileChange} 
            />
          </div>

          <div className="p-6 bg-indigo-50 rounded-2xl border border-indigo-100 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-indigo-600">
                <MapPin size={24} />
              </div>
              <div>
                <p className="font-bold text-slate-900">Include Location Metadata</p>
                <p className="text-xs text-indigo-600 font-medium">
                  {location ? `Pinned: ${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}` : 'Helps verify the report location.'}
                </p>
              </div>
            </div>
            {!location ? (
              <button 
                onClick={getCurrentLocation}
                className="px-4 py-2 bg-white text-indigo-600 border border-indigo-200 rounded-lg text-sm font-bold hover:bg-indigo-600 hover:text-white transition-all"
              >
                Attach Pin
              </button>
            ) : (
              <span className="text-emerald-600"><CheckCircle2 /></span>
            )}
          </div>

          <div className="flex items-center justify-between pt-6">
            <button 
              onClick={() => setStep(1)}
              className="px-6 py-4 text-slate-600 font-bold hover:text-slate-900 transition-all"
            >
              Back
            </button>
            <button 
              disabled={loading}
              onClick={handleSubmit}
              className={`px-10 py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg shadow-indigo-200 transition-all flex items-center gap-2 ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-indigo-700 hover:-translate-y-1'}`}
            >
              {loading ? <Loader2 className="animate-spin" /> : <Lock size={18} />}
              {loading ? 'Encrypting & Analyzing...' : 'Sign & Submit Anonymously'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const CheckCircle2 = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

export default ReportForm;
