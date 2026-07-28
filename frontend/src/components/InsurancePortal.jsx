'use client';

import React from 'react';
import { useBanking } from '../context/BankingContext';
import { 
  ShieldCheck, 
  HeartPulse, 
  Car, 
  Home, 
  ShieldAlert, 
  Plus, 
  FileText, 
  CheckCircle, 
  Download, 
  Sparkles,
  ChevronRight,
  Zap,
  Lock
} from 'lucide-react';

export default function InsurancePortal({ onOpenInsuranceModal, onOpenClaimModal }) {
  const { policies, claims } = useBanking();

  const totalCoverage = policies.reduce((acc, curr) => acc + curr.coverage, 0);
  const totalMonthlyPremium = policies.reduce((acc, curr) => acc + curr.monthlyPremium, 0);

  const getPolicyIcon = (type) => {
    switch (type) {
      case 'Health': return <HeartPulse className="w-6 h-6 text-emerald-400" />;
      case 'Auto': return <Car className="w-6 h-6 text-blue-400" />;
      case 'Home': return <Home className="w-6 h-6 text-purple-400" />;
      default: return <ShieldCheck className="w-6 h-6 text-indigo-400" />;
    }
  };

  const availableProducts = [
    {
      type: 'Health',
      title: 'Apex Global Health Shield',
      desc: 'Inpatient hospitalization, critical illness cover, zero co-pay options, and outpatient dental/vision.',
      startingPrice: '$120/mo',
      icon: HeartPulse,
      color: 'emerald',
      features: ['Cashless Treatment in 10,000+ Hospitals', 'Critical Illness Cover', 'Zero Co-Pay Option']
    },
    {
      type: 'Auto',
      title: 'Zero-Dep Auto Protection',
      desc: 'Comprehensive bumper-to-bumper collision, theft, natural disaster cover & 24/7 roadside tow assist.',
      startingPrice: '$75/mo',
      icon: Car,
      color: 'blue',
      features: ['Zero Depreciation Reimbursement', 'Instant Towing & Rental Car', 'Engine & Battery Protect']
    },
    {
      type: 'Home',
      title: 'Estate & Property Guard',
      desc: 'Full protection against fire, earthquake, flood damage, personal property theft & liability cover.',
      startingPrice: '$160/mo',
      icon: Home,
      color: 'purple',
      features: ['Structural Building Insurance', 'Valuables & Jewellery Cover', 'Temporary Relocation Allowance']
    },
    {
      type: 'Life',
      title: 'Apex Term Life Assurance',
      desc: 'Guaranteed financial security for your family with up to $2,000,000 payout and terminal illness riders.',
      startingPrice: '$45/mo',
      icon: ShieldCheck,
      color: 'amber',
      features: ['Up to $2M Tax-Free Payout', 'Terminal Illness Rider Included', 'Fixed Premium Guarantee']
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Top Banner Summary */}
      <div className="relative rounded-3xl bg-gradient-to-r from-emerald-950/80 via-slate-900 to-teal-950/90 border border-slate-800 p-6 sm:p-8 overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Direct Bank-Bound Protection
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Insurance & Protection Hub
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
              You are currently covered by <strong className="text-white">${totalCoverage.toLocaleString()}</strong> in total protection limits across {policies.length} active policy plans.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-slate-900/80 px-4 py-3 rounded-2xl border border-slate-800 text-center">
              <p className="text-[10px] text-slate-400 uppercase font-semibold">Total Monthly Premiums</p>
              <p className="text-xl font-black text-emerald-400">${totalMonthlyPremium.toFixed(2)}</p>
              <p className="text-[9px] text-slate-400">Auto-debited from Checking</p>
            </div>

            <button
              onClick={onOpenInsuranceModal}
              className="px-4 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-950/40 transition flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Apply New Policy
            </button>
          </div>
        </div>
      </div>

      {/* Active Policies Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" /> Active Insurance Policies ({policies.length})
          </h2>
          <button
            onClick={onOpenClaimModal}
            className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 border border-slate-700 transition flex items-center gap-1.5"
          >
            <FileText className="w-3.5 h-3.5" /> Submit Claim
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {policies.map(p => (
            <div
              key={p.id}
              className="p-5 rounded-2xl bg-[#131b2e] border border-slate-800 hover:border-slate-700 transition space-y-4 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                      {getPolicyIcon(p.type)}
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-mono font-bold uppercase">{p.id}</span>
                      <h3 className="text-xs font-bold text-slate-200">{p.title}</h3>
                    </div>
                  </div>

                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {p.status}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Total Coverage:</span>
                    <span className="font-bold text-white">${p.coverage.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Monthly Premium:</span>
                    <span className="font-bold text-emerald-400">${p.monthlyPremium.toFixed(2)}/mo</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Policy Deductible:</span>
                    <span className="text-slate-300">${p.deductible}</span>
                  </div>
                  <div className="flex justify-between border-t border-slate-800/80 pt-2 text-[11px]">
                    <span className="text-slate-500">Insured Subject:</span>
                    <span className="text-slate-300 font-medium truncate max-w-[150px]">{p.insuredSubject}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <button
                  onClick={() => alert(`Downloading official e-Policy document for ${p.id}...`)}
                  className="text-slate-400 hover:text-white font-medium flex items-center gap-1 text-[11px]"
                >
                  <Download className="w-3 h-3 text-blue-400" /> e-Policy Certificate
                </button>
                <span className="text-[10px] text-slate-500">Auto-debit Active</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Available Insurance Products Catalog */}
      <div className="space-y-4 pt-4">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Zap className="w-5 h-5 text-blue-400" /> Available Insurance Coverage Plans
          </h2>
          <p className="text-xs text-slate-400">Select a product to calculate instant quotes and bind policy coverage.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {availableProducts.map(prod => {
            const Icon = prod.icon;
            return (
              <div
                key={prod.type}
                className="p-5 rounded-2xl bg-[#131b2e] border border-slate-800 hover:border-blue-500/40 transition flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className={`p-3 rounded-xl ${
                      prod.color === 'emerald' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                      prod.color === 'blue' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                      prod.color === 'purple' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' :
                      'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    }`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-bold text-white">{prod.startingPrice}</span>
                  </div>

                  <h3 className="text-sm font-bold text-white mb-1">{prod.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed mb-3">{prod.desc}</p>

                  <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
                    {prod.features.map((feat, i) => (
                      <div key={i} className="flex items-center gap-2 text-[11px] text-slate-300">
                        <CheckCircle className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={onOpenInsuranceModal}
                  className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-blue-600 text-slate-200 hover:text-white font-semibold text-xs transition border border-slate-800 flex items-center justify-center gap-1.5"
                >
                  Apply & Get Quote <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
