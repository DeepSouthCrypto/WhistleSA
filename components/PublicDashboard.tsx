
import React, { useMemo, useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { storageService } from '../services/storage';
import { CorruptionCategory } from '../types';
import { TrendingUp, Users, ShieldAlert, CheckCircle, X, Award, ShieldCheck, Zap, Coins, Info, Lock } from 'lucide-react';

const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

const StatCard = ({ icon: Icon, label, value, color }: { icon: any, label: string, value: string | number, color: string }) => (
  <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${color}`}>
      <Icon size={24} className="text-white" />
    </div>
    <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">{label}</p>
    <p className="text-2xl font-extrabold text-slate-900">{value}</p>
  </div>
);

const RewardModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  // Prevent scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm transition-opacity duration-300" 
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div 
        className="relative bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute top-6 right-6 z-10">
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-slate-100 rounded-full transition-colors bg-white/50 backdrop-blur-sm"
          >
            <X size={24} className="text-slate-400" />
          </button>
        </div>
        
        <div className="p-8 sm:p-12 overflow-y-auto">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600">
              <Award size={32} />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-slate-900">Reward Protocol</h2>
              <p className="text-slate-500">How WhistleSA incentivizes justice.</p>
            </div>
          </div>

          <div className="space-y-8">
            <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-2 text-indigo-600 font-bold mb-2">
                  <ShieldCheck size={18} />
                  <span>Eligibility</span>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Rewards are granted for reports that lead to the recovery of stolen state assets or the successful conviction of high-level offenders.
                </p>
              </div>
              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-2 text-emerald-600 font-bold mb-2">
                  <Coins size={18} />
                  <span>Payout Tiers</span>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Claimants receive between <strong>2% and 10%</strong> of the total recovered value, capped at R5,000,000 per case.
                </p>
              </div>
            </section>

            <section>
              <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Zap size={18} className="text-amber-500" />
                Anonymous Payout Methods
              </h3>
              <div className="space-y-3">
                <div className="flex items-start gap-4 p-4 rounded-xl border border-slate-100 hover:border-indigo-200 transition-colors">
                  <div className="mt-1 font-bold text-slate-400 text-lg">01</div>
                  <div>
                    <p className="font-bold text-slate-900">Bitcoin Lightning Network</p>
                    <p className="text-xs text-slate-500">The most secure method. No bank account required. Funds are sent to a generated invoice instantly.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-xl border border-slate-100 hover:border-indigo-200 transition-colors">
                  <div className="mt-1 font-bold text-slate-400 text-lg">02</div>
                  <div>
                    <p className="font-bold text-slate-900">Digital Retail Vouchers</p>
                    <p className="text-xs text-slate-500">Secure codes for major SA retailers (Checkers, Pick n Pay, etc.) distributed via the encrypted app portal.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-xl border border-slate-100 hover:border-indigo-200 transition-colors">
                  <div className="mt-1 font-bold text-slate-400 text-lg">03</div>
                  <div>
                    <p className="font-bold text-slate-900">Secure Proxy Transfer</p>
                    <p className="text-xs text-slate-500">Banking transfer via a non-traceable legal trust account to protect your financial footprint.</p>
                  </div>
                </div>
              </div>
            </section>

            <div className="p-6 bg-amber-50 rounded-2xl border border-amber-100 flex gap-4">
              <div className="shrink-0 text-amber-600"><Info size={24} /></div>
              <p className="text-xs text-amber-800 leading-relaxed">
                <strong>Legal Protection:</strong> All rewards are tax-exempt under the whistleblower incentive scheme and protected from disclosure under the Protected Disclosures Act. Your reward claim is processed using your Report ID and Private PIN only.
              </p>
            </div>

            <button 
              onClick={onClose}
              className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-lg active:scale-95 transition-transform"
            >
              I Understand
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const PublicDashboard = () => {
  const reports = storageService.getReports();
  const [isRewardModalOpen, setIsRewardModalOpen] = useState(false);

  const categoryData = useMemo(() => {
    const counts: Record<string, number> = {};
    Object.values(CorruptionCategory).forEach(cat => counts[cat] = 0);
    reports.forEach(r => {
      counts[r.category] = (counts[r.category] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [reports]);

  const statusData = useMemo(() => {
    const counts: Record<string, number> = {};
    reports.forEach(r => {
      counts[r.status] = (counts[r.status] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [reports]);

  return (
    <div className="space-y-12">
      <RewardModal 
        isOpen={isRewardModalOpen} 
        onClose={() => setIsRewardModalOpen(false)} 
      />

      <section>
        <h1 className="text-4xl font-bold text-slate-900 mb-2">Transparency Portal</h1>
        <p className="text-slate-600">Live anonymized impact of WhistleSA submissions.</p>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={TrendingUp} label="Total Reports" value={reports.length + 1240} color="bg-indigo-600" />
        <StatCard icon={ShieldAlert} label="Routed to HAWKS" value={Math.floor(reports.length * 0.4) + 512} color="bg-rose-600" />
        <StatCard icon={Users} label="Routed to SIU" value={Math.floor(reports.length * 0.3) + 328} color="bg-amber-600" />
        <StatCard icon={CheckCircle} label="Cases Resolved" value={142} color="bg-emerald-600" />
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-8">Corruption Categories</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" width={120} tick={{ fontSize: 10, fill: '#64748b' }} />
                <Tooltip 
                  cursor={{ fill: 'transparent' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="value" fill="#4f46e5" radius={[0, 8, 8, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-8">Case Investigation Status</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData.length > 0 ? statusData : [{name: 'No Cases', value: 1}]}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap justify-center gap-4 mt-4">
            {statusData.map((entry, index) => (
              <div key={entry.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                <span className="text-xs font-medium text-slate-600">{entry.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <section className="bg-emerald-50 p-8 rounded-[2rem] border border-emerald-100">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="w-20 h-20 bg-emerald-600 rounded-2xl flex items-center justify-center shrink-0">
            <TrendingUp size={40} className="text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-emerald-900 mb-2">Reward Payout Milestone</h3>
            <p className="text-emerald-700 leading-relaxed mb-4">
              WhistleSA has facilitated over <strong>R1.2M</strong> in incentive rewards for reports leading to asset recovery. 
              Our smart-contract treasury ensures timely and anonymous payouts via the <strong>Anti-Corruption Incentive Fund</strong>.
            </p>
            <button 
              type="button"
              onClick={(e) => {
                e.preventDefault();
                setIsRewardModalOpen(true);
              }}
              className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all text-sm shadow-md active:scale-95"
            >
              How Rewards Work
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PublicDashboard;
