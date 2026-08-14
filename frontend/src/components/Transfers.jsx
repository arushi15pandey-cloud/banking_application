'use client';

import React, { useState } from 'react';
import { useBanking } from '../context/BankingContext';
import { 
  ArrowLeftRight, 
  Send, 
  Landmark, 
  CheckCircle, 
  Clock, 
  ShieldCheck, 
  DollarSign, 
  User, 
  Download, 
  X,
  CreditCard,
  Building,
  Sparkles,
  AlertCircle
} from 'lucide-react';

export default function Transfers({ isOpenModal, onCloseModal }) {
  const { accounts, transferFunds, transactions } = useBanking();

  const [fromAccId, setFromAccId] = useState(accounts[0]?.id || 'chk-1');
  const [transferType, setTransferType] = useState('internal'); // 'internal' | 'external'
  const [toAccId, setToAccId] = useState(accounts[1]?.id || 'sav-1');
  const [recipientName, setRecipientName] = useState('');
  const [recipientAccount, setRecipientAccount] = useState('');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  
  const [statusState, setStatusState] = useState({ loading: false, error: '', receipt: null });

  const frequentPayees = [];

  const sourceAccount = accounts.find(a => a.id === fromAccId);
  const availableBalance = sourceAccount ? sourceAccount.balance : 0;

  const handlePresetAmount = (val) => {
    setAmount(val.toString());
  };

  const handleSelectPayee = (payee) => {
    setTransferType('external');
    setRecipientName(payee.name);
    setRecipientAccount(payee.account);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatusState({ loading: true, error: '', receipt: null });

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setStatusState({ loading: false, error: 'Please enter a valid transfer amount.', receipt: null });
      return;
    }

    if (!sourceAccount) {
      setStatusState({ loading: false, error: 'Source account not found.', receipt: null });
      return;
    }

    if (sourceAccount.type !== 'credit' && numAmount > availableBalance) {
      setStatusState({ loading: false, error: 'Transfer amount exceeds available account balance.', receipt: null });
      return;
    }

    if (transferType === 'external' && (!recipientName || !recipientAccount)) {
      setStatusState({ loading: false, error: 'Please specify recipient name and account number.', receipt: null });
      return;
    }

    // Process transfer
    setTimeout(() => {
      const res = transferFunds({
        fromAccId,
        toAccId: transferType === 'internal' ? toAccId : null,
        recipientName: transferType === 'external' ? recipientName : null,
        recipientAccount: transferType === 'external' ? recipientAccount : null,
        amount: numAmount,
        note
      });

      if (!res.success) {
        setStatusState({ loading: false, error: res.message, receipt: null });
      } else {
        const destName = transferType === 'internal' 
          ? accounts.find(a => a.id === toAccId)?.name 
          : recipientName;

        setStatusState({
          loading: false,
          error: '',
          receipt: {
            txId: `APX-TX-${Math.floor(100000 + Math.random() * 900000)}`,
            timestamp: new Date().toLocaleString(),
            fromAccountName: sourceAccount.name,
            fromAccountNum: sourceAccount.accountNumber,
            toName: destName,
            amount: numAmount,
            note: note || 'Funds Transfer'
          }
        });

        // Reset inputs
        setAmount('');
        setNote('');
      }
    }, 600);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-200/60 flex items-center gap-1">
              <ArrowLeftRight className="w-3 h-3" /> Zero Fee Instant Transfers
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Transfers & Money Movements</h1>
          <p className="text-xs text-slate-500 mt-1">
            Move money seamlessly between your checking/savings or send wire transfers to external payees.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setTransferType('internal')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition ${
              transferType === 'internal'
                ? 'bg-slate-900 text-white shadow-md'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200'
            }`}
          >
            Between My Accounts
          </button>
          <button
            onClick={() => setTransferType('external')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition ${
              transferType === 'external'
                ? 'bg-slate-900 text-white shadow-md'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200'
            }`}
          >
            To External Payee
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Transfer Form Column */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-white border border-slate-200 space-y-6 shadow-sm">
          
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {statusState.error && (
              <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{statusState.error}</span>
              </div>
            )}

            {/* From Account Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                From Source Account
              </label>
              <select
                 value={fromAccId}
                 onChange={(e) => setFromAccId(e.target.value)}
                 className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:border-blue-500 focus:outline-none"
              >
                {accounts.map(acc => (
                  <option key={acc.id} value={acc.id} className="text-slate-800">
                    {acc.name} ({acc.accountNumber}) - Available: {acc.currency}{acc.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </option>
                ))}
              </select>
            </div>

            {/* Destination Selection */}
            {transferType === 'internal' ? (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  To Destination Account
                </label>
                <select
                  value={toAccId}
                  onChange={(e) => setToAccId(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:border-blue-500 focus:outline-none"
                >
                  {accounts.filter(a => a.id !== fromAccId).map(acc => (
                    <option key={acc.id} value={acc.id} className="text-slate-800">
                      {acc.name} ({acc.accountNumber}) - Current: {acc.currency}{acc.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Recipient Full Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Sarah Jenkins"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Account or IBAN Number
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 9901-4412-1002"
                    value={recipientAccount}
                    onChange={(e) => setRecipientAccount(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>
            )}

            {/* Amount Field & Preset Buttons */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-semibold text-slate-700">
                  Transfer Amount ($ USD)
                </label>
                <span className="text-[11px] text-slate-500">
                  Available: <strong className="text-emerald-600">${availableBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</strong>
                </span>
              </div>
              
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">$</span>
                <input
                  type="number"
                  placeholder="0.00"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full pl-8 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-base font-bold text-slate-900 placeholder:text-slate-300 focus:border-blue-500 focus:outline-none"
                />
              </div>

              {/* Preset Buttons */}
              <div className="flex items-center gap-2 mt-2">
                {[50, 100, 500, 1000, 2500].map(val => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => handlePresetAmount(val)}
                    className="px-2.5 py-1 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-[11px] font-semibold text-slate-600 hover:text-slate-900 transition"
                  >
                    +${val}
                  </button>
                ))}
              </div>
            </div>

            {/* Transfer Note */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Transfer Reference Note (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Monthly rent, Insurance savings allocation"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none"
              />
            </div>

            {/* Submit CTA */}
            <button
              type="submit"
              disabled={statusState.loading}
              className="w-full py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm transition shadow-sm flex items-center justify-center gap-2"
            >
              {statusState.loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <Send className="w-4 h-4" /> Authorize & Execute Transfer
                </>
              )}
            </button>

          </form>

        </div>

        {/* Saved Payees & Security Column */}
        <div className="space-y-5">
          
          {frequentPayees.length > 0 && (
            <div className="p-5 rounded-3xl bg-white border border-slate-200 space-y-4 shadow-sm">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider text-slate-400">
                Saved Frequent Payees
              </h3>

              <div className="space-y-2.5">
                {frequentPayees.map((payee, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleSelectPayee(payee)}
                    className="p-3 rounded-2xl bg-slate-50 border border-slate-200 hover:border-slate-300 hover:shadow-sm cursor-pointer transition flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 font-bold text-xs flex items-center justify-center border border-blue-100">
                        {payee.avatar}
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate-800 group-hover:text-blue-600 transition">{payee.name}</p>
                        <p className="text-[10px] text-slate-500">{payee.bank} • {payee.account}</p>
                      </div>
                    </div>
                    <Send className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 transition" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Transfer Security Assurance */}
          <div className="p-5 rounded-3xl bg-slate-50 border border-slate-100 space-y-3">
            <div className="flex items-center gap-2 text-emerald-600 text-xs font-semibold">
              <ShieldCheck className="w-4 h-4 text-emerald-600" /> Transfer Guarantee
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              All transfers are protected by zero-liability fraud guarantees and verified with end-to-end 256-bit encryption.
            </p>
          </div>

        </div>

      </div>

      {/* Transfer Success Receipt Modal */}
      {statusState.receipt && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden p-6 space-y-5">
            
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                <CheckCircle className="w-7 h-7" />
              </div>
              <h2 className="text-lg font-bold text-slate-900">Transfer Successfully Processed</h2>
              <p className="text-xs text-slate-500">Digital confirmation receipt issued instantly</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500">Transaction Ref:</span>
                <span className="font-mono text-blue-600 font-bold">{statusState.receipt.txId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Date & Time:</span>
                <span className="text-slate-800">{statusState.receipt.timestamp}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">From Account:</span>
                <span className="text-slate-800">{statusState.receipt.fromAccountName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Recipient / To:</span>
                <span className="text-slate-800 font-semibold">{statusState.receipt.toName}</span>
              </div>
              <div className="flex justify-between border-t border-slate-200 pt-2 text-sm">
                <span className="text-slate-600 font-bold">Amount Transferred:</span>
                <span className="text-emerald-600 font-black">${statusState.receipt.amount.toFixed(2)} USD</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setStatusState({ loading: false, error: '', receipt: null })}
                className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition"
              >
                Done
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
