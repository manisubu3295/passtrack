"use client";

import { motion } from 'framer-motion';

const rows = [
  {
    name: 'John Tan',
    passType: 'Employment Pass',
    expiryDate: '28 Mar 2026',
    status: '⚠ Renewal Required',
    statusTone: 'alert',
    expiryHint: 'Expires in 21 days',
  },
  {
    name: 'Nur Aisyah',
    passType: 'S Pass',
    expiryDate: '15 Apr 2026',
    status: 'Review Soon',
    statusTone: 'warning',
    expiryHint: 'Expires in 39 days',
  },
  {
    name: 'Ravi Kumar',
    passType: 'Work Permit',
    expiryDate: '05 May 2026',
    status: 'On Track',
    statusTone: 'ok',
    expiryHint: 'Expires in 59 days',
  },
  {
    name: 'Mei Lin',
    passType: 'Employment Pass',
    expiryDate: '10 Jun 2026',
    status: 'On Track',
    statusTone: 'ok',
    expiryHint: 'Expires in 95 days',
  },
] as const;

const statusStyleMap = {
  alert: 'bg-red-50 text-accent border-red-200',
  warning: 'bg-amber-50 text-amber-700 border-amber-200',
  ok: 'bg-emerald-50 text-emerald-700 border-emerald-200',
} as const;

export function DashboardMockup() {
  return (
    <div className="glass-card rounded-2xl p-3 sm:p-4 md:p-5">
      <div className="flex flex-col gap-2 border-b border-white/40 pb-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-800">Pass Renewal Dashboard</p>
          <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
            <motion.span
              className="h-1.5 w-1.5 rounded-full bg-accent"
              animate={{ opacity: [0.35, 1, 0.35], scale: [1, 1.15, 1] }}
              transition={{ duration: 0.6, ease: 'easeOut', repeat: Infinity, repeatDelay: 1.2 }}
            />
            <span>Live Expiry Alerts</span>
          </div>
        </div>
        <span className="glass-card-soft rounded-full px-2.5 py-1 text-xs font-semibold text-accent">
          4 Active Passes
        </span>
      </div>

      <div className="mt-4 hidden grid-cols-12 gap-3 border-b border-white/30 px-2 pb-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500 sm:grid">
        <p className="col-span-3">Employee Name</p>
        <p className="col-span-3">Pass Type</p>
        <p className="col-span-3">Expiry Date</p>
        <p className="col-span-3 text-right">Status</p>
      </div>

      <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
        <div className="glass-card-soft rounded-lg px-2.5 py-2 text-center">
          <p className="text-[10px] uppercase tracking-[0.08em] text-slate-500">Expiring 30d</p>
          <p className="mt-1 text-sm font-semibold text-accent">1</p>
        </div>
        <div className="glass-card-soft rounded-lg px-2.5 py-2 text-center">
          <p className="text-[10px] uppercase tracking-[0.08em] text-slate-500">Expiring 60d</p>
          <p className="mt-1 text-sm font-semibold text-amber-700">2</p>
        </div>
        <div className="glass-card-soft rounded-lg px-2.5 py-2 text-center">
          <p className="text-[10px] uppercase tracking-[0.08em] text-slate-500">Compliant</p>
          <p className="mt-1 text-sm font-semibold text-emerald-700">1</p>
        </div>
      </div>

      <div className="mt-3 space-y-2.5">
        {rows.map((row, index) => (
          <motion.div
            key={row.name}
            className="glass-card-soft rounded-xl px-3 py-3 sm:px-4"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: index * 0.08 }}
          >
            <div className="grid gap-2 text-sm sm:grid-cols-12 sm:items-center sm:gap-3">
              <div className="sm:col-span-3">
                <p className="font-semibold text-slate-900">{row.name}</p>
              </div>

              <div className="sm:col-span-3">
                <p className="font-medium text-slate-700">{row.passType}</p>
              </div>

              <div className="sm:col-span-3">
                <p className="font-medium text-slate-700">{row.expiryDate}</p>
                <p className="text-xs text-slate-500">{row.expiryHint}</p>
              </div>

              <div className="sm:col-span-3 sm:justify-self-end">
                <motion.span
                  className={`inline-flex w-fit rounded-full border px-2.5 py-1 text-xs font-semibold ${statusStyleMap[row.statusTone]}`}
                  animate={
                    row.statusTone === 'alert'
                      ? { boxShadow: ['0 0 0 rgba(239,68,68,0)', '0 0 0 6px rgba(239,68,68,0.14)', '0 0 0 rgba(239,68,68,0)'] }
                      : undefined
                  }
                  transition={
                    row.statusTone === 'alert'
                      ? { duration: 0.6, ease: 'easeOut', repeat: Infinity, repeatDelay: 1.4 }
                      : { duration: 0.6, ease: 'easeOut' }
                  }
                >
                  {row.status}
                </motion.span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
