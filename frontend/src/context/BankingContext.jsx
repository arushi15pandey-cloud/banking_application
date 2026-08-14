'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const BankingContext = createContext();

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// ─── Token Helpers (localStorage, client-side only) ─────────────────────────
const getToken = () => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('apex_token');
};

const setToken = (token) => {
  if (typeof window !== 'undefined') localStorage.setItem('apex_token', token);
};

const removeToken = () => {
  if (typeof window !== 'undefined') localStorage.removeItem('apex_token');
};

// ─── Authenticated fetch wrapper ─────────────────────────────────────────────
const apiFetch = async (path, options = {}) => {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };
  const res = await fetch(`${API}${path}`, { ...options, headers });
  const data = await res.json();
  return { ok: res.ok, status: res.status, data };
};

// ─── Provider ────────────────────────────────────────────────────────────────
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
  const [isLoading, setIsLoading] = useState(true);

  // ── Load all user data from MongoDB ────────────────────────────────────────
  const loadAllData = useCallback(async () => {
    try {
      const [userRes, accRes, txRes, polRes, clmRes, notifRes] = await Promise.all([
        apiFetch('/api/user'),
        apiFetch('/api/accounts'),
        apiFetch('/api/transactions'),
        apiFetch('/api/policies'),
        apiFetch('/api/claims'),
        apiFetch('/api/notifications'),
      ]);

      if (!userRes.ok) throw new Error('Session invalid');

      setUser(userRes.data.data);
      setAccounts(accRes.data.data || []);
      setTransactions(txRes.data.data || []);
      setPolicies(polRes.data.data || []);
      setClaims(clmRes.data.data || []);
      setNotifications(notifRes.data.data || []);
      setIsAuthenticated(true);
    } catch {
      // Token invalid or expired — clear everything
      removeToken();
      setIsAuthenticated(false);
      setUser(null);
    }
  }, []);

  // ── On mount: restore session if token exists ───────────────────────────────
  useEffect(() => {
    const init = async () => {
      if (getToken()) {
        await loadAllData();
      }
      setIsLoading(false);
    };
    init();
  }, [loadAllData]);

  // ── Auth: Login ─────────────────────────────────────────────────────────────
  const login = async (email, password) => {
    try {
      const { ok, data } = await apiFetch('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      if (!ok) return { success: false, message: data.message || 'Login failed.' };

      setToken(data.token);
      await loadAllData();
      return { success: true };
    } catch (err) {
      return { success: false, message: 'Unable to reach server. Is the backend running?' };
    }
  };

  // ── Auth: Signup ─────────────────────────────────────────────────────────────
  const signup = async (name, email, password) => {
    try {
      const { ok, data } = await apiFetch('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password }),
      });

      if (!ok) return { success: false, message: data.message || 'Registration failed.' };

      setToken(data.token);
      await loadAllData();
      return { success: true };
    } catch (err) {
      return { success: false, message: 'Unable to reach server. Is the backend running?' };
    }
  };

  // ── Auth: Logout ─────────────────────────────────────────────────────────────
  const logout = () => {
    removeToken();
    setIsAuthenticated(false);
    setUser(null);
    setAccounts([]);
    setTransactions([]);
    setPolicies([]);
    setClaims([]);
    setNotifications([]);
  };

  // ── Update profile ───────────────────────────────────────────────────────────
  const updateProfile = async (name, email) => {
    try {
      const { ok, data } = await apiFetch('/api/user', {
        method: 'PUT',
        body: JSON.stringify({ name, email }),
      });
      if (!ok) return { success: false, message: data.message };
      setUser(data.data);
      return { success: true };
    } catch {
      return { success: false, message: 'Failed to update profile.' };
    }
  };

  // ── Transfer Funds ───────────────────────────────────────────────────────────
  const transferFunds = async ({ fromAccId, toAccId, recipientName, recipientAccount, amount, note }) => {
    try {
      const { ok, data } = await apiFetch('/api/transfer', {
        method: 'POST',
        body: JSON.stringify({ fromAccId, toAccId, recipientName, recipientAccount, amount, note }),
      });

      if (!ok) return { success: false, message: data.message || 'Transfer failed.' };

      // Refresh accounts, transactions, notifications from MongoDB
      const [accRes, txRes, notifRes] = await Promise.all([
        apiFetch('/api/accounts'),
        apiFetch('/api/transactions'),
        apiFetch('/api/notifications'),
      ]);
      setAccounts(accRes.data.data || []);
      setTransactions(txRes.data.data || []);
      setNotifications(notifRes.data.data || []);

      return { success: true, message: data.message };
    } catch {
      return { success: false, message: 'Unable to reach server.' };
    }
  };

  // ── Apply for Insurance ──────────────────────────────────────────────────────
  const applyForInsurance = async (newPolicyData) => {
    try {
      const { ok, data } = await apiFetch('/api/policies', {
        method: 'POST',
        body: JSON.stringify(newPolicyData),
      });

      if (!ok) throw new Error(data.message || 'Failed to apply for insurance.');

      // Refresh policies, accounts (premium debited), transactions, notifications
      const [polRes, accRes, txRes, notifRes] = await Promise.all([
        apiFetch('/api/policies'),
        apiFetch('/api/accounts'),
        apiFetch('/api/transactions'),
        apiFetch('/api/notifications'),
      ]);
      setPolicies(polRes.data.data || []);
      setAccounts(accRes.data.data || []);
      setTransactions(txRes.data.data || []);
      setNotifications(notifRes.data.data || []);

      return data.data; // the new policy object
    } catch (err) {
      throw err;
    }
  };

  // ── Submit Insurance Claim ───────────────────────────────────────────────────
  const submitClaim = async (claimData) => {
    try {
      const { ok, data } = await apiFetch('/api/claims', {
        method: 'POST',
        body: JSON.stringify(claimData),
      });

      if (!ok) throw new Error(data.message || 'Failed to submit claim.');

      // Refresh claims and notifications
      const [clmRes, notifRes] = await Promise.all([
        apiFetch('/api/claims'),
        apiFetch('/api/notifications'),
      ]);
      setClaims(clmRes.data.data || []);
      setNotifications(notifRes.data.data || []);

      return data.data; // the new claim object
    } catch (err) {
      throw err;
    }
  };

  // ── Mark All Notifications Read ──────────────────────────────────────────────
  const markAllNotificationsRead = async () => {
    try {
      await apiFetch('/api/notifications/mark-read', { method: 'PUT' });
      setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
    } catch {
      // fail silently
    }
  };

  return (
    <BankingContext.Provider value={{
      user,
      accounts,
      transactions,
      policies,
      claims,
      notifications,
      isAuthenticated,
      isLoading,
      isInsuranceModalOpen,
      setIsInsuranceModalOpen,
      isClaimModalOpen,
      setIsClaimModalOpen,
      login,
      signup,
      logout,
      updateProfile,
      transferFunds,
      applyForInsurance,
      submitClaim,
      markAllNotificationsRead,
      refreshData: loadAllData,
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
