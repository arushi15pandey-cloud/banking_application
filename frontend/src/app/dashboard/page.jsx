'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useBanking } from '../../context/BankingContext';
import Dashboard from '../../components/Dashboard';

export default function DashboardPage() {
  const router = useRouter();
  const { setIsInsuranceModalOpen, setIsClaimModalOpen } = useBanking();

  return (
    <Dashboard
      setActiveTab={(tab) => {
        if (tab === 'dashboard') router.push('/dashboard');
        else if (tab === 'insurance') router.push('/dashboard/insurance');
        else if (tab === 'transfers') router.push('/dashboard/transfers');
        else if (tab === 'claims') router.push('/dashboard/claims');
        else if (tab === 'analytics') router.push('/dashboard/analytics');
      }}
      onOpenTransfer={() => router.push('/dashboard/transfers')}
      onOpenInsuranceModal={() => setIsInsuranceModalOpen(true)}
      onOpenClaimModal={() => {
        setIsClaimModalOpen(true);
        router.push('/dashboard/claims');
      }}
    />
  );
}
