'use client';

import React, { useState } from 'react';
import { useBanking } from '../../../context/BankingContext';
import { User, Mail, ShieldCheck, Lock, Award, CheckCircle2 } from 'lucide-react';

export default function ProfilePage() {
  const { user, updateProfile } = useBanking();

  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSave = (e) => {
    e.preventDefault();
    if (!name || !email) {
      setErrorMsg('Full Name and Email are required.');
      return;
    }

    const res = updateProfile(name, email);
    if (res.success) {
      setErrorMsg('');
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } else {
      setErrorMsg(res.message);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in text-xs max-w-2xl mx-auto">
      
      {/* Page Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <User className="w-5 h-5 text-blue-600" /> Personal Profile & Settings
          </h1>
          <p className="text-[11px] text-slate-500 mt-0.5">Manage your identity, login email, and security configurations.</p>
        </div>
      </div>

      {showSuccess && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-150 text-emerald-700 font-semibold flex items-center gap-2 animate-pulse">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>Profile settings updated successfully! Changes applied globally.</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-150 text-rose-600 font-semibold flex items-center gap-2">
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Profile Overview Card */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 flex flex-col sm:flex-row items-center gap-5 shadow-sm">
        <img
          src={user.avatar}
          alt={user.name}
          className="w-20 h-20 rounded-2xl object-cover border border-slate-200 ring-2 ring-blue-500/10"
        />
        <div className="text-center sm:text-left space-y-1.5 flex-1">
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <h2 className="text-base font-bold text-slate-900">{user.name}</h2>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-750 font-bold text-[10px] border border-emerald-100 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> Fully Verified
            </span>
          </div>
          <p className="text-slate-500 font-medium">{user.email}</p>
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-[10px] text-slate-400 font-semibold">
            <span>Primary Account: <strong className="text-slate-655 font-mono">{user.accountNumber}</strong></span>
            <span className="hidden sm:inline">•</span>
            <span>Risk Index: <strong className="text-emerald-600">{user.riskRating}</strong></span>
          </div>
        </div>
      </div>

      {/* Edit Form */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Fields Card */}
        <div className="md:col-span-2 p-6 rounded-3xl bg-white border border-slate-200 space-y-5 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">Identity Details</h3>
          
          <form onSubmit={handleSave} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-slate-700 font-semibold">Full Legal Name</label>
              <div className="relative flex items-center">
                <User className="w-4 h-4 text-slate-400 absolute left-3" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 font-medium"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-slate-700 font-semibold">Registered Email Address</label>
              <div className="relative flex items-center">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 font-medium"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-slate-450 font-semibold">Login Password</label>
              <div className="relative flex items-center">
                <Lock className="w-4 h-4 text-slate-350 absolute left-3" />
                <input
                  type="password"
                  disabled
                  value="••••••••••••••••"
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-400 cursor-not-allowed select-none focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition shadow-sm"
            >
              Save Profile Updates
            </button>
          </form>
        </div>

        {/* Credit Info Card */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200 space-y-4 shadow-sm h-fit">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
            <Award className="w-4 h-4 text-amber-500" /> Credit Profile
          </h3>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-1">
            <span className="text-[10px] text-slate-550 uppercase font-semibold">Live FICO® Score</span>
            <p className="text-3xl font-black text-emerald-600">{user.creditScore}</p>
            <p className="text-xs text-emerald-600 font-medium">Prime Tier Rating</p>
          </div>

          <div className="p-3 rounded-xl bg-blue-50/40 border border-blue-100 text-[10.5px] text-slate-600 leading-relaxed">
            <span className="font-bold text-blue-700 block mb-0.5">FDIC Protection Binded</span>
            Your deposits are protected up to $250,000 under FDIC registration numbers.
          </div>
        </div>

      </div>

    </div>
  );
}
