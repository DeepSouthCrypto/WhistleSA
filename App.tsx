
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import ReportForm from './components/ReportForm';
import PublicDashboard from './components/PublicDashboard';
import ReportTracker from './components/ReportTracker';
import SecurityAudit from './components/SecurityAudit';
import { storageService } from './services/storage';
import { ShieldAlert, BarChart3, Search, PlusCircle, Lock, Menu, X, Info, Trash2 } from 'lucide-react';

const NavLink = ({ to, icon: Icon, label, active }: { to: string, icon: any, label: string, active: boolean }) => (
  <Link 
    to={to} 
    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
      active ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-600 hover:bg-slate-100'
    }`}
  >
    <Icon size={18} />
    <span className="font-medium">{label}</span>
  </Link>
);

const AppContent = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleGlobalWipe = () => {
    if (window.confirm("Clear all locally saved report data? This cannot be undone and you will lose access to your anonymous tracking PINs.")) {
      storageService.clearAllReports();
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-indigo-600 p-1.5 rounded-lg">
              <ShieldAlert className="text-white" size={24} />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">
              Whistle<span className="text-indigo-600">SA</span>
            </span>
          </Link>
          
          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-4">
            <NavLink to="/report" icon={PlusCircle} label="Report" active={location.pathname === '/report'} />
            <NavLink to="/track" icon={Search} label="Track" active={location.pathname === '/track'} />
            <NavLink to="/dashboard" icon={BarChart3} label="Dashboard" active={location.pathname === '/dashboard'} />
            <NavLink to="/security" icon={Lock} label="Security" active={location.pathname === '/security'} />
          </nav>

          {/* Mobile Toggle */}
          <button className="md:hidden p-2 text-slate-600" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Nav */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-b border-slate-200 px-4 py-4 flex flex-col gap-2">
            <Link to="/report" onClick={() => setIsMenuOpen(false)} className="p-3 bg-slate-50 rounded-xl flex items-center gap-3">
              <PlusCircle size={20} className="text-indigo-600" /> New Report
            </Link>
            <Link to="/track" onClick={() => setIsMenuOpen(false)} className="p-3 bg-slate-50 rounded-xl flex items-center gap-3">
              <Search size={20} className="text-indigo-600" /> Track Status
            </Link>
            <Link to="/dashboard" onClick={() => setIsMenuOpen(false)} className="p-3 bg-slate-50 rounded-xl flex items-center gap-3">
              <BarChart3 size={20} className="text-indigo-600" /> Public Stats
            </Link>
            <Link to="/security" onClick={() => setIsMenuOpen(false)} className="p-3 bg-slate-50 rounded-xl flex items-center gap-3">
              <Lock size={20} className="text-indigo-600" /> Audit Log
            </Link>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-grow w-full max-w-7xl mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/report" element={<ReportForm />} />
          <Route path="/dashboard" element={<PublicDashboard />} />
          <Route path="/track" element={<ReportTracker />} />
          <Route path="/security" element={<SecurityAudit />} />
        </Routes>
      </main>

      {/* Trust Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4 text-white">
              <ShieldAlert size={20} />
              <span className="font-bold">WhistleSA Protocol</span>
            </div>
            <p className="text-sm leading-relaxed">
              WhistleSA uses end-to-end encryption. Your identity is never stored unless you explicitly choose to provide it. Built to combat corruption in the public and private sectors of South Africa.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="text-sm space-y-2">
              <li><Link to="/security" className="hover:text-white transition-colors">Security Architecture</Link></li>
              <li><Link to="/report" className="hover:text-white transition-colors">File a Submission</Link></li>
              <li><Link to="/dashboard" className="hover:text-white transition-colors">Transparency Portal</Link></li>
              <li className="pt-2">
                <button 
                  onClick={handleGlobalWipe}
                  className="flex items-center gap-2 text-rose-400 hover:text-rose-300 font-bold text-xs uppercase tracking-widest transition-colors"
                >
                  <Trash2 size={14} /> Clear History
                </button>
              </li>
            </ul>
          </div>
          <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700">
            <div className="flex items-center gap-2 mb-2 text-white">
              <Info size={16} />
              <span className="text-sm font-semibold uppercase tracking-wider">Legal Disclaimer</span>
            </div>
            <p className="text-xs">
              This platform operates under the Protected Disclosures Act of South Africa. Making false reports knowingly is a punishable offense.
            </p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-slate-800 text-center text-xs">
          &copy; {new Date().getFullYear()} WhistleSA. Non-governmental Anti-Corruption Platform.
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <HashRouter>
      <AppContent />
    </HashRouter>
  );
}
