'use client';

import React, { useState } from 'react';
import { useBanking } from '../context/BankingContext';
import { 
  ShieldCheck, 
  HeartPulse, 
  Car, 
  Home, 
  X, 
  CheckCircle, 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  AlertCircle, 
  Sparkles, 
  CreditCard, 
  FileText,
  Lock
} from 'lucide-react';

export default function InsuranceApplicationModal({ isOpen, onClose, onPolicyApplied }) {
  const { applyForInsurance, accounts } = useBanking();

  const [step, setStep] = useState(1);

  // Form State
  const [insuranceType, setInsuranceType] = useState('Health'); // Health | Auto | Home | Life
  
  // Specific Details
  const [age, setAge] = useState('32');
  const [dependents, setDependents] = useState('1');
  const [preExisting, setPreExisting] = useState(false);

  const [vehicleMake, setVehicleMake] = useState('Tesla Model Y');
  const [vehicleYear, setVehicleYear] = useState('2024');
  const [vehicleValue, setVehicleValue] = useState('55000');

  const [propertyType, setPropertyType] = useState('House');
  const [propertyValue, setPropertyValue] = useState('650000');

  // Plan Tiers: Basic | Gold | Platinum
  const [selectedTier, setSelectedTier] = useState('Gold');

  // Riders
  const [riders, setRiders] = useState({
    zeroDeductible: true,
    roadsideOrDental: true,
    criticalIllnessOrFlood: false
  });

  // Billing interval: 'monthly' | 'annual'
  const [billingCycle, setBillingCycle] = useState('monthly');

  // Selected Bank Account for direct debit
  const [selectedAccId, setSelectedAccId] = useState(accounts[0]?.id || 'chk-1');

  if (!isOpen) return null;

  // Real-time calculation formula
  const calculateQuote = () => {
    let base = 100;
    let coverage = 250000;

    if (insuranceType === 'Health') {
      base = 120 + (parseInt(age) > 40 ? 40 : 10) + (parseInt(dependents) * 20);
      if (preExisting) base += 30;
      coverage = 250000;
    } else if (insuranceType === 'Auto') {
      const carVal = parseFloat(vehicleValue) || 40000;
      base = Math.max(65, (carVal * 0.0015));
      coverage = carVal;
    } else if (insuranceType === 'Home') {
      const houseVal = parseFloat(propertyValue) || 500000;
      base = Math.max(120, (houseVal * 0.0003));
      coverage = houseVal;
    } else if (insuranceType === 'Life') {
      base = 45 + (parseInt(age) > 35 ? 25 : 10);
      coverage = 1000000;
    }

    // Tier multiplier
    if (selectedTier === 'Basic') {
      base = base * 0.75;
      coverage = coverage * 0.6;
    } else if (selectedTier === 'Platinum') {
      base = base * 1.4;
      coverage = coverage * 1.8;
    }

    // Add-on Riders
    let riderAdd = 0;
    if (riders.zeroDeductible) riderAdd += 15;
    if (riders.roadsideOrDental) riderAdd += 20;
    if (riders.criticalIllnessOrFlood) riderAdd += 25;

    let finalMonthly = base + riderAdd;
    if (billingCycle === 'annual') {
      finalMonthly = finalMonthly * 0.85; // 15% discount
    }

    return {
      monthlyPremium: Math.round(finalMonthly),
      coverageAmount: Math.round(coverage),
      deductible: selectedTier === 'Platinum' ? 0 : (selectedTier === 'Gold' ? 500 : 1000)
    };
  };

  const currentQuote = calculateQuote();

  const handleNext = () => setStep(prev => Math.min(prev + 1, 5));
  const handleBack = () => setStep(prev => Math.max(prev - 1, 1));

  const handleFinalSubmit = () => {
    let title = '';
    let insuredSubject = '';

    if (insuranceType === 'Health') {
      title = `${selectedTier} Comprehensive Health Shield`;
      insuredSubject = `Alex Morgan + ${dependents} Dependent(s)`;
    } else if (insuranceType === 'Auto') {
      title = `${selectedTier} Auto Protection`;
      insuredSubject = `${vehicleYear} ${vehicleMake}`;
    } else if (insuranceType === 'Home') {
      title = `${selectedTier} Estate & Property Guard`;
      insuredSubject = `${propertyType} (Est. $${parseInt(propertyValue).toLocaleString()})`;
    } else {
      title = `${selectedTier} Term Life Assurance`;
      insuredSubject = `Beneficiary Coverage ($${currentQuote.coverageAmount.toLocaleString()})`;
    }

    const createdPolicy = applyForInsurance({
      type: insuranceType,
      title: title,
      coverage: currentQuote.coverageAmount,
      monthlyPremium: currentQuote.monthlyPremium,
      deductible: currentQuote.deductible,
      insuredSubject: insuredSubject,
      bankAccountId: selectedAccId
    });

    onPolicyApplied(createdPolicy);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
      <div className="w-full max-w-2xl bg-[#131b2e] border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col my-8">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-800 bg-slate-900/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Apex Shield Insurance Application</h2>
              <p className="text-xs text-slate-400">Step {step} of 5 — Instant Policy Binding</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Stepper Bar */}
        <div className="w-full bg-slate-900 h-1.5 flex">
          {[1, 2, 3, 4, 5].map(s => (
            <div
              key={s}
              className={`h-full transition-all duration-300 ${
                s <= step ? 'bg-gradient-to-r from-emerald-500 to-teal-400 flex-1' : 'bg-slate-800 flex-1'
              }`}
            ></div>
          ))}
        </div>

        {/* Body Content */}
        <div className="p-6 space-y-6 flex-1 max-h-[70vh] overflow-y-auto">
          
          {/* STEP 1: Product & Subject Details */}
          {step === 1 && (
            <div className="space-y-5 animate-fade-in">
              <div>
                <h3 className="text-sm font-bold text-white mb-1">Select Insurance Category</h3>
                <p className="text-xs text-slate-400">Choose the asset or health product you wish to protect.</p>
              </div>

              {/* Product Selector Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { id: 'Health', label: 'Health Shield', icon: HeartPulse, color: 'emerald' },
                  { id: 'Auto', label: 'Auto Guard', icon: Car, color: 'blue' },
                  { id: 'Home', label: 'Home Protect', icon: Home, color: 'purple' },
                  { id: 'Life', label: 'Life Assurance', icon: ShieldCheck, color: 'amber' }
                ].map(item => {
                  const Icon = item.icon;
                  const isSelected = insuranceType === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setInsuranceType(item.id)}
                      className={`p-3.5 rounded-2xl border text-left transition flex flex-col justify-between ${
                        isSelected
                          ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <Icon className="w-6 h-6 mb-2" />
                      <span className="text-xs font-bold">{item.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Dynamic Inputs based on type */}
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Insured Subject Information ({insuranceType})
                </h4>

                {insuranceType === 'Health' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="block text-slate-400 mb-1">Applicant Age</label>
                      <input
                        type="number"
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1">Dependents Covered</label>
                      <input
                        type="number"
                        value={dependents}
                        onChange={(e) => setDependents(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none"
                      />
                    </div>
                    <div className="sm:col-span-2 flex items-center gap-2 pt-1">
                      <input
                        type="checkbox"
                        id="preEx"
                        checked={preExisting}
                        onChange={(e) => setPreExisting(e.target.checked)}
                        className="rounded bg-slate-800 border-slate-700 text-emerald-500 focus:ring-0"
                      />
                      <label htmlFor="preEx" className="text-slate-300 text-xs">Pre-existing medical conditions history</label>
                    </div>
                  </div>
                )}

                {insuranceType === 'Auto' && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                    <div>
                      <label className="block text-slate-400 mb-1">Vehicle Make & Model</label>
                      <input
                        type="text"
                        value={vehicleMake}
                        onChange={(e) => setVehicleMake(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1">Model Year</label>
                      <input
                        type="text"
                        value={vehicleYear}
                        onChange={(e) => setVehicleYear(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1">Estimated Car Value ($)</label>
                      <input
                        type="number"
                        value={vehicleValue}
                        onChange={(e) => setVehicleValue(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none"
                      />
                    </div>
                  </div>
                )}

                {insuranceType === 'Home' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="block text-slate-400 mb-1">Property Type</label>
                      <select
                        value={propertyType}
                        onChange={(e) => setPropertyType(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none"
                      >
                        <option value="Single Family House">Single Family House</option>
                        <option value="Apartment / Condo">Apartment / Condo</option>
                        <option value="Luxury Villa">Luxury Villa</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1">Estimated House Valuation ($)</label>
                      <input
                        type="number"
                        value={propertyValue}
                        onChange={(e) => setPropertyValue(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none"
                      />
                    </div>
                  </div>
                )}

                {insuranceType === 'Life' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="block text-slate-400 mb-1">Applicant Age</label>
                      <input
                        type="number"
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1">Desired Coverage Term</label>
                      <select className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none">
                        <option value="10">10 Years Term</option>
                        <option value="20">20 Years Term</option>
                        <option value="30">30 Years Term</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 2: Tier Selection */}
          {step === 2 && (
            <div className="space-y-5 animate-fade-in">
              <div>
                <h3 className="text-sm font-bold text-white mb-1">Choose Coverage Tier</h3>
                <p className="text-xs text-slate-400">Select the plan limits tailored to your protection preferences.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { tier: 'Basic', tag: 'Essential', limit: `$${Math.round(currentQuote.coverageAmount * 0.6).toLocaleString()}` },
                  { tier: 'Gold', tag: 'Most Popular ⭐', limit: `$${currentQuote.coverageAmount.toLocaleString()}` },
                  { tier: 'Platinum', tag: 'Zero Deductible', limit: `$${Math.round(currentQuote.coverageAmount * 1.8).toLocaleString()}` }
                ].map(t => {
                  const isSel = selectedTier === t.tier;
                  return (
                    <div
                      key={t.tier}
                      onClick={() => setSelectedTier(t.tier)}
                      className={`p-4 rounded-2xl border cursor-pointer transition space-y-3 relative ${
                        isSel
                          ? 'bg-emerald-500/10 border-emerald-500 text-white shadow-lg'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        isSel ? 'bg-emerald-500 text-black font-extrabold' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {t.tag}
                      </span>
                      <h4 className="text-sm font-bold text-white mt-1">{t.tier} Tier Plan</h4>
                      <p className="text-xs text-slate-400">Max Limit: <strong className="text-emerald-400">{t.limit}</strong></p>
                    </div>
                  );
                })}
              </div>

              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-white">Live Premium Quote</span>
                  <p className="text-[11px] text-slate-400">Calculated based on selected tier & details</p>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black text-emerald-400">${currentQuote.monthlyPremium}</span>
                  <span className="text-xs text-slate-400">/month</span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Add-on Riders */}
          {step === 3 && (
            <div className="space-y-5 animate-fade-in">
              <div>
                <h3 className="text-sm font-bold text-white mb-1">Select Protection Riders</h3>
                <p className="text-xs text-slate-400">Add extra peace-of-mind extensions to your policy.</p>
              </div>

              <div className="space-y-3">
                <label className={`p-4 rounded-2xl border flex items-center justify-between cursor-pointer transition ${
                  riders.zeroDeductible ? 'bg-emerald-500/10 border-emerald-500 text-white' : 'bg-slate-900 border-slate-800 text-slate-400'
                }`}>
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={riders.zeroDeductible}
                      onChange={(e) => setRiders({ ...riders, zeroDeductible: e.target.checked })}
                      className="rounded bg-slate-800 border-slate-700 text-emerald-500 focus:ring-0"
                    />
                    <div>
                      <p className="text-xs font-bold text-white">Zero Deductible Waiver (+$15/mo)</p>
                      <p className="text-[11px] text-slate-400">Pay $0 out of pocket during approved claims.</p>
                    </div>
                  </div>
                </label>

                <label className={`p-4 rounded-2xl border flex items-center justify-between cursor-pointer transition ${
                  riders.roadsideOrDental ? 'bg-emerald-500/10 border-emerald-500 text-white' : 'bg-slate-900 border-slate-800 text-slate-400'
                }`}>
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={riders.roadsideOrDental}
                      onChange={(e) => setRiders({ ...riders, roadsideOrDental: e.target.checked })}
                      className="rounded bg-slate-800 border-slate-700 text-emerald-500 focus:ring-0"
                    />
                    <div>
                      <p className="text-xs font-bold text-white">
                        {insuranceType === 'Auto' ? '24/7 Priority Roadside Assist (+$20/mo)' : 'Outpatient & Preventive Care Rider (+$20/mo)'}
                      </p>
                      <p className="text-[11px] text-slate-400">Includes emergency dispatch & nationwide coverage.</p>
                    </div>
                  </div>
                </label>
              </div>
            </div>
          )}

          {/* STEP 4: Risk Summary & Billing Cycle */}
          {step === 4 && (
            <div className="space-y-5 animate-fade-in">
              <div>
                <h3 className="text-sm font-bold text-white mb-1">Risk Rating & Payment Frequency</h3>
                <p className="text-xs text-slate-400">Review risk score & choose billing interval for extra discounts.</p>
              </div>

              {/* Risk Score Pill */}
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Sparkles className="w-5 h-5 text-emerald-400" />
                  <div>
                    <span className="text-xs font-bold text-emerald-400">Automated Risk Score: Preferred Tier (Low Risk)</span>
                    <p className="text-[11px] text-slate-300">You qualify for instant policy binding approval.</p>
                  </div>
                </div>
              </div>

              {/* Billing Cycle Switcher */}
              <div className="grid grid-cols-2 gap-4">
                <div
                  onClick={() => setBillingCycle('monthly')}
                  className={`p-4 rounded-2xl border cursor-pointer transition ${
                    billingCycle === 'monthly' ? 'bg-blue-600/20 border-blue-500 text-white' : 'bg-slate-900 border-slate-800 text-slate-400'
                  }`}
                >
                  <span className="text-xs font-bold block text-white">Monthly Auto-Debit</span>
                  <span className="text-lg font-black text-emerald-400">${currentQuote.monthlyPremium}/mo</span>
                </div>

                <div
                  onClick={() => setBillingCycle('annual')}
                  className={`p-4 rounded-2xl border cursor-pointer transition relative ${
                    billingCycle === 'annual' ? 'bg-emerald-500/20 border-emerald-500 text-white' : 'bg-slate-900 border-slate-800 text-slate-400'
                  }`}
                >
                  <span className="absolute -top-2.5 right-3 text-[10px] font-extrabold px-2 py-0.5 bg-emerald-500 text-black rounded-full">
                    SAVE 15%
                  </span>
                  <span className="text-xs font-bold block text-white">Annual Pre-Pay</span>
                  <span className="text-lg font-black text-emerald-400">${Math.round(currentQuote.monthlyPremium * 12 * 0.85)}/yr</span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: Direct Debit Binding & Confirmation */}
          {step === 5 && (
            <div className="space-y-5 animate-fade-in">
              <div>
                <h3 className="text-sm font-bold text-white mb-1">Direct-Debit Account Binding</h3>
                <p className="text-xs text-slate-400">Link your Apex account for automatic premium debits & instant policy activation.</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                <label className="block text-xs font-semibold text-slate-300">Select Bank Account for Auto-Debit</label>
                <select
                  value={selectedAccId}
                  onChange={(e) => setSelectedAccId(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none"
                >
                  {accounts.map(a => (
                    <option key={a.id} value={a.id}>
                      {a.name} ({a.accountNumber}) - Available: ${a.balance.toLocaleString()}
                    </option>
                  ))}
                </select>
              </div>

              {/* Policy Summary Box */}
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Selected Product:</span>
                  <span className="font-bold text-white">{selectedTier} {insuranceType} Shield</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Coverage Limit:</span>
                  <span className="font-bold text-emerald-400">${currentQuote.coverageAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Monthly Premium:</span>
                  <span className="font-bold text-white">${currentQuote.monthlyPremium}/mo</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Deductible:</span>
                  <span className="text-slate-300">${currentQuote.deductible}</span>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer Navigation Controls */}
        <div className="p-6 border-t border-slate-800 bg-slate-900/60 flex items-center justify-between">
          {step > 1 ? (
            <button
              onClick={handleBack}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" /> Previous Step
            </button>
          ) : (
            <div></div>
          )}

          {step < 5 ? (
            <button
              onClick={handleNext}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-xs shadow-md transition flex items-center gap-1.5"
            >
              Continue <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleFinalSubmit}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-blue-600 hover:from-emerald-400 hover:to-blue-500 text-white font-black text-xs shadow-xl transition flex items-center gap-2"
            >
              <Lock className="w-4 h-4" /> Bind Policy & Activate Coverage Now
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
