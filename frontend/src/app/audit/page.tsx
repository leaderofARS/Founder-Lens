// src/app/audit/page.tsx
import AuditForm from '@/components/forms/AuditForm';

export default function AuditPage() {
  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-50 overflow-hidden font-sans">
      {/* Background Decor to match landing page */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20" />
      </div>

      <main className="relative z-10 pt-20 pb-20 px-8">
        <div className="max-w-7xl mx-auto text-center mb-12">
          <h1 className="text-4xl font-black uppercase tracking-tighter italic mb-4">
            Forensic Lab
          </h1>
          <p className="text-slate-500 font-mono text-[10px] uppercase tracking-[0.3em]">
            Deconstructing Logic // System v1.02
          </p>
        </div>

        {/* The Form Component */}
        <AuditForm />
      </main>
    </div>
  );
}