'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useBanking } from '../context/BankingContext';
import {
  ShieldCheck,
  ArrowRight,
  TrendingUp,
  Zap,
  Lock,
  PiggyBank,
  ShieldAlert,
  Star
} from 'lucide-react';

export default function LandingPage() {
  const router = useRouter();
  const { isAuthenticated } = useBanking();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-blue-500 selection:text-white animate-fade-in">

      {/* Landing Navbar Header */}
      <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-xl border-b border-slate-200/80 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-emerald-400 p-0.5 flex items-center justify-center shadow shadow-blue-500/10">
              <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center">
                <ShieldCheck className="w-6 h-6 text-emerald-500" />
              </div>
            </div>
            <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-lg tracking-tight text-slate-900">Online Banking System</span>
            </div>
          </div>
          </div>

          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <button
                onClick={() => router.push('/dashboard')}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition shadow-sm flex items-center gap-1.5"
              >
                Go to Dashboard <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <>
                <button
                  onClick={() => router.push('/login')}
                  className="text-xs font-medium px-4 py-2 rounded-xl text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition"
                >
                  Sign In
                </button>
                <button
                  onClick={() => router.push('/signup')}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition shadow-sm"
                >
                  Open Account
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 flex flex-col items-center text-center space-y-8">

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-150 text-blue-600 text-[11px] font-semibold tracking-wider uppercase">
          <Zap className="w-3.5 h-3.5" /> Next-Generation Wealth Management
        </div>

        <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight leading-[1.1] max-w-4xl">
          A Smarter Way to Bank.<br />
          <span className="text-blue-600">
            A Safer Way to Protect.
          </span>
        </h1>

        <p className="text-sm sm:text-base text-slate-500 max-w-2xl leading-relaxed">
          Our unified platform lets you check balances, wire instant transfers, calculate real-time premiums, and file claims—all inside a single high-security portal.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          {isAuthenticated ? (
            <button
              onClick={() => router.push('/dashboard')}
              className="px-6 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs transition shadow flex items-center gap-2"
            >
              Enter Dashboard Portal <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <>
              <button
                onClick={() => router.push('/signup')}
                className="px-6 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs transition shadow flex items-center gap-2"
              >
                Create Account Instantly <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => router.push('/login')}
                className="px-6 py-3.5 rounded-2xl bg-white border border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-50 font-extrabold text-xs transition shadow-sm"
              >
                Sign In to Your Account
              </button>
            </>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 text-[11px] text-slate-500 font-semibold pt-4">
          <span className="flex items-center gap-1.5"><Lock className="w-3.5 h-3.5 text-blue-500" /> 256-Bit Encryption</span>
          <span className="flex items-center gap-1.5"><PiggyBank className="w-3.5 h-3.5 text-emerald-500" /> FDIC Insured Balances</span>
          <span className="flex items-center gap-1.5"><ShieldAlert className="w-3.5 h-3.5 text-amber-500" /> Instant Claims Binding</span>
        </div>

        {/* Features Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full pt-16">
          <div className="p-6 rounded-3xl bg-white border border-slate-200 text-left space-y-3 shadow-sm hover:shadow-md transition">
            <div className="p-3 w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">4.85% APY High-Yield Savings</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Grow capital effortlessly. Link automated deposits, calculate yields dynamically, and withdraw funds immediately with zero penalties.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200 text-left space-y-3 shadow-sm hover:shadow-md transition">
            <div className="p-3 w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Direct Insurance Binding</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Activate Health, Auto, Home & Life protection in minutes. Get live quotes, authorize auto-debits, and download e-Certificates instantly.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200 text-left space-y-3 shadow-sm hover:shadow-md transition">
            <div className="p-3 w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 border border-amber-100 flex items-center justify-center">
              <Star className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Real-Time Claims Payouts</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Submit claim files, attach medical receipts or collision pictures, track progress timelines, and receive instant checking account disbursements.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full border-t border-slate-200 bg-white py-6 px-6 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 Online Banking System. All rights reserved.</p>
          <div className="flex gap-4">
            <span className="hover:text-slate-600 cursor-pointer">Member FDIC</span>
            <span>•</span>
            <span className="hover:text-slate-600 cursor-pointer">Equal Housing Lender</span>
            <span>•</span>
            <span className="hover:text-slate-600 cursor-pointer">Security Standards</span>
          </div>
        </div>
      </footer>
    </div>
  );
}