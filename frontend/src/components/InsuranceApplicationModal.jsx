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
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
      <div className="w-full max-w-2xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden flex flex-col my-8">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Apex Shield Insurance Application</h2>
              <p className="text-xs text-slate-555">Step {step} of 5 — Instant Policy Binding</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-600 hover:text-slate-900 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Stepper Bar */}
        <div className="w-full bg-slate-100 h-1.5 flex">
          {[1, 2, 3, 4, 5].map(s => (
            <div
              key={s}
              className={`h-full transition-all duration-300 ${
                s <= step ? 'bg-gradient-to-r from-emerald-500 to-teal-400 flex-1' : 'bg-slate-200 flex-1'
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
                <h3 className="text-sm font-bold text-slate-900 mb-1">Select Insurance Category</h3>
                <p className="text-xs text-slate-500">Choose the asset or health product you wish to protect.</p>
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
                          ? 'bg-emerald-50 border-emerald-500 text-emerald-700 shadow-sm'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-100'
                      }`}
                    >
                      <Icon className="w-6 h-6 mb-2" />
                      <span className="text-xs font-bold">{item.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Dynamic Inputs based on type */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Insured Subject Information ({insuranceType})
                </h4>

                {insuranceType === 'Health' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                     <div>
                       <label className="block text-slate-600 mb-1">Applicant Age</label>
                       <input
                         type="number"
                         value={age}
                         onChange={(e) => setAge(e.target.value)}
                         className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-800 focus:border-blue-500 focus:outline-none"
                       />
                     </div>
                     <div>
                       <label className="block text-slate-600 mb-1">Dependents Covered</label>
                       <input
                         type="number"
                         value={dependents}
                         onChange={(e) => setDependents(e.target.value)}
                         className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-800 focus:border-blue-500 focus:outline-none"
                       />
                     </div>
                     <div className="sm:col-span-2 flex items-center gap-2 pt-1">
                       <input
                         type="checkbox"
                         id="preEx"
                         checked={preExisting}
                         onChange={(e) => setPreExisting(e.target.checked)}
                         className="rounded bg-white border-slate-200 text-emerald-600 focus:ring-0"
                       />
                       <label htmlFor="preEx" className="text-slate-600 text-xs">Pre-existing medical conditions history</label>
                     </div>
                  </div>
                )}

                {insuranceType === 'Auto' && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                     <div>
                       <label className="block text-slate-600 mb-1">Vehicle Make & Model</label>
                       <input
                         type="text"
                         value={vehicleMake}
                         onChange={(e) => setVehicleMake(e.target.value)}
                         className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-800 focus:border-blue-500 focus:outline-none"
                       />
                     </div>
                     <div>
                       <label className="block text-slate-600 mb-1">Model Year</label>
                       <input
                         type="text"
                         value={vehicleYear}
                         onChange={(e) => setVehicleYear(e.target.value)}
                         className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-800 focus:border-blue-500 focus:outline-none"
                       />
                     </div>
                     <div>
                       <label className="block text-slate-600 mb-1">Estimated Car Value ($)</label>
                       <input
                         type="number"
                         value={vehicleValue}
                         onChange={(e) => setVehicleValue(e.target.value)}
                         className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-800 focus:border-blue-500 focus:outline-none"
                       />
                     </div>
                  </div>
                )}

                {insuranceType === 'Home' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                     <div>
                       <label className="block text-slate-600 mb-1">Property Type</label>
                       <select
                         value={propertyType}
                         onChange={(e) => setPropertyType(e.target.value)}
                         className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-800 focus:border-blue-500 focus:outline-none"
                       >
                         <option value="Single Family House">Single Family House</option>
                         <option value="Apartment / Condo">Apartment / Condo</option>
                         <option value="Luxury Villa">Luxury Villa</option>
                       </select>
                     </div>
                     <div>
                       <label className="block text-slate-600 mb-1">Estimated House Valuation ($)</label>
                       <input
                         type="number"
                         value={propertyValue}
                         onChange={(e) => setPropertyValue(e.target.value)}
                         className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-800 focus:border-blue-500 focus:outline-none"
                       />
                     </div>
                  </div>
                )}

                {insuranceType === 'Life' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                     <div>
                       <label className="block text-slate-600 mb-1">Applicant Age</label>
                       <input
                         type="number"
                         value={age}
                         onChange={(e) => setAge(e.target.value)}
                         className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-800 focus:border-blue-500 focus:outline-none"
                       />
                     </div>
                     <div>
                       <label className="block text-slate-600 mb-1">Desired Coverage Term</label>
                       <select className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-800 focus:border-blue-500 focus:outline-none">
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
                 <h3 className="text-sm font-bold text-slate-900 mb-1">Choose Coverage Tier</h3>
                 <p className="text-xs text-slate-500">Select the plan limits tailored to your protection preferences.</p>
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
                           ? 'bg-emerald-50 border-emerald-500 text-slate-900 shadow-sm'
                           : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-350'
                       }`}
                     >
                       <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                         isSel ? 'bg-emerald-600 text-white font-extrabold' : 'bg-slate-200 text-slate-600'
                       }`}>
                         {t.tag}
                       </span>
                       <h4 className="text-sm font-bold text-slate-900 mt-1">{t.tier} Tier Plan</h4>
                       <p className="text-xs text-slate-550">Max Limit: <strong className="text-emerald-600">{t.limit}</strong></p>
                     </div>
                   );
                 })}
               </div>

               <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                 <div>
                   <span className="text-xs font-bold text-slate-800">Live Premium Quote</span>
                   <p className="text-[11px] text-slate-550">Calculated based on selected tier & details</p>
                 </div>
                 <div className="text-right">
                   <span className="text-2xl font-black text-emerald-600">${currentQuote.monthlyPremium}</span>
                   <span className="text-xs text-slate-505">/month</span>
                 </div>
               </div>
             </div>
           )}

           {/* STEP 3: Add-on Riders */}
           {step === 3 && (
             <div className="space-y-5 animate-fade-in">
               <div>
                 <h3 className="text-sm font-bold text-slate-900 mb-1">Select Protection Riders</h3>
                 <p className="text-xs text-slate-555">Add extra peace-of-mind extensions to your policy.</p>
               </div>

               <div className="space-y-3">
                 <label className={`p-4 rounded-2xl border flex items-center justify-between cursor-pointer transition ${
                   riders.zeroDeductible ? 'bg-emerald-50 border-emerald-500 text-slate-900' : 'bg-slate-50 border-slate-200 text-slate-600'
                 }`}>
                   <div className="flex items-center gap-3">
                     <input
                       type="checkbox"
                       checked={riders.zeroDeductible}
                       onChange={(e) => setRiders({ ...riders, zeroDeductible: e.target.checked })}
                       className="rounded bg-white border-slate-200 text-emerald-600 focus:ring-0"
                     />
                     <div>
                       <p className="text-xs font-bold text-slate-800">Zero Deductible Waiver (+$15/mo)</p>
                       <p className="text-[11px] text-slate-555">Pay $0 out of pocket during approved claims.</p>
                     </div>
                   </div>
                 </label>

                 <label className={`p-4 rounded-2xl border flex items-center justify-between cursor-pointer transition ${
                   riders.roadsideOrDental ? 'bg-emerald-50 border-emerald-500 text-slate-900' : 'bg-slate-50 border-slate-200 text-slate-600'
                 }`}>
                   <div className="flex items-center gap-3">
                     <input
                       type="checkbox"
                       checked={riders.roadsideOrDental}
                       onChange={(e) => setRiders({ ...riders, roadsideOrDental: e.target.checked })}
                       className="rounded bg-white border-slate-200 text-emerald-600 focus:ring-0"
                     />
                     <div>
                       <p className="text-xs font-bold text-slate-800">
                         {insuranceType === 'Auto' ? '24/7 Priority Roadside Assist (+$20/mo)' : 'Outpatient & Preventive Care Rider (+$20/mo)'}
                       </p>
                       <p className="text-[11px] text-slate-555">Includes emergency dispatch & nationwide coverage.</p>
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
                 <h3 className="text-sm font-bold text-slate-900 mb-1">Risk Rating & Payment Frequency</h3>
                 <p className="text-xs text-slate-555">Review risk score & choose billing interval for extra discounts.</p>
               </div>

               {/* Risk Score Pill */}
               <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-between">
                 <div className="flex items-center gap-3">
                   <Sparkles className="w-5 h-5 text-emerald-600" />
                   <div>
                     <span className="text-xs font-bold text-emerald-700">Automated Risk Score: Preferred Tier (Low Risk)</span>
                     <p className="text-[11px] text-slate-600">You qualify for instant policy binding approval.</p>
                   </div>
                 </div>
               </div>

               {/* Billing Cycle Switcher */}
               <div className="grid grid-cols-2 gap-4">
                 <div
                   onClick={() => setBillingCycle('monthly')}
                   className={`p-4 rounded-2xl border cursor-pointer transition ${
                     billingCycle === 'monthly' ? 'bg-blue-50 border-blue-500 text-slate-800 shadow-sm' : 'bg-slate-50 border-slate-200 text-slate-600'
                   }`}
                 >
                   <span className="text-xs font-bold block text-slate-800">Monthly Auto-Debit</span>
                   <span className="text-lg font-black text-emerald-600">${currentQuote.monthlyPremium}/mo</span>
                 </div>

                 <div
                   onClick={() => setBillingCycle('annual')}
                   className={`p-4 rounded-2xl border cursor-pointer transition relative ${
                     billingCycle === 'annual' ? 'bg-emerald-50 border-emerald-500 text-slate-800 shadow-sm' : 'bg-slate-50 border-slate-200 text-slate-600'
                   }`}
                 >
                   <span className="absolute -top-2.5 right-3 text-[10px] font-extrabold px-2 py-0.5 bg-emerald-500 text-white rounded-full">
                     SAVE 15%
                   </span>
                   <span className="text-xs font-bold block text-slate-800">Annual Pre-Pay</span>
                   <span className="text-lg font-black text-emerald-600">${Math.round(currentQuote.monthlyPremium * 12 * 0.85)}/yr</span>
                 </div>
               </div>
             </div>
           )}

           {/* STEP 5: Direct Debit Binding & Confirmation */}
           {step === 5 && (
             <div className="space-y-5 animate-fade-in">
               <div>
                 <h3 className="text-sm font-bold text-slate-900 mb-1">Direct-Debit Account Binding</h3>
                 <p className="text-xs text-slate-550">Link your Apex account for automatic premium debits & instant policy activation.</p>
               </div>

               <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                 <label className="block text-xs font-semibold text-slate-700">Select Bank Account for Auto-Debit</label>
                 <select
                   value={selectedAccId}
                   onChange={(e) => setSelectedAccId(e.target.value)}
                   className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-850 focus:outline-none"
                 >
                   {accounts.map(a => (
                     <option key={a.id} value={a.id} className="text-slate-850">
                       {a.name} ({a.accountNumber}) - Available: ${a.balance.toLocaleString()}
                     </option>
                   ))}
                 </select>
               </div>

               {/* Policy Summary Box */}
               <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                 <div className="flex justify-between">
                   <span className="text-slate-500">Selected Product:</span>
                   <span className="font-bold text-slate-850">{selectedTier} {insuranceType} Shield</span>
                 </div>
                 <div className="flex justify-between">
                   <span className="text-slate-500">Coverage Limit:</span>
                   <span className="font-bold text-emerald-600">${currentQuote.coverageAmount.toLocaleString()}</span>
                 </div>
                 <div className="flex justify-between">
                   <span className="text-slate-500">Monthly Premium:</span>
                   <span className="font-bold text-slate-850">${currentQuote.monthlyPremium}/mo</span>
                 </div>
                 <div className="flex justify-between">
                   <span className="text-slate-500">Deductible:</span>
                   <span className="text-slate-700">${currentQuote.deductible}</span>
                 </div>
               </div>
             </div>
           )}

         </div>

         {/* Footer Navigation Controls */}
         <div className="p-6 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
           {step > 1 ? (
             <button
               onClick={handleBack}
               className="px-4 py-2.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold text-xs transition flex items-center gap-1.5"
             >
               <ArrowLeft className="w-4 h-4" /> Previous Step
             </button>
           ) : (
             <div></div>
           )}

           {step < 5 ? (
             <button
               onClick={handleNext}
               className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow transition flex items-center gap-1.5"
             >
               Continue <ArrowRight className="w-4 h-4" />
             </button>
           ) : (
             <button
               onClick={handleFinalSubmit}
               className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow transition flex items-center gap-2"
             >
               <Lock className="w-4 h-4" /> Bind Policy & Activate Coverage Now
             </button>
           )}
         </div>

      </div>
    </div>
  );
}
