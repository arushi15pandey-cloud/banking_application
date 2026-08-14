'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

const BankingContext = createContext();

const initialAccounts = [
  {
    id: 'chk-1',
    name: 'Premier Checking',
    accountNumber: '•••• 8892',
    type: 'checking',
    balance: 14850.50,
    currency: '$',
    icon: 'Landmark',
  },
  {
    id: 'sav-1',
    name: 'High-Yield Growth Savings',
    accountNumber: '•••• 4412',
    type: 'savings',
    balance: 42300.00,
    apy: '4.85%',
    currency: '$',
    icon: 'PiggyBank',
  },
  {
    id: 'crd-1',
    name: 'Apex Sapphire Reserve',
    accountNumber: '•••• 1928',
    type: 'credit',
    balance: 2430.20,
    creditLimit: 20000.00,
    dueDate: 'Aug 12, 2026',
    currency: '$',
    icon: 'CreditCard',
  }
];

const initialTransactions = [
  {
    id: 'tx-101',
    title: 'Salary Deposit - Horizon Tech Inc',
    category: 'Income',
    amount: 6500.00,
    type: 'credit',
    date: '2026-07-25',
    account: 'Premier Checking',
    status: 'Completed'
  },
  {
    id: 'tx-102',
    title: 'Apex Shield Health Insurance Premium',
    category: 'Insurance',
    amount: 140.00,
    type: 'debit',
    date: '2026-07-15',
    account: 'Premier Checking',
    status: 'Completed'
  },
  {
    id: 'tx-103',
    title: 'Whole Foods Market',
    category: 'Shopping',
    amount: 184.30,
    type: 'debit',
    date: '2026-07-24',
    account: 'Apex Sapphire Reserve',
    status: 'Completed'
  },
  {
    id: 'tx-104',
    title: 'Tesla Supercharger',
    category: 'Transport',
    amount: 28.50,
    type: 'debit',
    date: '2026-07-23',
    account: 'Apex Sapphire Reserve',
    status: 'Completed'
  },
  {
    id: 'tx-105',
    title: 'Transfer to High-Yield Savings',
    category: 'Transfer',
    amount: 1500.00,
    type: 'debit',
    date: '2026-07-20',
    account: 'Premier Checking',
    status: 'Completed'
  }
];

const initialPolicies = [
  {
    id: 'POL-HLT-9921',
    type: 'Health',
    title: 'Apex Comprehensive Health Shield',
    coverage: 250000,
    monthlyPremium: 140.00,
    nextPaymentDate: '2026-08-15',
    status: 'Active',
    deductible: 500,
    insuredSubject: 'Alex Morgan + 1 Dependent',
    autoDebitAccount: 'Premier Checking (•••• 8892)',
    icon: 'HeartPulse',
    color: 'emerald'
  },
  {
    id: 'POL-AUT-4410',
    type: 'Auto',
    title: 'Zero-Dep Auto Protection',
    coverage: 55000,
    monthlyPremium: 85.00,
    nextPaymentDate: '2026-08-20',
    status: 'Active',
    deductible: 250,
    insuredSubject: '2024 Tesla Model Y (VIN: 5YJSA1E28P...)',
    autoDebitAccount: 'Premier Checking (•••• 8892)',
    icon: 'Car',
    color: 'blue'
  },
  {
    id: 'POL-HOM-1102',
    type: 'Home',
    title: 'Estate & Property Guard',
    coverage: 650000,
    monthlyPremium: 195.00,
    nextPaymentDate: '2026-09-01',
    status: 'Active',
    deductible: 1000,
    insuredSubject: '742 Evergreen Terrace, Seattle WA',
    autoDebitAccount: 'Premier Checking (•••• 8892)',
    icon: 'Home',
    color: 'purple'
  }
];

const initialClaims = [
  {
    id: 'CLM-8821',
    policyId: 'POL-AUT-4410',
    policyTitle: 'Zero-Dep Auto Protection',
    claimType: 'Windshield Crack Repair',
    incidentDate: '2026-07-10',
    amount: 450.00,
    status: 'Payout Disbursed',
    step: 4, // 1: Submitted, 2: Under Assessment, 3: Approved, 4: Disbursed
    description: 'Road debris cracked front windshield on Interstate 90.',
    payoutAccount: 'Premier Checking (•••• 8892)',
    submittedDate: '2026-07-11'
  },
  {
    id: 'CLM-9014',
    policyId: 'POL-HLT-9921',
    policyTitle: 'Apex Comprehensive Health Shield',
    claimType: 'Outpatient Specialist & X-Ray',
    incidentDate: '2026-07-21',
    amount: 620.00,
    status: 'Under Assessment',
    step: 2,
    description: 'Orthopedic consultation and right wrist X-ray imaging.',
    payoutAccount: 'Premier Checking (•••• 8892)',
    submittedDate: '2026-07-22'
  }
];

