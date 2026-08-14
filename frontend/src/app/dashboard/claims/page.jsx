'use client';

import React from 'react';
import { useBanking } from '../../../context/BankingContext';
import ClaimsManager from '../../../components/ClaimsManager';

export default function ClaimsPage() {
  const { isClaimModalOpen, setIsClaimModalOpen } = useBanking();

  return (
    <ClaimsManager
      isOpenClaimModal={isClaimModalOpen}
      onCloseClaimModal={() => setIsClaimModalOpen(false)}
    />
  );
}
