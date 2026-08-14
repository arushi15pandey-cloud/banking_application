'use client';

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useBanking } from '../context/BankingContext';
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

export default function Sidebar() {
  const { setIsInsuranceModalOpen } = useBanking();
  const pathname = usePathname();
  const router = useRouter();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard', badge: null },
    { id: 'transfers', label: 'Transfers & Accounts', icon: ArrowLeftRight, path: '/dashboard/transfers', badge: null },
    { id: 'insurance', label: 'Insurance Portal', icon: Shield, path: '/dashboard/insurance', badge: 'Active' },
    { id: 'claims', label: 'Claims & Tracking', icon: FileText, path: '/dashboard/claims', badge: '2 Pending' },
    { id: 'analytics', label: 'Financial Health', icon: TrendingUp, path: '/dashboard/analytics', badge: null }
  ];

  return (
    <aside className="w-full md:w-64 flex-shrink-0 bg-white border-r border-slate-200 p-4 flex flex-col justify-between shadow-sm">
      <div className="space-y-6">
        
        {/* Navigation Category Header */}
        <div>
          <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">Main Menu</p>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.path;

              return (
                <button
                  key={item.id}
                  onClick={() => router.push(item.path)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition ${
                    isActive
                      ? 'bg-blue-50 text-blue-600 border border-blue-100 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-slate-500'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      item.badge === 'Active' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
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
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 relative overflow-hidden">
          <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-blue-500/5 rounded-full blur-xl pointer-events-none"></div>
          <div className="flex items-center gap-2 text-indigo-600 text-xs font-semibold mb-1">
            <Shield className="w-4 h-4" />
            Instant Protection
          </div>
          <p className="text-xs text-slate-800 font-bold mb-1">Apply for Coverage</p>
          <p className="text-[11px] text-slate-550 leading-relaxed mb-3">
            Get instant quotes for Health, Auto, Home & Life with automatic direct-debit integration.
          </p>
          <button
            onClick={() => setIsInsuranceModalOpen(true)}
            className="w-full py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition flex items-center justify-center gap-1.5 shadow-sm"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            Start Application
          </button>
        </div>

      </div>

      {/* Footer Support Info */}
      <div className="pt-4 border-t border-slate-200">
        <div className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-50 text-slate-600 text-xs border border-slate-100">
          <HelpCircle className="w-4 h-4 text-slate-500" />
          <div>
            <p className="text-slate-700 font-medium text-[11px]">24/7 Priority Banking Concierge</p>
            <p className="text-[10px] text-slate-500">1-800-APEX-SHIELD</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
