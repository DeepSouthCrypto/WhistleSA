
import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, EyeOff, Award, Zap, ArrowRight, CheckCircle2 } from 'lucide-react';

const FeatureCard = ({ icon: Icon, title, desc }: { icon: any, title: string, desc: string }) => (
  <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
    <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
      <Icon className="text-indigo-600" size={28} />
    </div>
    <h3 className="text-xl font-bold mb-3 text-slate-900">{title}</h3>
    <p className="text-slate-600 leading-relaxed text-sm">{desc}</p>
  </div>
);

const LandingPage = () => {
  return (
    <div className="space-y-24 pb-12">
      {/* Hero Section */}
      <section className="text-center max-w-4xl mx-auto pt-12">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-full text-sm font-medium mb-8">
          <Zap size={16} />
          <span>New: AI-Powered Direct Routing to SIU & HAWKS</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight mb-6">
          Expose Corruption. <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-emerald-600">
            Remain Invisible.
          </span>
        </h1>
        <p className="text-xl text-slate-600 mb-10 leading-relaxed">
          WhistleSA is South Africa's most secure, decentralized platform for anonymous reporting. 
          Military-grade encryption for your evidence, zero-knowledge storage for your identity.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/report" className="w-full sm:w-auto px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:-translate-y-1 transition-all flex items-center justify-center gap-2">
            Submit Evidence <ArrowRight size={20} />
          </Link>
          <Link to="/track" className="w-full sm:w-auto px-8 py-4 bg-white text-slate-900 border border-slate-200 rounded-2xl font-bold hover:bg-slate-50 transition-all">
            Track Existing Report
          </Link>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <FeatureCard 
          icon={EyeOff}
          title="Anonymous by Design"
          desc="We don't track IP addresses, browser fingerprints, or metadata. Your report is linked to a private PIN known only to you."
        />
        <FeatureCard 
          icon={ShieldCheck}
          title="Encrypted Evidence"
          desc="All photos, documents, and recordings are encrypted on your device before they reach our servers. Only investigators have the keys."
        />
        <FeatureCard 
          icon={Award}
          title="Reward Incentives"
          desc="Submissions that lead to successful prosecution or asset recovery are eligible for secure Bitcoin or bank transfer rewards."
        />
      </section>

      {/* Trust Builder */}
      <section className="bg-indigo-900 rounded-[3rem] p-12 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
          <ShieldCheck size={240} />
        </div>
        <div className="max-w-2xl relative z-10">
          <h2 className="text-3xl font-bold mb-6">The WhistleSA Trust Protocol</h2>
          <div className="space-y-6">
            <div className="flex gap-4">
              <CheckCircle2 className="text-emerald-400 shrink-0" size={24} />
              <div>
                <p className="font-semibold text-lg">Direct SIU/HAWKS Link</p>
                <p className="text-indigo-200 text-sm">Verified channels for high-priority cases.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <CheckCircle2 className="text-emerald-400 shrink-0" size={24} />
              <div>
                <p className="font-semibold text-lg">Offline-First Tech</p>
                <p className="text-indigo-200 text-sm">Draft your report even in areas with poor connectivity or during load-shedding.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <CheckCircle2 className="text-emerald-400 shrink-0" size={24} />
              <div>
                <p className="font-semibold text-lg">Transparency Tracking</p>
                <p className="text-indigo-200 text-sm">See the real-time progress of your report without compromising your location.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
