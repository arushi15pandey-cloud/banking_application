'use client';

import React, { useState } from 'react';
import { useBanking } from '../context/BankingContext';
import { 
  FileText, 
  Upload, 
  CheckCircle, 
  Clock, 
  ShieldAlert, 
  Plus, 
  X, 
  AlertCircle, 
  ChevronRight, 
  DollarSign,
  FileCheck,
  Building
} from 'lucide-react';

export default function ClaimsManager({ isOpenClaimModal, onCloseClaimModal }) {
  const { claims, policies, submitClaim } = useBanking();

  const [showSubmitModal, setShowSubmitModal] = useState(isOpenClaimModal || false);
  const [selectedPolicyId, setSelectedPolicyId] = useState(policies[0]?.id || '');
  const [claimType, setClaimType] = useState('');
  const [incidentDate, setIncidentDate] = useState(new Date().toISOString().split('T')[0]);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [fileAttached, setFileAttached] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleClaimSubmit = (e) => {
    e.preventDefault();
    if (!selectedPolicyId || !claimType || !amount || !description) {
      setErrorMsg('Please complete all required fields and upload proof documents.');
      return;
    }

    submitClaim({
      policyId: selectedPolicyId,
      claimType,
      incidentDate,
      amount: parseFloat(amount),
      description
    });

    // Reset
    setClaimType('');
    setAmount('');
    setDescription('');
    setFileAttached(false);
    setErrorMsg('');
    setShowSubmitModal(false);
    if (onCloseClaimModal) onCloseClaimModal();
  };

  const stepsList = [
    { num: 1, label: 'Submitted & Logged' },
    { num: 2, label: 'Under Adjuster Assessment' },
    { num: 3, label: 'Inspector Approved' },
    { num: 4, label: 'Payout Disbursed to Bank' }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1">
              <FileText className="w-3.5 h-3.5" /> Express Reimbursement Engine
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Claims Filing & Live Tracker</h1>
          <p className="text-xs text-slate-500 mt-1">
            File claims online, upload incident receipts, and track claim payouts directly into your Premier Checking account.
          </p>
        </div>

        <button
          onClick={() => setShowSubmitModal(true)}
          className="px-4 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs shadow transition flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> File New Claim
        </button>
      </div>

      {/* Claims List & Steppers */}
      <div className="space-y-5">
        <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-slate-400">
          Tracked Claims ({claims.length})
        </h2>

        {claims.map(claim => (
          <div
            key={claim.id}
            className="p-6 rounded-3xl bg-white border border-slate-200 space-y-5 shadow-sm"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-amber-600">{claim.id}</span>
                  <span className="text-slate-500 text-xs">•</span>
                  <span className="text-xs font-semibold text-slate-700">{claim.policyTitle}</span>
                </div>
                <h3 className="text-base font-bold text-slate-900 mt-1">{claim.claimType}</h3>
                <p className="text-xs text-slate-500 mt-0.5">{claim.description}</p>
              </div>

              <div className="text-left sm:text-right">
                <p className="text-xs text-slate-500">Claim Amount Requested</p>
                <p className="text-xl font-black text-slate-900">${claim.amount.toFixed(2)}</p>
                <span className="text-[10px] text-emerald-600 font-medium font-bold">Payout to {claim.payoutAccount}</span>
              </div>
            </div>

            {/* Step Timeline */}
            <div className="py-2">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 relative">
                {stepsList.map(s => {
                  const isDone = claim.step >= s.num;
                  const isCurrent = claim.step === s.num;

                  return (
                    <div key={s.num} className="flex flex-col items-center text-center space-y-2">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition ${
                        isDone
                          ? 'bg-emerald-500 text-white shadow shadow-emerald-500/10'
                          : 'bg-slate-100 text-slate-400 border border-slate-200'
                      }`}>
                        {isDone ? <CheckCircle className="w-4 h-4 text-white" /> : s.num}
                      </div>
                      <span className={`text-[11px] font-semibold leading-tight ${
                        isCurrent ? 'text-amber-600 font-bold' : isDone ? 'text-slate-800' : 'text-slate-400'
                      }`}>
                        {s.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Claim Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
          <div className="w-full max-w-xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden p-6 space-y-5 my-8">
            
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-100 text-amber-600 flex items-center justify-center font-bold">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">File an Insurance Claim</h2>
                  <p className="text-xs text-slate-500">Reimbursement engine for active policyholders</p>
                </div>
              </div>
              <button
                onClick={() => setShowSubmitModal(false)}
                className="p-2 rounded-xl bg-slate-200 text-slate-500 hover:bg-slate-300 hover:text-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleClaimSubmit} className="space-y-4 text-xs">
              
              {errorMsg && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Select Covered Policy</label>
                <select
                  value={selectedPolicyId}
                  onChange={(e) => setSelectedPolicyId(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 focus:border-blue-500 focus:outline-none"
                >
                  {policies.map(p => (
                    <option key={p.id} value={p.id} className="text-slate-800">
                      {p.id} - {p.title} (${p.coverage.toLocaleString()} Max)
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Claim Title / Incident Type</label>
                  <input
                    type="text"
                    placeholder="e.g. Emergency Room Visit"
                    value={claimType}
                    onChange={(e) => setClaimType(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Incident Date</label>
                  <input
                    type="date"
                    value={incidentDate}
                    onChange={(e) => setIncidentDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Claim Amount Requested ($)</label>
                <input
                  type="number"
                  placeholder="0.00"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-350 focus:border-blue-500 focus:outline-none font-bold"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Incident Summary & Details</label>
                <textarea
                  rows="3"
                  placeholder="Describe what occurred..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none"
                ></textarea>
              </div>

              {/* Upload Drop Zone Simulation */}
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Attach Medical Receipts / Police Reports</label>
                <div
                  onClick={() => setFileAttached(true)}
                  className={`p-4 border-2 border-dashed rounded-2xl text-center cursor-pointer transition ${
                    fileAttached ? 'border-emerald-500/60 bg-emerald-50 text-emerald-700' : 'border-slate-200 bg-slate-50 text-slate-500 hover:border-slate-350 hover:bg-slate-100'
                  }`}
                >
                  {fileAttached ? (
                    <div className="flex items-center justify-center gap-2">
                      <FileCheck className="w-5 h-5 text-emerald-600" />
                      <span className="font-semibold text-xs">Medical_Receipt_Jul2026.pdf (Attached)</span>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <Upload className="w-6 h-6 mx-auto text-slate-450" />
                      <p className="font-semibold text-xs text-slate-700">Click to upload receipt or proof image</p>
                      <p className="text-[10px] text-slate-450">Supports PDF, JPG, PNG up to 15MB</p>
                    </div>
                  )}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs transition shadow-sm"
              >
                Submit Claim to Adjuster
              </button>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
