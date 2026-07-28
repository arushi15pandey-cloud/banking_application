'use client';

import React, { useState } from 'react';
import { useBanking } from '../context/BankingContext';
import { 
  ShieldCheck, 
  Bell, 
  Search, 
  CheckCircle, 
  Lock, 
  User, 
  LogOut,
  ChevronDown,
  X,
  CreditCard
} from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, onOpenTransfer, onOpenInsuranceModal }) {
  const { user, notifications, markAllNotificationsRead } = useBanking();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0b0f19]/80 backdrop-blur-xl border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Brand Logo & Tagline */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-emerald-400 p-0.5 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <div className="w-full h-full bg-[#0b0f19] rounded-[10px] flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-lg tracking-tight text-white">APEX</span>
              <span className="text-xs font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                Bank & Shield
              </span>
            </div>
            <p className="text-[10px] text-slate-400 -mt-0.5 hidden sm:block">Unified Wealth & Protection Portal</p>
          </div>
        </div>

        {/* Global Search Bar */}
        <div className="hidden md:flex flex-1 max-w-md items-center relative">
          <Search className="w-4 h-4 absolute left-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search accounts, transfers, insurance policies or claims..."
            className="w-full pl-9 pr-4 py-1.5 bg-slate-900/90 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-blue-500/60 focus:ring-1 focus:ring-blue-500/60 transition"
          />
        </div>

        {/* Right Header Actions */}
        <div className="flex items-center gap-3">
          
          {/* Quick CTA Buttons */}
          <div className="hidden sm:flex items-center gap-2">
            <button
              onClick={onOpenTransfer}
              className="text-xs font-medium px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/80 transition flex items-center gap-1.5"
            >
              <CreditCard className="w-3.5 h-3.5 text-blue-400" />
              Transfer
            </button>
            <button
              onClick={onOpenInsuranceModal}
              className="text-xs font-semibold px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white shadow-md shadow-emerald-900/30 transition flex items-center gap-1.5"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              Get Insured
            </button>
          </div>

          {/* Security Badge */}
          <div className="hidden lg:flex items-center gap-1.5 text-[11px] font-medium text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
            <Lock className="w-3 h-3 text-emerald-400" />
            256-Bit Encrypted
          </div>

          {/* Notification Center */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowUserMenu(false);
              }}
              className="relative p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Popover */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-[#131b2e] border border-slate-800 rounded-2xl shadow-2xl z-50 overflow-hidden animate-fade-in">
                <div className="p-3.5 border-b border-slate-800/80 flex items-center justify-between bg-slate-900/60">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-blue-400" />
                    <span className="font-semibold text-xs text-white">Activity Alerts</span>
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllNotificationsRead}
                      className="text-[10px] text-blue-400 hover:text-blue-300 font-medium"
                    >
                      Mark all as read
                    </button>
                  )}
                </div>
                <div className="max-h-80 overflow-y-auto divide-y divide-slate-800/50">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center text-xs text-slate-500">No notifications</div>
                  ) : (
                    notifications.map(n => (
                      <div
                        key={n.id}
                        className={`p-3.5 text-xs transition ${n.unread ? 'bg-blue-950/20' : 'hover:bg-slate-800/40'}`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <p className="font-medium text-slate-200">{n.title}</p>
                          <span className="text-[10px] text-slate-500 whitespace-nowrap">{n.time}</span>
                        </div>
                        <p className="text-slate-400 mt-1 text-[11px] leading-relaxed">{n.text}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Menu */}
          <div className="relative">
            <button
              onClick={() => {
                setShowUserMenu(!showUserMenu);
                setShowNotifications(false);
              }}
              className="flex items-center gap-2.5 p-1 pl-2 pr-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 transition"
            >
              <img
                src={user.avatar}
                alt={user.name}
                className="w-7 h-7 rounded-lg object-cover ring-1 ring-blue-500/40"
              />
              <div className="hidden sm:block text-left">
                <p className="text-xs font-semibold text-white leading-tight">{user.name}</p>
                <p className="text-[10px] text-emerald-400 font-medium leading-none mt-0.5">FICO {user.creditScore}</p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {/* Profile Dropdown */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-[#131b2e] border border-slate-800 rounded-2xl shadow-2xl z-50 overflow-hidden p-2 animate-fade-in">
                <div className="p-3 rounded-xl bg-slate-900/80 mb-2 border border-slate-800">
                  <p className="text-xs font-bold text-white">{user.name}</p>
                  <p className="text-[11px] text-slate-400">{user.email}</p>
                  <div className="mt-2 flex items-center justify-between text-[10px] pt-2 border-t border-slate-800 text-slate-400">
                    <span>Account: {user.accountNumber}</span>
                    <span className="text-emerald-400 font-medium">{user.riskRating}</span>
                  </div>
                </div>
                
                <button
                  onClick={() => {
                    setActiveTab('dashboard');
                    setShowUserMenu(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg text-xs text-slate-300 hover:bg-slate-800 hover:text-white flex items-center gap-2 transition"
                >
                  <User className="w-3.5 h-3.5 text-blue-400" />
                  Account Settings & Security
                </button>
                <button
                  onClick={() => {
                    setActiveTab('insurance');
                    setShowUserMenu(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg text-xs text-slate-300 hover:bg-slate-800 hover:text-white flex items-center gap-2 transition"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  My Active Insurance Policies
                </button>
                
                <div className="my-1 border-t border-slate-800/80"></div>
                
                <button
                  onClick={() => setShowUserMenu(false)}
                  className="w-full text-left px-3 py-2 rounded-lg text-xs text-rose-400 hover:bg-rose-500/10 flex items-center gap-2 transition"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Sign Out Session
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
}
