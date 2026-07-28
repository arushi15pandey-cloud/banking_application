'use client';

import React, { useState } from 'react';
import { BankingProvider, useBanking } from '../context/BankingContext';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Dashboard from '../components/Dashboard';
import Transfers from '../components/Transfers';
import InsurancePortal from '../components/InsurancePortal';
import InsuranceApplicationModal from '../components/InsuranceApplicationModal';
import ClaimsManager from '../components/ClaimsManager';
import Analytics from '../components/Analytics';

function AppContent() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isInsuranceModalOpen, setIsInsuranceModalOpen] = useState(false);
  const [isClaimModalOpen, setIsClaimModalOpen] = useState(false);

  const handleOpenTransfer = () => {
    setActiveTab('transfers');
  };

  const handleOpenInsuranceModal = () => {
    setIsInsuranceModalOpen(true);
  };

  const handleOpenClaimModal = () => {
    setActiveTab('claims');
    setIsClaimModalOpen(true);
  };

  const handlePolicyApplied = (newPolicy) => {
    setActiveTab('insurance');
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col font-sans selection:bg-blue-500 selection:text-white">
      {/* Top Header Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenTransfer={handleOpenTransfer}
        onOpenInsuranceModal={handleOpenInsuranceModal}
      />

      {/* Main Layout Container */}
      <div className="flex-1 max-w-7xl w-full mx-auto flex flex-col md:flex-row">
        {/* Left Navigation Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onOpenInsuranceModal={handleOpenInsuranceModal}
        />

        {/* Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {activeTab === 'dashboard' && (
            <Dashboard
              setActiveTab={setActiveTab}
              onOpenTransfer={handleOpenTransfer}
              onOpenInsuranceModal={handleOpenInsuranceModal}
              onOpenClaimModal={handleOpenClaimModal}
            />
          )}

          {activeTab === 'transfers' && (
            <Transfers />
          )}

          {activeTab === 'insurance' && (
            <InsurancePortal
              onOpenInsuranceModal={handleOpenInsuranceModal}
              onOpenClaimModal={handleOpenClaimModal}
            />
          )}

          {activeTab === 'claims' && (
            <ClaimsManager
              isOpenClaimModal={isClaimModalOpen}
              onCloseClaimModal={() => setIsClaimModalOpen(false)}
            />
          )}

          {activeTab === 'analytics' && (
            <Analytics />
          )}
        </main>
      </div>

      {/* Interactive Insurance Application Modal Wizard */}
      <InsuranceApplicationModal
        isOpen={isInsuranceModalOpen}
        onClose={() => setIsInsuranceModalOpen(false)}
        onPolicyApplied={handlePolicyApplied}
      />

      {/* Footer Branding Bar */}
      <footer className="w-full border-t border-slate-800/80 bg-[#080b12] py-4 px-6 text-center text-xs text-slate-500">
        <p>© 2026 Apex Bank & Shield Insurance Services Inc. Member FDIC & Equal Housing Lender. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default function Home() {
  return (
    <BankingProvider>
      <AppContent />
    </BankingProvider>
  );
}