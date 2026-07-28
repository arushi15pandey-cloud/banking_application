'use client';

import React from 'react';
import { 
  LayoutDashboard, 
  ArrowLeftRight, 
  Shield, 
  FileText, 
  TrendingUp, 
  CreditCard, 
  PlusCircle,
  HelpCircle
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, onOpenInsuranceModal }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: null },
    { id: 'transfers', label: 'Transfers & Accounts', icon: ArrowLeftRight, badge: null },
    { id: 'insurance', label: 'Insurance Portal', icon: Shield, badge: 'Active' },
    { id: 'claims', label: 'Claims & Tracking', icon: FileText, badge: '2 Pending' },
    { id: 'analytics', label: 'Financial Health', icon: TrendingUp, badge: null }
  ];

  return (
    <aside className="w-full md:w-64 flex-shrink-0 bg-[#0d1322]/90 border-r border-slate-800/80 p-4 flex flex-col justify-between">
      <div className="space-y-6">
        
        {/* Navigation Category Header */}
        <div>
          <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Main Menu</p>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition ${
                    isActive
                      ? 'bg-blue-600/15 text-blue-400 border border-blue-500/30 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-blue-400' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      item.badge === 'Active' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Quick Action Card */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-950/60 via-slate-900 to-blue-950/40 border border-indigo-500/20 relative overflow-hidden">
          <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-blue-500/10 rounded-full blur-xl pointer-events-none"></div>
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold mb-1">
            <Shield className="w-4 h-4" />
            Instant Protection
          </div>
          <p className="text-xs text-slate-300 font-bold mb-1">Apply for Coverage</p>
          <p className="text-[11px] text-slate-400 leading-relaxed mb-3">
            Get instant quotes for Health, Auto, Home & Life with automatic direct-debit integration.
          </p>
          <button
            onClick={onOpenInsuranceModal}
            className="w-full py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition flex items-center justify-center gap-1.5 shadow-md shadow-blue-900/40"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            Start Application
          </button>
        </div>

      </div>

      {/* Footer Support Info */}
      <div className="pt-4 border-t border-slate-800/80">
        <div className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-900/50 text-slate-400 text-xs">
          <HelpCircle className="w-4 h-4 text-slate-400" />
          <div>
            <p className="text-slate-300 font-medium text-[11px]">24/7 Priority Banking Concierge</p>
            <p className="text-[10px] text-slate-400">1-800-APEX-SHIELD</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
