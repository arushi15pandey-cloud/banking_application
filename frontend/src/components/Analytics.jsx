'use client';

import React from 'react';
import { useBanking } from '../context/BankingContext';
import { 
  TrendingUp, 
  PieChart, 
  ShieldCheck, 
  Award, 
  CheckCircle2, 
  ArrowUpRight, 
  DollarSign, 
  Sparkles,
  Zap
} from 'lucide-react';

export default function Analytics() {
  const { user, accounts, transactions, policies } = useBanking();

  const totalLiquidity = accounts
    .filter(a => a.type !== 'credit')
    .reduce((acc, curr) => acc + curr.balance, 0);

  const spendingCategories = [
    { name: 'Insurance & Protection', percent: 22, amount: '$420.00', color: 'bg-emerald-500' },
    { name: 'Housing & Utilities', percent: 35, amount: '$1,250.00', color: 'bg-purple-500' },
    { name: 'Shopping & Dining', percent: 25, amount: '$890.50', color: 'bg-blue-500' },
    { name: 'Transport & Fuel', percent: 10, amount: '$310.00', color: 'bg-amber-500' },
    { name: 'Savings & Investments', percent: 8, amount: '$1,500.00', color: 'bg-teal-400' }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-[#131b2e] border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> Apex Financial Intelligence
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Financial Health & Protection Insights</h1>
          <p className="text-xs text-slate-400 mt-1">
            Automated analysis of your spending distribution, credit health, and insurance coverage ratio.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Resilience Rating</span>
            <p className="text-base font-black text-emerald-400">A+ Super Protected</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Spending Category Breakdown */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-[#131b2e] border border-slate-800 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <PieChart className="w-4 h-4 text-blue-400" /> Monthly Spending & Insurance Allocation
              </h2>
              <p className="text-xs text-slate-400">Distribution across active bank accounts</p>
            </div>
            <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
              Balanced Portfolio
            </span>
          </div>

          <div className="space-y-4">
            {spendingCategories.map(cat => (
              <div key={cat.name} className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-slate-200">{cat.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400">{cat.amount}</span>
                    <span className="font-bold text-white">{cat.percent}%</span>
                  </div>
                </div>
                <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden">
                  <div className={`h-full ${cat.color} rounded-full`} style={{ width: `${cat.percent}%` }}></div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 flex items-center justify-between text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Smart Advice: Your insurance premium ratio is optimal (below 15% of net monthly income).</span>
            </div>
          </div>
        </div>

        {/* Credit & Resilience Meter */}
        <div className="space-y-5">
          
          <div className="p-6 rounded-3xl bg-[#131b2e] border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" /> Credit Health Scorecard
            </h3>

            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">FICO® Score</span>
              <p className="text-3xl font-black text-emerald-400">{user.creditScore}</p>
              <p className="text-xs text-emerald-300 font-medium">Tier 1 Prime Rating</p>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-slate-400">On-Time Payment Record</span>
                <span className="text-emerald-400 font-bold">100% Perfect</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-slate-400">Credit Utilization</span>
                <span className="text-emerald-400 font-bold">12.1% Low</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-slate-400">Active Insurance Binding</span>
                <span className="text-emerald-400 font-bold">{policies.length} Active Policies</span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
