
import React, { useState } from 'react';
import { Search, Loader2, AlertCircle, Calendar, ShieldCheck, Zap, Info } from 'lucide-react';
import { storageService } from '../services/storage';
import { CorruptionReport, ReportStatus } from '../types';

const StatusBadge = ({ status }: { status: ReportStatus }) => {
  const styles: Record<string, string> = {
    [ReportStatus.SUBMITTED]: 'bg-slate-100 text-slate-600',
    [ReportStatus.UNDER_REVIEW]: 'bg-blue-100 text-blue-600',
    [ReportStatus.INVESTIGATING]: 'bg-amber-100 text-amber-600',
    [ReportStatus.SIU_HANDOVER]: 'bg-indigo-100 text-indigo-600',
    [ReportStatus.HAWKS_HANDOVER]: 'bg-rose-100 text-rose-600',
    [ReportStatus.RESOLVED]: 'bg-emerald-100 text-emerald-600',
    [ReportStatus.REJECTED]: 'bg-red-100 text-red-600',
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${styles[status] || 'bg-slate-100'}`}>
      {status}
    </span>
  );
};

const PriorityBadge = ({ priority }: { priority: string }) => {
  const styles: Record<string, string> = {
    'Low': 'text-slate-500',
    'Medium': 'text-blue-500',
    'High': 'text-amber-600',
    'Critical': 'text-red-600 font-extrabold underline decoration-red-200',
  };
  return <span className={styles[priority] || ''}>{priority}</span>;
};

const ReportTracker = () => {
  const [reportId, setReportId] = useState('');
  const [pin, setPin] = useState('');
  const [report, setReport] = useState<CorruptionReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setReport(null);

    setTimeout(() => {
      const found = storageService.getReportById(reportId);
      if (found && found.trackingPin === pin) {
        setReport(found);
      } else {
        setError("Invalid Report ID or PIN combination.");
      }
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-slate-900 mb-2">Track Progress</h1>
        <p className="text-slate-600">Check the investigation status of your submission.</p>
      </div>

      <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm mb-12">
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input 
              type="text" 
              placeholder="Report ID (e.g., REPORT-X123Y)"
              value={reportId}
              onChange={(e) => setReportId(e.target.value.toUpperCase())}
              className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
          <div className="flex-1">
            <input 
              type="password" 
              placeholder="6-Digit PIN"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
          <button 
            type="submit"
            disabled={loading}
            className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" /> : <Search size={20} />}
            {loading ? 'Decrypting...' : 'Access Report'}
          </button>
        </form>
        {error && (
          <p className="mt-4 text-red-600 text-sm flex items-center gap-2">
            <AlertCircle size={16} /> {error}
          </p>
        )}
      </div>

      {report && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-xl overflow-hidden relative">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <ShieldCheck size={120} />
            </div>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-1">{report.title}</h2>
                <div className="flex items-center gap-4 text-sm text-slate-500">
                  <span className="flex items-center gap-1"><Calendar size={14} /> {new Date(report.submittedAt).toLocaleDateString()}</span>
                  <span className="flex items-center gap-1 font-mono">{report.id}</span>
                </div>
              </div>
              <StatusBadge status={report.status} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-slate-50 p-4 rounded-xl">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Target Agency</p>
                <p className="font-bold text-indigo-600">{report.agency}</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Category</p>
                <p className="font-bold text-slate-900 truncate">{report.category}</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">AI Priority</p>
                <p className="font-bold"><PriorityBadge priority={report.priority} /></p>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Incentive Status</p>
                <p className="font-bold text-emerald-600">Eligible</p>
              </div>
            </div>

            {report.aiSummary && (
              <div className="mb-8 p-6 bg-indigo-50 rounded-2xl border border-indigo-100">
                <div className="flex items-center gap-2 mb-2 text-indigo-900 font-bold">
                  <Zap size={18} />
                  <span>AI Triage Summary</span>
                </div>
                <p className="text-sm text-indigo-800 leading-relaxed italic">
                  "{report.aiSummary}"
                </p>
              </div>
            )}

            <div className="border-t border-slate-100 pt-8">
              <h3 className="text-lg font-bold mb-4">Case Timeline</h3>
              <div className="space-y-6">
                <div className="relative pl-8 border-l-2 border-emerald-500">
                  <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-emerald-500 border-4 border-white" />
                  <p className="text-xs font-bold text-emerald-600 uppercase mb-1">Current Milestone</p>
                  <p className="font-bold text-slate-900">{report.status}</p>
                  <p className="text-sm text-slate-500 mt-1">The case is currently being assessed for evidentiary strength by the assigned {report.agency} task force.</p>
                </div>
                <div className="relative pl-8 border-l-2 border-indigo-500">
                  <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-indigo-500 border-4 border-white" />
                  <p className="text-xs font-bold text-indigo-600 uppercase mb-1">{new Date(report.submittedAt).toLocaleDateString()}</p>
                  <p className="font-bold text-slate-900">AI-Verification Complete</p>
                  <p className="text-sm text-slate-500 mt-1">Automated triage successfully completed. Report categorized as <span className="font-semibold">{report.category}</span> and routed to <span className="font-semibold">{report.agency}</span> based on legal mandate.</p>
                </div>
                <div className="relative pl-8 border-l-2 border-slate-200">
                  <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-slate-200 border-4 border-white" />
                  <p className="text-xs font-bold text-slate-400 uppercase mb-1">{new Date(report.submittedAt).toLocaleDateString()}</p>
                  <p className="font-bold text-slate-600">Encrypted Submission Received</p>
                  <p className="text-sm text-slate-400">Zero-knowledge packet successfully synchronized with the WhistleSA protocol.</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-indigo-600 p-8 rounded-[2rem] text-white flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-indigo-500 rounded-2xl">
                <Info size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-1">Strengthen Your Case</h3>
                <p className="text-indigo-100 text-sm">You can append more evidence to this specific Report ID anonymously at any time.</p>
              </div>
            </div>
            <button className="px-6 py-3 bg-white text-indigo-600 rounded-xl font-bold hover:bg-indigo-50 transition-all shrink-0">
              Update Evidence
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportTracker;
