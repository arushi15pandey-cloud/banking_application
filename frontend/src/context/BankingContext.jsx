'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

const BankingContext = createContext();

// New user session — starts clean with 0 balances and no dummy transactions
const createInitialData = (name, email) => ({
  user: {
    name,
    email,
    accountNumber: '1092-' + Math.floor(1000 + Math.random() * 9000) + '-552',
    creditScore: 750,
    riskRating: 'Low Risk',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256'
  },
  accounts: [
    {
      id: 'chk-1',
      name: 'Premier Checking',
      accountNumber: '•••• 8892',
      type: 'checking',
      balance: 0.00,
      currency: '$',
      icon: 'Landmark',
    },
    {
      id: 'sav-1',
      name: 'High-Yield Growth Savings',
      accountNumber: '•••• 4412',
      type: 'savings',
      balance: 0.00,
      apy: '4.85%',
      currency: '$',
      icon: 'PiggyBank',
    },
    {
      id: 'crd-1',
      name: 'Apex Sapphire Reserve',
      accountNumber: '•••• 1928',
      type: 'credit',
      balance: 0.00,
      creditLimit: 20000.00,
      dueDate: 'Aug 12, 2026',
      currency: '$',
      icon: 'CreditCard',
    }
  ],
  transactions: [],
  policies: [],
  claims: [],
  notifications: []
});

// localStorage helpers — data is keyed per user email
const userDataKey = (email) => `apex_bank_data_${email.toLowerCase()}`;

const saveUserData = (email, data) => {
  try {
    localStorage.setItem(userDataKey(email), JSON.stringify(data));
  } catch (e) {
    // localStorage unavailable (SSR or storage full) — fail silently
  }
};

const loadUserData = (email) => {
  try {
    const raw = localStorage.getItem(userDataKey(email));
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
};

export function BankingProvider({ children }) {
  const [user, setUser] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [policies, setPolicies] = useState([]);
  const [claims, setClaims] = useState([]);
  const [notifications, setNotifications] = useState([]);

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isInsuranceModalOpen, setIsInsuranceModalOpen] = useState(false);
  const [isClaimModalOpen, setIsClaimModalOpen] = useState(false);

  // Auto-save all user-specific data to localStorage whenever state changes
  useEffect(() => {
    if (isAuthenticated && user?.email) {
      saveUserData(user.email, { user, accounts, transactions, policies, claims, notifications });
    }
  }, [isAuthenticated, user, accounts, transactions, policies, claims, notifications]);

  // Load an existing user's data from localStorage, or create fresh data for a new user
  const loadOrCreateUserSession = (name, email) => {
    const existing = loadUserData(email);
    if (existing) {
      setUser(existing.user);
      setAccounts(existing.accounts);
      setTransactions(existing.transactions);
      setPolicies(existing.policies);
      setClaims(existing.claims);
      setNotifications(existing.notifications);
    } else {
      const fresh = createInitialData(name, email);
      setUser({ ...fresh.user, name, email });
      setAccounts(fresh.accounts);
      setTransactions(fresh.transactions);
      setPolicies(fresh.policies);
      setClaims(fresh.claims);
      setNotifications(fresh.notifications);
    }
  };

  // Auth Operations
  const login = (email, password) => {
    if (!email) return { success: false, message: 'Email is required.' };

    const existing = loadUserData(email);
    const displayName = existing?.user?.name
      || email.split('@')[0].split('.').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');

    loadOrCreateUserSession(displayName, email);
    setIsAuthenticated(true);
    return { success: true };
  };

  const signup = (name, email, password) => {
    if (!name || !email) return { success: false, message: 'Name and email are required.' };
    loadOrCreateUserSession(name, email);
    setIsAuthenticated(true);
    return { success: true };
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    setAccounts([]);
    setTransactions([]);
    setPolicies([]);
    setClaims([]);
    setNotifications([]);
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
