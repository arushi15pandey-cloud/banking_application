'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useBanking } from '../../context/BankingContext';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import InsuranceApplicationModal from '../../components/InsuranceApplicationModal';
import { ShieldCheck } from 'lucide-react';

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const { 
    isAuthenticated, 
    isInsuranceModalOpen, 
    setIsInsuranceModalOpen,
    applyForInsurance 
  } = useBanking();
  
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    // Check if authenticated. If not, redirect to login
    if (!isAuthenticated) {
      router.push('/login');
    } else {
      setCheckingAuth(false);
    }
  }, [isAuthenticated, router]);

  // Renders a loading / authenticating state before redirect or compile
  if (checkingAuth || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 font-sans text-slate-800">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-emerald-450 p-0.5 flex items-center justify-center animate-bounce shadow">
            <div className="w-full h-full bg-white rounded-[12px] flex items-center justify-center">
              <ShieldCheck className="w-8 h-8 text-emerald-500" />
            </div>
          </div>
          <div className="text-center">
            <p className="text-sm font-extrabold text-slate-900 tracking-tight">Authenticating Session...</p>
            <p className="text-[10px] text-slate-500 mt-0.5">Securing encrypted bank access</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-blue-500 selection:text-white">
      {/* Top Header Navbar */}
      <Navbar />

      {/* Main Layout Container */}
      <div className="flex-1 max-w-7xl w-full mx-auto flex flex-col md:flex-row">
        {/* Left Navigation Sidebar */}
        <Sidebar />

        {/* Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>

      {/* Global Insurance Application Modal Wizard */}
      <InsuranceApplicationModal
        isOpen={isInsuranceModalOpen}
        onClose={() => setIsInsuranceModalOpen(false)}
        onPolicyApplied={(newPolicy) => {
          setIsInsuranceModalOpen(false);
          router.push('/dashboard/insurance');
        }}
      />

      {/* Footer Branding Bar */}
      <footer className="w-full border-t border-slate-200 bg-white py-4 px-6 text-center text-xs text-slate-400">
        <p>© 2026 Apex Bank & Shield Insurance Services Inc. Member FDIC & Equal Housing Lender. All rights reserved.</p>
      </footer>
    </div>
  );
}
