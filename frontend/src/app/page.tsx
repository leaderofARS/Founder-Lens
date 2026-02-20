"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  ArrowRight, BrainCircuit, ShieldAlert, TrendingUp, Layers, Zap,
  Search, Cpu, LineChart, PieChart, CheckCircle2, MessageSquare, 
  Globe, Fingerprint, Activity, Terminal, ShieldCheck, Microscope
} from 'lucide-react';
export default function LandingPage() {
  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-50 overflow-x-hidden font-sans">
      
      {/* BACKGROUND ARCHITECTURE */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[800px] bg-blue-600/10 blur-[150px] rounded-full" />
      </div>

      {/* NAVIGATION */}
      <nav className="sticky top-0 z-[100] backdrop-blur-md border-b border-white/5 px-10 py-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2 group cursor-pointer">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center group-hover:rotate-12 transition-transform shadow-lg shadow-blue-600/20">
              <Layers size={18} className="text-white" />
            </div>
            <span className="text-xl font-black tracking-tighter uppercase">FounderLens</span>
          </div>
          <div className="hidden lg:flex gap-10 text-[10px] font-black uppercase tracking-widest text-slate-500">
            <a href="#methodology" className="hover:text-blue-400 transition-colors">Forensics</a>
            <a href="#logic-engine" className="hover:text-blue-400 transition-colors">Logic Engine</a>
            <a href="#simulations" className="hover:text-blue-400 transition-colors">Simulations</a>
            <a href="#roadmap" className="hover:text-blue-400 transition-colors">Roadmap</a>
          </div>
          <Link href="/audit">
            <button className="px-6 py-2 rounded-full bg-white text-black text-xs font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all shadow-xl shadow-white/5">
              Launch Audit
            </button>
          </Link>
        </div>
      </nav>

      {/* 1. HERO SECTION */}
      <header className="relative z-10 pt-32 pb-32 px-8 text-center max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-500/20 bg-blue-500/5 text-blue-400 text-[10px] font-black uppercase tracking-[0.2em] mb-10 animate-pulse">
          <Zap size={12} fill="currentColor" />
          <span>System v1.02 Online</span>
        </motion.div>

        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="text-7xl md:text-9xl font-black tracking-tighter leading-[0.85] mb-10 bg-gradient-to-b from-white via-white to-slate-600 bg-clip-text text-transparent">
          IDEAS DIE.<br />LOGIC ENDURES.
        </motion.h1>

        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="text-xl md:text-2xl text-slate-400 max-w-3xl mx-auto mb-14 font-medium leading-relaxed">
          The first forensic intelligence platform that deconstructs startup viability using <strong>Deterministic Math</strong> and <strong>Assumption Stress-Testing</strong>.
        </motion.p>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-6 justify-center">
          <Link href="/audit">
            <button className="flex items-center justify-center gap-3 px-12 py-6 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xl transition-all shadow-2xl shadow-blue-600/40 group">
              Start Free Audit <ArrowRight className="group-hover:translate-x-1 transition-transform" />
            </button>
          </Link>
          <button className="px-12 py-6 rounded-2xl border border-slate-800 bg-slate-900/50 hover:bg-slate-800 font-bold text-slate-300 transition-all">
            View Whitepaper
          </button>
        </motion.div>
      </header>

      {/* 2. STATS OVERLAY */}
      <section className="relative z-10 py-16 border-y border-white/5 bg-white/[0.02] backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-10 grid grid-cols-2 lg:grid-cols-4 gap-12">
          <Stat label="Simulations/Sec" value="12,400+" />
          <Stat label="Accuracy Rating" value="99.2%" />
          <Stat label="Assumptions Tested" value="1.2M" />
          <Stat label="Founder Bias Drop" value="68%" />
        </div>
      </section>

      {/* 3. CORE METHODOLOGY (Original Section Expanded) */}
      <section id="methodology" className="relative z-10 py-40 px-8 max-w-7xl mx-auto">
        <SectionHeader title="Forensic Framework" subtitle="Deconstructing the Startup DNA" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <MethodologyCard icon={<BrainCircuit size={40} className="text-blue-500" />}
            title="Assumption Breaker"
            desc="We don't just read your pitch. We identify the 'unspoken truths'—the 3 to 5 hidden variables that will actually determine your success or failure."
            features={["Implicit Logic Mapping", "Semantic Gap Detection"]} />
          <MethodologyCard icon={<TrendingUp size={40} className="text-emerald-500" />}
            title="Monte Carlo Engines"
            desc="Our system runs 10,000 permutations of your unit economics to find the exact 'Death Zone' where your burn rate exceeds your scale."
            features={["Worst-Case Modeling", "Runway Stress Tests"]} />
          <MethodologyCard icon={<ShieldAlert size={40} className="text-purple-500" />}
            title="Fragility Scoring"
            desc="Receive a proprietary score (1-10) that measures how easily your model breaks when facing real-world market volatility."
            features={["Sensitivity Analysis", "Competitor Impact Score"]} />
        </div>
      </section>

      {/* 4. THE LOGIC ENGINE (New Depth) */}
      <section id="logic-engine" className="relative z-10 py-40 bg-blue-600/5 border-y border-blue-500/10">
        <div className="max-w-7xl mx-auto px-10 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div>
            <h2 className="text-5xl font-black tracking-tighter mb-8 leading-tight">Insight, Not Just Generation.</h2>
            <p className="text-slate-400 text-lg mb-10 leading-relaxed italic">
              "Generative AI tells you what you want to hear. Decision Intelligence tells you what you need to know."
            </p>
            <div className="space-y-6">
              <LogicItem icon={<Microscope size={20}/>} label="Deep Semantic Parsing" text="Extracts raw business data from conversational pitches." />
              <LogicItem icon={<Terminal size={20}/>} label="Deterministic Calculation" text="Zero hallucinations. All financial models are hard-coded math." />
              <LogicItem icon={<Globe size={20}/>} label="Global Market Signals" text="Real-time verification against current industry benchmarks." />
            </div>
          </div>
          <div className="relative p-8 rounded-[2rem] bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden group">
            <div className="absolute inset-0 bg-blue-600/5 group-hover:bg-blue-600/10 transition-colors" />
            <div className="relative z-10 space-y-6">
               <div className="flex justify-between items-center border-b border-white/5 pb-4">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/50" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                    <div className="w-3 h-3 rounded-full bg-green-500/50" />
                  </div>
                  <span className="text-[10px] font-mono text-slate-500 uppercase">Analysis_Running.exe</span>
               </div>
               <div className="space-y-3 font-mono text-xs">
                  <p className="text-blue-400">&gt; Scanning Assumptions...</p>
                  <p className="text-emerald-400">&gt; Logic Integrity: 88%</p>
                  <p className="text-red-400">&gt; High Sensitivity to CAC detected.</p>
                  <div className="h-2 w-full bg-slate-800 rounded-full">
                    <div className="h-full w-2/3 bg-blue-600 rounded-full animate-pulse" />
                  </div>
               </div>
               <div className="grid grid-cols-2 gap-4 pt-4">
                  <div className="h-24 bg-slate-950 rounded-xl border border-white/5 p-4">
                    <p className="text-[10px] text-slate-500 uppercase font-bold">Burn Risk</p>
                    <p className="text-2xl font-black text-red-500">Critical</p>
                  </div>
                  <div className="h-24 bg-slate-950 rounded-xl border border-white/5 p-4">
                    <p className="text-[10px] text-slate-500 uppercase font-bold">Viability</p>
                    <p className="text-2xl font-black text-emerald-500">High</p>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. COMPARISON GRID (The "Brutal Truth") */}
      <section className="relative z-10 py-40 px-8 max-w-5xl mx-auto">
        <SectionHeader title="Strategic Superiority" subtitle="The FounderLens Difference" />
        <div className="rounded-[3rem] border border-slate-800 bg-slate-950/50 p-1 md:p-12 backdrop-blur-3xl shadow-3xl overflow-hidden">
          <div className="grid grid-cols-3 py-6 border-b border-white/5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 px-6">
            <span>Capability</span>
            <span>Typical AI</span>
            <span className="text-blue-400">FounderLens</span>
          </div>
          <div className="space-y-2">
            <ComparisonRow label="Logic Core" bad="Generative Summaries" good="Forensic Analysis" />
            <ComparisonRow label="Calculations" bad="Hallucinated Guesses" good="Deterministic Engines" />
            <ComparisonRow label="Assumption Check" bad="Passive Acceptance" good="Aggressive Stress-Test" />
            <ComparisonRow label="Psychology" bad="Confirmatory Bias" good="Objective Validation" />
            <ComparisonRow label="Deliverable" bad="Pitch Deck PDF" good="Decision Roadmap" />
          </div>
        </div>
      </section>

      {/* 6. PROJECT ROADMAP (The "Third Layer") */}
      <section id="roadmap" className="relative z-10 py-40 px-8 max-w-7xl mx-auto">
        <SectionHeader title="The Evolution" subtitle="Roadmap to Institutional Intelligence" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <RoadmapCard phase="01" status="Live" title="The Lab" desc="Foundational Audit & Risk Scoring Engines." />
          <RoadmapCard phase="02" status="Q3 2026" title="Signal Mesh" desc="Real-time market signal ingestion for live audits." />
          <RoadmapCard phase="03" status="Q4 2026" title="Venture Sync" desc="Connecting validated logic to Tier-1 capital." />
          <RoadmapCard phase="04" status="2027" title="Predictive Fail" desc="ML models trained on 10,000+ startup failures." />
        </div>
      </section>

      {/* 7. FINAL CALL TO ACTION */}
      <section className="relative z-10 py-40 px-8 text-center bg-gradient-to-b from-transparent to-blue-900/10">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
          <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-10">READY FOR THE TRUTH?</h2>
          <Link href="/audit">
            <button className="px-16 py-8 rounded-[2rem] bg-white text-black font-black text-2xl hover:scale-105 hover:bg-blue-600 hover:text-white transition-all shadow-2xl">
              Audit My Idea Now
            </button>
          </Link>
          <p className="mt-8 text-slate-500 font-mono text-[10px] uppercase tracking-[0.5em]">No Registration Required // 100% Secure Analysis</p>
        </motion.div>
      </section>

      {/* FOOTER */}
      <footer className="relative z-10 py-12 border-t border-white/5 text-center">
        <div className="max-w-7xl mx-auto px-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-[10px] font-black uppercase tracking-widest text-slate-600">
            FounderLens © 2026 // Integrated Decision Intel
          </div>
          <div className="flex gap-8 text-[10px] font-black uppercase tracking-widest text-slate-400">
            <a href="#" className="hover:text-white">Privacy</a>
            <a href="#" className="hover:text-white">API Docs</a>
            <a href="#" className="hover:text-white">Methodology</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* --- HELPER COMPONENTS --- */

function SectionHeader({ title, subtitle }: { title: string, subtitle: string }) {
  return (
    <div className="text-center mb-24">
      <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-4 italic">{title}</h2>
      <div className="flex items-center justify-center gap-4">
        <div className="w-12 h-[1px] bg-blue-600" />
        <p className="text-blue-400 font-mono uppercase tracking-[0.3em] text-[10px] font-bold">{subtitle}</p>
        <div className="w-12 h-[1px] bg-blue-600" />
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string, value: string }) {
  return (
    <div className="text-center group">
      <div className="text-4xl font-black mb-2 group-hover:text-blue-400 transition-colors">{value}</div>
      <div className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-black">{label}</div>
    </div>
  );
}

function MethodologyCard({ icon, title, desc, features }: any) {
  return (
    <div className="p-12 rounded-[2.5rem] border border-slate-800 bg-slate-900/30 hover:border-blue-500/50 transition-all group relative overflow-hidden">
      <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">{icon}</div>
      <div className="mb-10 group-hover:scale-110 transition-transform duration-500">{icon}</div>
      <h3 className="text-2xl font-black mb-6 uppercase tracking-tight">{title}</h3>
      <p className="text-slate-400 text-sm leading-relaxed mb-8">{desc}</p>
      <div className="space-y-3">
         {features.map((f: string, i: number) => (
           <div key={i} className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase">
              <CheckCircle2 size={12} className="text-blue-600" /> {f}
           </div>
         ))}
      </div>
    </div>
  );
}

function LogicItem({ icon, label, text }: any) {
  return (
    <div className="flex gap-4 items-start group">
      <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
        {icon}
      </div>
      <div>
        <h4 className="font-black text-sm uppercase tracking-widest mb-1">{label}</h4>
        <p className="text-slate-500 text-sm">{text}</p>
      </div>
    </div>
  );
}

function RoadmapCard({ phase, status, title, desc }: any) {
  return (
    <div className="p-8 rounded-3xl border border-slate-800 bg-slate-950/50 hover:bg-slate-900 transition-all">
      <div className="flex justify-between items-center mb-6">
        <span className="text-3xl font-black text-slate-800">{phase}</span>
        <span className="px-2 py-1 bg-blue-600/10 text-blue-500 text-[8px] font-black uppercase rounded border border-blue-600/20">{status}</span>
      </div>
      <h4 className="font-bold text-lg mb-4">{title}</h4>
      <p className="text-slate-500 text-xs leading-relaxed">{desc}</p>
    </div>
  );
}

function ComparisonRow({ label, bad, good }: { label: string, bad: string, good: string }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 py-6 border-b border-white/5 last:border-0 gap-4 px-6 items-center group hover:bg-white/[0.02] transition-colors">
      <span className="text-slate-400 font-black uppercase tracking-widest text-[10px]">{label}</span>
      <span className="text-red-400/50 font-medium italic text-sm">{bad}</span>
      <span className="text-emerald-400 font-black text-base">{good}</span>
    </div>
  );
}