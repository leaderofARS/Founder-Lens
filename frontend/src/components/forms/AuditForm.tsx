"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronRight, ChevronLeft, Send, 
  Target, Calculator, Activity, AlertCircle, Fingerprint
} from 'lucide-react';
import { useAuditStore } from '@/store/useAuditStore';

const STEPS = [
  { id: 1, name: 'Identity', icon: <Target size={18} /> },
  { id: 2, name: 'Logic', icon: <Activity size={18} /> },
  { id: 3, name: 'Economics', icon: <Calculator size={18} /> },
];

export default function AuditForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  // Connect to Zustand
  const { auditData, updateAuditData } = useAuditStore();

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, STEPS.length));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const handleAssumptionChange = (index: number, value: string) => {
    const newAssumptions = [...auditData.assumptions];
    newAssumptions[index] = value;
    updateAuditData({ assumptions: newAssumptions });
  };

  const handleFinalSubmit = () => {
    setIsAnalyzing(true);
    // Simulate Forensic Analysis processing
    setTimeout(() => {
      window.location.href = "/dashboard";
    }, 3500);
  };

  return (
    <div className="max-w-4xl mx-auto p-12 bg-slate-900/40 border border-slate-800 rounded-[2.5rem] backdrop-blur-3xl shadow-2xl relative overflow-hidden">
      
      {/* Visual Accent */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-600 to-transparent opacity-50" />

      {/* STEPPER HEADER */}
      <div className="flex justify-between mb-16 max-w-md mx-auto">
        {STEPS.map((step) => (
          <div key={step.id} className="flex flex-col items-center gap-3 flex-1 relative">
            <div className={`z-10 w-12 h-12 rounded-2xl flex items-center justify-center border-2 transition-all duration-500 ${
              currentStep >= step.id ? 'bg-blue-600 border-blue-400 text-white shadow-2xl shadow-blue-600/40' : 'bg-slate-950 border-slate-800 text-slate-600'
            }`}>
              {step.icon}
            </div>
            <span className={`text-[10px] uppercase font-black tracking-[0.2em] ${currentStep >= step.id ? 'text-blue-400' : 'text-slate-600'}`}>
              {step.name}
            </span>
            {step.id !== 3 && (
              <div className={`absolute top-6 left-[65%] w-[70%] h-[1px] ${currentStep > step.id ? 'bg-blue-600' : 'bg-slate-800'}`} />
            )}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {!isAnalyzing ? (
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="min-h-[350px] flex flex-col justify-between"
          >
            <div className="space-y-8">
              {/* STEP 1: IDENTITY */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-3xl font-black uppercase tracking-tighter mb-2 italic text-white">Project Identity</h2>
                    <p className="text-slate-500 text-sm font-medium">Standardize the core thesis of your innovation.</p>
                  </div>
                  <div className="grid gap-6">
                    <InputField 
                      label="Nomenclature" 
                      placeholder="e.g., Sipheron AI" 
                      value={auditData.projectName}
                      onChange={(val) => updateAuditData({ projectName: val })}
                    />
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">The Problem/Solution Loop</label>
                      <textarea 
                        value={auditData.elevatorPitch}
                        onChange={(e) => updateAuditData({ elevatorPitch: e.target.value })}
                        rows={4}
                        className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-5 focus:border-blue-500 outline-none transition-all text-slate-200 placeholder:text-slate-700 font-medium" 
                        placeholder="Describe the structural logic of your solution..."
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: LOGIC */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-3xl font-black uppercase tracking-tighter mb-2 italic text-white">Dependency Mapping</h2>
                    <p className="text-slate-500 text-sm font-medium">Identify the critical assumptions that support your model.</p>
                  </div>
                  <div className="space-y-4">
                    {auditData.assumptions.map((val, i) => (
                      <div key={i} className="relative">
                        <div className="absolute left-5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-blue-600 shadow-[0_0_10px_#2563eb]" />
                        <input 
                          value={val}
                          onChange={(e) => handleAssumptionChange(i, e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 pl-12 focus:border-blue-500 outline-none transition-all text-sm font-medium" 
                          placeholder={`Critical Assumption #${i + 1}`}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 3: ECONOMICS */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-3xl font-black uppercase tracking-tighter mb-2 italic text-white">Economic Parameters</h2>
                    <p className="text-slate-500 text-sm font-medium">Quantitative inputs for the deterministic simulation engine.</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <InputField 
                      label="Projected Monthly Burn ($)" 
                      type="number" 
                      placeholder="5000" 
                      value={auditData.monthlyBurn || ''}
                      onChange={(val) => updateAuditData({ monthlyBurn: Number(val) })}
                    />
                    <InputField 
                      label="Target Customer Acquisition ($)" 
                      type="number" 
                      placeholder="150" 
                      value={auditData.targetCAC || ''}
                      onChange={(val) => updateAuditData({ targetCAC: Number(val) })}
                    />
                  </div>
                  <div className="p-4 rounded-xl bg-blue-600/5 border border-blue-500/20 flex gap-4 items-center">
                    <AlertCircle className="text-blue-400 shrink-0" size={20} />
                    <p className="text-[11px] text-blue-300 font-medium">These values are used to calculate your <strong>Risk Fragility Score</strong> against industry benchmarks.</p>
                  </div>
                </div>
              )}
            </div>

            {/* NAV ACTIONS */}
            <div className="flex justify-between items-center pt-12 border-t border-white/5 mt-12">
              <button 
                onClick={prevStep}
                disabled={currentStep === 1}
                className="flex items-center gap-2 px-6 py-3 text-slate-500 hover:text-white transition-all disabled:opacity-0 font-black uppercase text-[10px] tracking-widest"
              >
                <ChevronLeft size={16} /> Back
              </button>
              
              <div className="flex gap-4">
                {currentStep < 3 ? (
                  <button 
                    onClick={nextStep}
                    className="flex items-center gap-2 px-10 py-4 bg-white text-black font-black uppercase text-[11px] tracking-[0.2em] rounded-2xl hover:bg-blue-600 hover:text-white transition-all shadow-xl"
                  >
                    Next Phase <ChevronRight size={16} />
                  </button>
                ) : (
                  <button 
                    onClick={handleFinalSubmit}
                    className="flex items-center gap-3 px-10 py-4 bg-blue-600 text-white font-black uppercase text-[11px] tracking-[0.2em] rounded-2xl hover:bg-blue-500 transition-all shadow-2xl shadow-blue-600/40"
                  >
                    Initiate Audit <Send size={16} />
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        ) : (
          /* ANALYSIS LOADING STATE */
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="py-24 text-center space-y-10">
            <div className="relative w-32 h-32 mx-auto flex items-center justify-center">
               <div className="absolute inset-0 border-2 border-blue-600/10 rounded-full" />
               <motion.div 
                animate={{ rotate: 360 }} 
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 border-2 border-t-blue-600 rounded-full" 
               />
               <Fingerprint size={40} className="text-blue-500 animate-pulse" />
            </div>
            <div className="space-y-3">
              <h3 className="text-2xl font-black uppercase tracking-tighter italic">Scanning Logic Integrity...</h3>
              <p className="text-slate-500 text-[10px] font-mono uppercase tracking-[0.3em] animate-pulse">Running deterministic Monte Carlo trials</p>
            </div>
            <div className="max-w-xs mx-auto">
              <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }} animate={{ width: "100%" }} 
                  transition={{ duration: 3.5, ease: "easeInOut" }}
                  className="h-full bg-blue-600 shadow-[0_0_15px_#2563eb]"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function InputField({ label, placeholder, type = "text", value, onChange }: any) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">{label}</label>
      <input 
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 focus:border-blue-500 outline-none transition-all text-slate-200 placeholder:text-slate-700 font-medium" 
        placeholder={placeholder}
      />
    </div>
  );
}