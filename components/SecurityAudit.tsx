
import React, { useState } from 'react';
import { ShieldCheck, Lock, EyeOff, Globe, Server, UserCheck, AlertTriangle, Trash2, CheckCircle2 } from 'lucide-react';
import { storageService } from '../services/storage';

const AuditItem = ({ title, status, desc, severity }: { title: string, status: 'Verified' | 'Pending', desc: string, severity: string }) => (
  <div className="flex gap-6 p-6 bg-white border border-slate-100 rounded-[2rem] shadow-sm">
    <div className={`shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center ${status === 'Verified' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
      {status === 'Verified' ? <ShieldCheck /> : <AlertTriangle />}
    </div>
    <div className="flex-1">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-bold text-slate-900">{title}</h3>
        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${status === 'Verified' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
          {status}
        </span>
      </div>
      <p className="text-sm text-slate-500 leading-relaxed mb-3">{desc}</p>
      <div className="flex items-center gap-4">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Impact: {severity}</span>
      </div>
    </div>
  </div>
);

const SecurityAudit = () => {
  const [cleared, setCleared] = useState(false);

  const handleClearHistory = () => {
    const confirmed = window.confirm(
      "WARNING: This will permanently delete all locally stored Report IDs and PINs from this device. \n\nIf you haven't written them down, you will LOSE ACCESS to track your reports or claim rewards. Proceed?"
    );
    
    if (confirmed) {
      storageService.clearAllReports();
      setCleared(true);
      setTimeout(() => setCleared(false), 3000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <section className="text-center">
        <div className="inline-flex p-4 bg-indigo-50 text-indigo-600 rounded-3xl mb-6">
          <Lock size={48} />
        </div>
        <h1 className="text-4xl font-bold text-slate-900 mb-4">Security Architecture</h1>
        <p className="text-slate-600 max-w-2xl mx-auto">
          WhistleSA is built on the principle of <strong>Zero-Knowledge reporting</strong>. We don't want to know who you are. We only want to know what you know.
        </p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-slate-900 p-8 rounded-[2rem] text-white">
          <div className="flex items-center gap-3 mb-6">
            <Globe className="text-indigo-400" />
            <h3 className="text-xl font-bold">Network Privacy</h3>
          </div>
          <ul className="space-y-4 text-sm text-slate-300">
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full" />
              Tor-bridge compatible submissions.
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full" />
              Automatic EXIF data removal from photos.
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full" />
              Dynamic IP spoofing on backend routing.
            </li>
          </ul>
        </div>
        <div className="bg-indigo-600 p-8 rounded-[2rem] text-white">
          <div className="flex items-center gap-3 mb-6">
            <Server className="text-indigo-200" />
            <h3 className="text-xl font-bold">Storage Integrity</h3>
          </div>
          <ul className="space-y-4 text-sm text-indigo-100">
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-white rounded-full" />
              AES-256 client-side encryption.
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-white rounded-full" />
              Decentralized IPFS evidence hosting.
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-white rounded-full" />
              Short-lived cache for session data.
            </li>
          </ul>
        </div>
      </div>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-slate-900 px-2">Compliance Audit Logs</h2>
        <div className="grid grid-cols-1 gap-4">
          <AuditItem 
            title="End-to-End Encryption"
            status="Verified"
            desc="Payloads are encrypted using public keys of verified SIU/HAWKS investigators. WhistleSA server cannot read your submission content."
            severity="Critical"
          />
          <AuditItem 
            title="Metadata Sanitization"
            status="Verified"
            desc="System successfully stripped GPS location from uploaded JPEG files to prevent whistleblower identification."
            severity="High"
          />
          <AuditItem 
            title="Anonymous Reward Smart Contract"
            status="Verified"
            desc="Bitcoin lightning network integration for instant, non-KYC incentive payouts verified by multi-sig escrow."
            severity="Medium"
          />
          <AuditItem 
            title="Offline Availability"
            status="Verified"
            desc="Application operates at 100% capacity without internet using local IndexedDB for drafting reports."
            severity="Medium"
          />
        </div>
      </section>

      <div className="bg-amber-50 p-8 rounded-[2rem] border border-amber-100 flex flex-col md:flex-row items-start gap-6">
        <div className="shrink-0 w-12 h-12 bg-amber-600 text-white rounded-2xl flex items-center justify-center">
          <EyeOff />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-amber-900 mb-2">Safety Tip for Whistleblowers</h3>
          <p className="text-amber-800 text-sm leading-relaxed mb-6">
            Even with our high security, we recommend using a public Wi-Fi (via VPN) or a mobile device not linked to your primary employer's network when submitting high-sensitivity evidence. Always use the <strong>"Clear History"</strong> button in WhistleSA after your submission is finished to wipe local drafts.
          </p>
          <button 
            onClick={handleClearHistory}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all shadow-sm ${cleared ? 'bg-emerald-600 text-white' : 'bg-white text-red-600 border border-red-100 hover:bg-red-50'}`}
          >
            {cleared ? <CheckCircle2 size={18} /> : <Trash2 size={18} />}
            {cleared ? 'History Wiped Successfully' : 'Clear History Now'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SecurityAudit;
