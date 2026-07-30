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
    <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-xl border-b border-slate-200/80 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Brand Logo & Tagline */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-emerald-400 p-0.5 flex items-center justify-center shadow shadow-blue-500/10">
            <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-emerald-500" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-lg tracking-tight text-slate-900">APEX</span>
              <span className="text-xs font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-200/60">
                Shield
              </span>
            </div>
            <p className="text-[10px] text-slate-500 -mt-0.5 hidden sm:block">Unified Wealth & Protection Portal</p>
          </div>
        </div>

        {/* Global Search Bar */}
        <div className="hidden md:flex flex-1 max-w-md items-center relative">
          <Search className="w-4 h-4 absolute left-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search accounts, transfers, insurance policies or claims..."
            className="w-full pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-500/60 focus:ring-1 focus:ring-blue-500/60 transition"
          />
        </div>

        {/* Right Header Actions */}
        <div className="flex items-center gap-3">
          
          {/* Quick CTA Buttons */}
          <div className="hidden sm:flex items-center gap-2">
            <button
              onClick={onOpenTransfer}
              className="text-xs font-medium px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition flex items-center gap-1.5"
            >
              <CreditCard className="w-3.5 h-3.5 text-blue-500" />
              Transfer
            </button>
            <button
              onClick={onOpenInsuranceModal}
              className="text-xs font-semibold px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow transition flex items-center gap-1.5"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              Get Insured
            </button>
          </div>

          {/* Security Badge */}
          <div className="hidden lg:flex items-center gap-1.5 text-[11px] font-medium text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/60">
            <Lock className="w-3 h-3 text-emerald-600" />
            256-Bit Encrypted
          </div>

          {/* Notification Center */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowUserMenu(false);
              }}
              className="relative p-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-900 transition"
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
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 overflow-hidden animate-fade-in">
                <div className="p-3.5 border-b border-slate-200/80 flex items-center justify-between bg-slate-50">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-blue-500" />
                    <span className="font-semibold text-xs text-slate-900">Activity Alerts</span>
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllNotificationsRead}
                      className="text-[10px] text-blue-600 hover:text-blue-500 font-medium"
                    >
                      Mark all as read
                    </button>
                  )}
                </div>
                <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center text-xs text-slate-400">No notifications</div>
                  ) : (
                    notifications.map(n => (
                      <div
                        key={n.id}
                        className={`p-3.5 text-xs transition ${n.unread ? 'bg-blue-50/50' : 'hover:bg-slate-50'}`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <p className="font-medium text-slate-800">{n.title}</p>
                          <span className="text-[10px] text-slate-400 whitespace-nowrap">{n.time}</span>
                        </div>
                        <p className="text-slate-600 mt-1 text-[11px] leading-relaxed">{n.text}</p>
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
              className="flex items-center gap-2.5 p-1 pl-2 pr-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 transition"
            >
              <img
                src={user.avatar}
                alt={user.name}
                className="w-7 h-7 rounded-lg object-cover ring-1 ring-blue-500/20"
              />
              <div className="hidden sm:block text-left">
                <p className="text-xs font-semibold text-slate-800 leading-tight">{user.name}</p>
                <p className="text-[10px] text-emerald-600 font-medium leading-none mt-0.5">FICO {user.creditScore}</p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
            </button>

            {/* Profile Dropdown */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 overflow-hidden p-2 animate-fade-in">
                <div className="p-3 rounded-xl bg-slate-50 mb-2 border border-slate-200">
                  <p className="text-xs font-bold text-slate-900">{user.name}</p>
                  <p className="text-[11px] text-slate-500">{user.email}</p>
                  <div className="mt-2 flex items-center justify-between text-[10px] pt-2 border-t border-slate-200 text-slate-505">
                    <span>Account: {user.accountNumber}</span>
                    <span className="text-emerald-600 font-medium">{user.riskRating}</span>
                  </div>
                </div>
                
                <button
                  onClick={() => {
                    setActiveTab('dashboard');
                    setShowUserMenu(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg text-xs text-slate-600 hover:bg-slate-50 hover:text-slate-900 flex items-center gap-2 transition"
                >
                  <User className="w-3.5 h-3.5 text-blue-500" />
                  Account Settings & Security
                </button>
                <button
                  onClick={() => {
                    setActiveTab('insurance');
                    setShowUserMenu(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg text-xs text-slate-600 hover:bg-slate-50 hover:text-slate-900 flex items-center gap-2 transition"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  My Active Insurance Policies
                </button>
                
                <div className="my-1 border-t border-slate-200/80"></div>
                
                <button
                  onClick={() => setShowUserMenu(false)}
                  className="w-full text-left px-3 py-2 rounded-lg text-xs text-rose-500 hover:bg-rose-50 flex items-center gap-2 transition"
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