const initialNotifications = [
  { id: 1, title: 'Auto-Debit Executed', text: 'Health Insurance Premium $140.00 debited from Premier Checking.', time: '2 hours ago', unread: true },
  { id: 2, title: 'Claim Status Updated', text: 'Claim #CLM-9014 is currently under assessment by medical auditor.', time: '1 day ago', unread: true },
  { id: 3, title: 'Security Alert', text: 'New login detected from Chrome Windows 11.', time: '3 days ago', unread: false }
];

export function BankingProvider({ children }) {
  const [user, setUser] = useState({
    name: 'Alex Morgan',
    email: 'alex.morgan@apexbank.com',
    accountNumber: '8892-4412-901',
    creditScore: 785,
    riskRating: 'Low Risk',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256'
  });

  const [accounts, setAccounts] = useState(initialAccounts);
  const [transactions, setTransactions] = useState(initialTransactions);
  const [policies, setPolicies] = useState(initialPolicies);
  const [claims, setClaims] = useState(initialClaims);
  const [notifications, setNotifications] = useState(initialNotifications);

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isInsuranceModalOpen, setIsInsuranceModalOpen] = useState(false);
  const [isClaimModalOpen, setIsClaimModalOpen] = useState(false);

  // Auth Operations
  const login = (email, password) => {
    if (!email) return { success: false, message: 'Email is required.' };
    setIsAuthenticated(true);
    if (email !== user.email) {
      setUser(prev => ({
        ...prev,
        email: email,
        name: email.split('@')[0].split('.').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ')
      }));
    }
    return { success: true };
  };

  const signup = (name, email, password) => {
    if (!name || !email) return { success: false, message: 'Name and email are required.' };
    setUser({
      name: name,
      email: email,
      accountNumber: '1092-' + Math.floor(1000 + Math.random() * 9000) + '-552',
      creditScore: 715,
      riskRating: 'Low Risk',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256'
    });
    setIsAuthenticated(true);
    return { success: true };
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  const updateProfile = (name, email) => {
    if (!name || !email) return { success: false, message: 'Name and email are required.' };
    setUser(prev => ({ ...prev, name, email }));
    return { success: true };
  };

  // Transfer funds function
  const transferFunds = ({ fromAccId, toAccId, recipientName, recipientAccount, amount, note }) => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) return { success: false, message: 'Invalid amount.' };

    let success = false;
    let errorMsg = '';

    setAccounts(prevAccounts => {
      const sourceAcc = prevAccounts.find(a => a.id === fromAccId);
      if (!sourceAcc) {
        errorMsg = 'Source account not found.';
        return prevAccounts;
      }

      if (sourceAcc.type !== 'credit' && sourceAcc.balance < numAmount) {
        errorMsg = 'Insufficient funds in selected account.';
        return prevAccounts;
      }

      success = true;
      return prevAccounts.map(acc => {
        if (acc.id === fromAccId) {
          if (acc.type === 'credit') {
            return { ...acc, balance: acc.balance + numAmount };
          }
          return { ...acc, balance: acc.balance - numAmount };
        }
        if (toAccId && acc.id === toAccId) {
          if (acc.type === 'credit') {
            return { ...acc, balance: Math.max(0, acc.balance - numAmount) };
          }
          return { ...acc, balance: acc.balance + numAmount };
        }
        return acc;
      });
    });

    if (!success) {
      return { success: false, message: errorMsg };
    }

    // Add transaction entry
    const sourceAcc = accounts.find(a => a.id === fromAccId);
    const destAcc = toAccId ? accounts.find(a => a.id === toAccId) : null;
    const destName = destAcc ? destAcc.name : (recipientName || recipientAccount || 'External Payee');

    const newTx = {
      id: `tx-${Date.now()}`,
      title: `Transfer to ${destName}${note ? ` (${note})` : ''}`,
      category: 'Transfer',
      amount: numAmount,
      type: 'debit',
      date: new Date().toISOString().split('T')[0],
      account: sourceAcc ? sourceAcc.name : 'Checking',
      status: 'Completed'
    };

    setTransactions(prev => [newTx, ...prev]);

    // Add notification
    const newNotif = {
      id: Date.now(),
      title: 'Money Transferred',
      text: `Successfully sent ${sourceAcc?.currency || '$'}${numAmount.toFixed(2)} to ${destName}.`,
      time: 'Just now',
      unread: true
    };
    setNotifications(prev => [newNotif, ...prev]);

    return { success: true, message: 'Transfer processed instantly.' };
  };

  // Apply for Insurance
  const applyForInsurance = (newPolicyData) => {
    const policyId = `POL-${newPolicyData.type.substring(0, 3).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const monthlyPremium = parseFloat(newPolicyData.monthlyPremium);

    const newPolicy = {
      id: policyId,
      type: newPolicyData.type,
      title: newPolicyData.title,
      coverage: parseFloat(newPolicyData.coverage),
      monthlyPremium: monthlyPremium,
      nextPaymentDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'Active',
      deductible: parseFloat(newPolicyData.deductible || 500),
      insuredSubject: newPolicyData.insuredSubject,
      autoDebitAccount: 'Premier Checking (•••• 8892)',
      icon: newPolicyData.type === 'Health' ? 'HeartPulse' : newPolicyData.type === 'Auto' ? 'Car' : newPolicyData.type === 'Home' ? 'Home' : 'Shield',
      color: newPolicyData.type === 'Health' ? 'emerald' : newPolicyData.type === 'Auto' ? 'blue' : 'purple'
    };

    setPolicies(prev => [newPolicy, ...prev]);

    // Debit initial payment from primary checking account
    setAccounts(prev => prev.map(acc => {
      if (acc.id === 'chk-1') {
        return { ...acc, balance: acc.balance - monthlyPremium };
      }
      return acc;
    }));

    // Add transaction entry
    const newTx = {
      id: `tx-${Date.now()}`,
      title: `Initial Premium: ${newPolicy.title}`,
      category: 'Insurance',
      amount: monthlyPremium,
      type: 'debit',
      date: new Date().toISOString().split('T')[0],
      account: 'Premier Checking',
      status: 'Completed'
    };
    setTransactions(prev => [newTx, ...prev]);

    // Add notification
    const newNotif = {
      id: Date.now(),
      title: 'New Insurance Policy Issued! 🎉',
      text: `Policy #${policyId} for ${newPolicy.title} is now active. Auto-debit bound.`,
      time: 'Just now',
      unread: true
    };
    setNotifications(prev => [newNotif, ...prev]);

    return newPolicy;
  };

  // Submit Insurance Claim
  const submitClaim = (claimData) => {
    const claimId = `CLM-${Math.floor(1000 + Math.random() * 9000)}`;
    const selectedPolicy = policies.find(p => p.id === claimData.policyId);

    const newClaim = {
      id: claimId,
      policyId: claimData.policyId,
      policyTitle: selectedPolicy ? selectedPolicy.title : 'Insurance Policy',
      claimType: claimData.claimType,
      incidentDate: claimData.incidentDate,
      amount: parseFloat(claimData.amount),
      status: 'Submitted & Under Review',
      step: 1,
      description: claimData.description,
      payoutAccount: 'Premier Checking (•••• 8892)',
      submittedDate: new Date().toISOString().split('T')[0]
    };

    setClaims(prev => [newClaim, ...prev]);

    // Add notification
    const newNotif = {
      id: Date.now(),
      title: 'Claim Submitted Successfully',
      text: `Claim #${claimId} of $${parseFloat(claimData.amount).toFixed(2)} is received & assigned to adjuster.`,
      time: 'Just now',
      unread: true
    };
    setNotifications(prev => [newNotif, ...prev]);

    return newClaim;
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  return (
    <BankingContext.Provider value={{
      user,
      accounts,
      transactions,
      policies,
      claims,
      notifications,
      transferFunds,
      applyForInsurance,
      submitClaim,
      markAllNotificationsRead,
      isAuthenticated,
      isInsuranceModalOpen,
      setIsInsuranceModalOpen,
      isClaimModalOpen,
      setIsClaimModalOpen,
      login,
      signup,
      logout,
      updateProfile
    }}>
      {children}
    </BankingContext.Provider>
  );
}

export function useBanking() {
  const context = useContext(BankingContext);
  if (!context) {
    throw new Error('useBanking must be used within a BankingProvider');
  }
  return context;
}
