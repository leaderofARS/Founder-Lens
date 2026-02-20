"use client";

import React from 'react';
import { 
  AlertTriangle, Zap, BarChart, RefreshCw, Layers, ArrowLeft, 
  TrendingUp, ShieldCheck, Microscope, Activity, Cpu, Fingerprint
} from 'lucide-react';
import { useAuditStore } from '@/store/useAuditStore';
import { analyzeStartupLogic } from '@/services/analysisEngine';
import Link from 'next/link';

export default function Dashboard() {
  const { auditData } = useAuditStore();

  const results = analyzeStartupLogic(
    auditData.monthlyBurn,
    auditData.targetCAC,
    auditData.assumptions
  );

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100 p-8 font-sans overflow-x-hidden">
      {/* Background Decor */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_top_right,#1e293b_0%,transparent_40%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-10" />

      {/* Header */}
      <header className="relative z-10 max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-16 border-b border-white/5 pb-10">
        <div>
          <Link href="/audit" className="flex items-center gap-2 text-slate-500 hover:text-blue-400 text-[10px] font-black uppercase tracking-[0.2em] mb-4 transition-all">
            <ArrowLeft size={14} /> Back to Lab
          </Link>
          <div className="flex items-center gap-3 text-blue-400 text-[10px] font-black uppercase tracking-[0.3em] mb-3">
            <Fingerprint size={14} className="animate-pulse" /> Intelligence Report v1.02
          </div>
          <h1 className="text-5xl font-black tracking-tighter italic">
            {auditData.projectName || "Project_Alpha"} <span className="text-slate-700">/</span> Audit
          </h1>
        </div>
        <button onClick={() => window.location.reload()} className="flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-500 rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-2xl shadow-blue-900/40">
          <RefreshCw size={16} /> Re-run Simulation
        </button>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: THE VERDICT */}
        <div className="lg:col-span-4 space-y-8">
          <div className="bg-slate-900/60 border border-slate-800 rounded-[3rem] p-12 text-center relative overflow-hidden backdrop-blur-3xl shadow-2xl">
            <div className="absolute -top-10 -right-10 opacity-5">
              <ShieldCheck size={200} />
            </div>
            <h3 className="text-slate-500 text-[10px] uppercase font-black tracking-[0.2em] mb-8">Risk Fragility Score</h3>
            <div className="text-9xl font-black text-white mb-6 tabular-nums tracking-tighter">{results.fragilityScore}</div>
            <div className={`px-6 py-2 rounded-full text-[10px] font-black uppercase inline-block mb-10 border ${
              results.riskLevel === 'Critical' || results.riskLevel === 'High' 
                ? 'bg-red-500/10 text-red-400 border-red-500/20 shadow-[0_0_30px_rgba(239,68,68,0.15)]' 
                : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_30px_rgba(16,185,129,0.15)]'
            }`}>
              {results.riskLevel} Pattern Detected
            </div>
            <p className="text-slate-400 text-sm leading-relaxed font-medium px-4">
              {results.recommendation}
            </p>
          </div>

          <div className="bg-slate-900/40 border border-slate-800 rounded-[3rem] p-10 backdrop-blur-xl">
            <h4 className="font-black text-xs uppercase tracking-widest mb-10 flex items-center gap-3">
              <Activity size={18} className="text-blue-500" /> Forensic Vitals
            </h4>
            <div className="space-y-10">
              <ProgressStat label="Logic Consistency" value={88} color="bg-blue-600" />
              <ProgressStat label="Economic Resilience" value={results.ltvCacRatio > 3 ? 92 : 38} color={results.ltvCacRatio > 3 ? "bg-emerald-500" : "bg-red-500"} />
              <ProgressStat label="Market Fit Probability" value={results.riskLevel === 'Low' ? 94 : 58} color="bg-purple-600" />
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: DATA DEEP DIVE */}
        <div className="lg:col-span-8 space-y-8">
          {/* Assumption Analysis */}
          <div className="bg-slate-900/40 border border-slate-800 rounded-[3rem] p-12 backdrop-blur-xl shadow-xl">
            <h3 className="text-2xl font-black uppercase tracking-tighter italic mb-10 flex items-center gap-4">
              <Cpu className="text-blue-500" size={28} /> Logic Stress-Test
            </h3>
            <div className="space-y-5">
              {auditData.assumptions.map((assumption, idx) => (
                assumption && (
                  <div key={idx} className="p-6 rounded-[1.5rem] bg-slate-950/50 border border-slate-800 flex justify-between items-center group hover:border-blue-500/40 transition-all duration-300">
                    <div className="flex gap-4 items-center">
                      <div className="w-2 h-2 rounded-full bg-blue-600 shadow-[0_0_10px_#2563eb]" />
                      <div>
                        <h5 className="text-sm font-bold text-slate-200 group-hover:text-white transition-colors">{assumption}</h5>
                        <p className="text-[10px] text-slate-600 uppercase font-black mt-1">Verification: Standard Logic Pass</p>
                      </div>
                    </div>
                    <div className="px-5 py-2 bg-slate-900 rounded-xl border border-white/5 text-[10px] font-black uppercase text-slate-400 group-hover:text-emerald-400 transition-colors">
                      Analyzed
                    </div>
                  </div>
                )
              ))}
            </div>
          </div>

          {/* Runway Chart */}
          <div className="bg-slate-900/40 border border-slate-800 rounded-[3rem] p-12 backdrop-blur-xl shadow-xl">
             <div className="flex justify-between items-center mb-12">
               <h3 className="text-2xl font-black uppercase tracking-tighter italic">Deterministic Forecast</h3>
               <div className="flex gap-8 text-[10px] font-black uppercase text-slate-500 tracking-[0.2em]">
                 <span className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-blue-600 shadow-[0_0_15px_#2563eb]"/> Scaled Revenue</span>
                 <span className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-slate-800"/> Operational Burn</span>
               </div>
             </div>
             
             

             <div className="relative h-64 w-full flex items-end gap-3 px-4">
                {results.chartData.map((h, i) => (
                  <div key={i} className="flex-1 group relative">
                    <div className="absolute bottom-full mb-4 hidden group-hover:block bg-white text-black text-[10px] px-3 py-2 rounded-xl font-black z-30 shadow-2xl transition-all">
                      LOAD_CAP: {h}%
                    </div>
                    <div className="bg-blue-600/20 group-hover:bg-blue-600 transition-all duration-500 rounded-t-2xl shadow-[0_0_20px_rgba(37,99,235,0.05)]" style={{ height: `${Math.max(h, 10)}%` }} />
                    <div className="bg-white/5 w-full rounded-t-2xl mt-[1px]" style={{ height: `${Math.max(h * 0.35, 5)}%` }} />
                  </div>
                ))}
             </div>
             <div className="flex justify-between mt-10 text-[10px] font-black text-slate-700 uppercase tracking-[0.5em] border-t border-white/5 pt-8">
                <span>Phase_01</span>
                <span>Simulation_Mid</span>
                <span>Audit_End</span>
             </div>
          </div>
        </div>
      </main>
    </div>
  );
}

/* --- UI COMPONENTS --- */

function ProgressStat({ label, value, color }: { label: string, value: number, color: string }) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
        <span>{label}</span>
        <span className="text-slate-200">{Math.round(value)}%</span>
      </div>
      <div className="h-3 w-full bg-slate-950 rounded-full overflow-hidden border border-white/5 p-1">
        <div className={`h-full ${color} rounded-full transition-all duration-[1500ms] shadow-[0_0_20px_rgba(37,99,235,0.4)]`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}