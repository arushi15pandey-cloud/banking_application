'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useBanking } from '../../../context/BankingContext';
import InsurancePortal from '../../../components/InsurancePortal';

export default function InsurancePage() {
  const router = useRouter();
  const { setIsInsuranceModalOpen, setIsClaimModalOpen } = useBanking();

  return (
    <InsurancePortal
      onOpenInsuranceModal={() => setIsInsuranceModalOpen(true)}
      onOpenClaimModal={() => {
        setIsClaimModalOpen(true);
        router.push('/dashboard/claims');
      }}
    />
  );
}
