'use client';

import React, { useState } from 'react';
import { useBanking } from '../context/BankingContext';
import { 
  Landmark, 
  PiggyBank, 
  CreditCard, 
  ArrowUpRight, 
  ArrowDownRight, 
  ShieldCheck, 
  TrendingUp, 
  Plus, 
  FileText, 
  ChevronRight,
  HeartPulse,
  Car,
  Home,
  AlertCircle,
  Sparkles,
  ExternalLink,
  ShieldAlert
} from 'lucide-react';

export default function Dashboard({ setActiveTab, onOpenTransfer, onOpenInsuranceModal, onOpenClaimModal }) {
  const { user, accounts, transactions, policies, claims } = useBanking();
  const [filterCategory, setFilterCategory] = useState('All');

  const totalLiquidity = accounts
    .filter(a => a.type !== 'credit')
    .reduce((acc, curr) => acc + curr.balance, 0);

  const filteredTransactions = filterCategory === 'All'
    ? transactions
    : transactions.filter(t => t.category === filterCategory);

  const getPolicyIcon = (type) => {
    switch (type) {
      case 'Health': return <HeartPulse className="w-4 h-4 text-emerald-500" />;
      case 'Auto': return <Car className="w-4 h-4 text-blue-500" />;
      case 'Home': return <Home className="w-4 h-4 text-purple-500" />;
      default: return <ShieldCheck className="w-4 h-4 text-indigo-500" />;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Welcome Hero Banner */}
      <div className="relative rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 overflow-hidden shadow-sm">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 right-1/4 -mb-10 w-48 h-48 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-600 border border-blue-100 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-blue-600" /> Apex Preferred Banking
              </span>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
                🛡️ Fully Insured Account
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Welcome back, {user.name}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
              Your overall net liquidity stands at <strong className="text-slate-800">${totalLiquidity.toLocaleString('en-US', { minimumFractionDigits: 2 })}</strong> with {policies.length} active insurance protections.
            </p>
          </div>

          {/* Credit & Risk Pill */}
          <div className="flex items-center gap-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 backdrop-blur-md">
            <div className="text-center px-3 border-r border-slate-200">
              <p className="text-[10px] text-slate-500 uppercase font-semibold">FICO® Score</p>
              <p className="text-xl font-black text-emerald-600">{user.creditScore}</p>
              <p className="text-[9px] text-emerald-600 font-medium">Excellent</p>
            </div>
            <div className="text-center px-3">
              <p className="text-[10px] text-slate-500 uppercase font-semibold">Risk Rating</p>
              <p className="text-sm font-bold text-blue-600 mt-1">{user.riskRating}</p>
              <p className="text-[9px] text-slate-500">Tier 1 Approved</p>
            </div>
          </div>
        </div>
      </div>

      {/* Account Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {accounts.map(acc => (
          <div
            key={acc.id}
            className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 transition glass-card-hover flex flex-col justify-between shadow-sm"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div className={`p-2 rounded-xl ${
                    acc.type === 'checking' ? 'bg-blue-50 text-blue-600 border border-blue-100' :
                    acc.type === 'savings' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                    'bg-purple-50 text-purple-600 border border-purple-100'
                  }`}>
                    {acc.type === 'checking' ? <Landmark className="w-5 h-5" /> :
                     acc.type === 'savings' ? <PiggyBank className="w-5 h-5" /> :
                     <CreditCard className="w-5 h-5" />}
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-800">{acc.name}</h3>
                    <p className="text-[10px] text-slate-500">{acc.accountNumber}</p>
                  </div>
                </div>

                {acc.apy && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-100">
                    {acc.apy} APY
                  </span>
                )}
              </div>

              <div className="mt-4">
                <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                  {acc.type === 'credit' ? 'Current Balance' : 'Available Balance'}
                </p>
                <p className="text-2xl font-black text-slate-900 mt-0.5">
                  {acc.currency}{acc.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </p>
                {acc.creditLimit && (
                  <div className="mt-2">
                    <div className="flex justify-between text-[10px] text-slate-500 mb-1">
                      <span>Limit: ${acc.creditLimit.toLocaleString()}</span>
                      <span>{((acc.balance / acc.creditLimit) * 100).toFixed(1)}% Used</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-purple-500 rounded-full"
                        style={{ width: `${(acc.balance / acc.creditLimit) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <button
                onClick={() => setActiveTab('transfers')}
                className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
              >
                Transfer Funds <ChevronRight className="w-3 h-3" />
              </button>
              <span className="text-[10px] text-slate-400">Live Sync</span>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions Strip */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 flex flex-wrap items-center justify-between gap-3 shadow-sm">
        <span className="text-xs font-semibold text-slate-600">Quick Operations:</span>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onOpenTransfer}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-1.5 transition shadow-sm"
          >
            <ArrowUpRight className="w-4 h-4" /> Send / Transfer
          </button>
          <button
            onClick={onOpenInsuranceModal}
            className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 transition shadow-sm"
          >
            <ShieldCheck className="w-4 h-4" /> New Insurance Quote
          </button>
          <button
            onClick={onOpenClaimModal}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 border border-slate-200 transition"
          >
            <FileText className="w-4 h-4 text-amber-500" /> File Claim
          </button>
        </div>
      </div>

      {/* Main Content Grid: Left Transactions | Right Insurance Protection Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Recent Transactions Column */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-white border border-slate-200 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-blue-600" /> Recent Transactions
              </h2>
              <p className="text-[11px] text-slate-500">Real-time ledger entries across your accounts</p>
            </div>
            
            {/* Filters */}
            <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-xl border border-slate-200 text-[11px]">
              {['All', 'Income', 'Insurance', 'Transfer'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setFilterCategory(cat)}
                  className={`px-2.5 py-1 rounded-lg font-medium transition ${
                    filterCategory === cat
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="divide-y divide-slate-100">
            {filteredTransactions.map(tx => (
              <div key={tx.id} className="py-3 flex items-center justify-between gap-3 text-xs hover:bg-slate-50 px-2 rounded-xl transition">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl ${
                    tx.type === 'credit'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                      : 'bg-slate-100 text-slate-700'
                  }`}>
                    {tx.type === 'credit' ? <ArrowDownRight className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800">{tx.title}</p>
                    <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-0.5">
                      <span>{tx.date}</span>
                      <span>•</span>
                      <span>{tx.account}</span>
                      <span>•</span>
                      <span className="px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 font-medium">{tx.category}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <p className={`font-bold ${tx.type === 'credit' ? 'text-emerald-600' : 'text-slate-800'}`}>
                    {tx.type === 'credit' ? '+' : '-'}${tx.amount.toFixed(2)}
                  </p>
                  <span className="text-[10px] text-emerald-600 font-medium">{tx.status}</span>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => setActiveTab('transfers')}
            className="w-full text-center text-xs text-blue-600 font-medium hover:text-blue-700 pt-2 flex items-center justify-center gap-1"
          >
            View Complete Transaction Ledger <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        {/* Insurance Protection & Claims Summary Column */}
        <div className="space-y-5">
          
          {/* Active Policies Widget */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" /> Active Policies
              </h2>
              <button
                onClick={() => setActiveTab('insurance')}
                className="text-[11px] text-blue-600 hover:text-blue-700 font-medium"
              >
                Manage All ({policies.length})
              </button>
            </div>

            <div className="space-y-3">
              {policies.map(p => (
                <div key={p.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      {getPolicyIcon(p.type)}
                      <span className="font-semibold text-xs text-slate-800">{p.title}</span>
                    </div>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-55 text-emerald-700 border border-emerald-100">
                      {p.status}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center text-[11px] text-slate-505 mt-2">
                    <span>Coverage: <strong className="text-slate-800">${p.coverage.toLocaleString()}</strong></span>
                    <span><strong className="text-slate-700">${p.monthlyPremium}/mo</strong></span>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={onOpenInsuranceModal}
              className="w-full py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition shadow-sm flex items-center justify-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" /> Apply New Policy
            </button>
          </div>

          {/* Claims Status Widget */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-4 h-4 text-amber-500" /> Active Claims Tracker
              </h2>
              <button
                onClick={() => setActiveTab('claims')}
                className="text-[11px] text-blue-600 hover:text-blue-700 font-medium"
              >
                Tracker View
              </button>
            </div>

            {claims.map(claim => (
              <div key={claim.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] text-amber-600 font-bold uppercase">{claim.id}</span>
                    <p className="font-semibold text-slate-800">{claim.claimType}</p>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    claim.step === 4 ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-amber-50 text-amber-700 border border-amber-100'
                  }`}>
                    {claim.status}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] text-slate-500">
                    <span>Progress: Step {claim.step} of 4</span>
                    <span>${claim.amount.toFixed(2)}</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${claim.step === 4 ? 'bg-emerald-500' : 'bg-amber-500'}`}
                      style={{ width: `${(claim.step / 4) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>

    </div>
  );
}
