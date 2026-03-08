"use client";

import { FormEvent, useState } from 'react';
import { motion } from 'framer-motion';
import { employeeCountOptions, primaryNeedOptions } from '@/lib/lead-options';

type FormState = {
  name: string;
  company: string;
  workEmail: string;
  employeeCount: string;
  whatsapp: string;
  primaryNeed: string;
};

const initialState: FormState = {
  name: '',
  company: '',
  workEmail: '',
  employeeCount: '',
  whatsapp: '',
  primaryNeed: '',
};

export function EarlyAccessForm() {
  const [values, setValues] = useState<FormState>(initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setMessage(null);

    try {
      const response = await fetch('/api/early-access', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...values,
          source: 'landing-form',
        }),
      });

      if (!response.ok) {
        let errorReason = `Submission failed (HTTP ${response.status})`;

        try {
          const data = (await response.json()) as { error?: string };
          if (data?.error) {
            errorReason = data.error;
          }
        } catch {
          // Ignore parse errors and keep fallback errorReason.
        }

        throw new Error(errorReason);
      }

      setValues(initialState);
      setMessage('Thank you. We will notify you when early access begins.');
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Submission failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="glass-card rounded-2xl p-5 sm:p-6 md:p-7" noValidate>
      <div className="mb-4 flex flex-col gap-2 border-b border-white/40 pb-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm font-semibold text-slate-800">Early Access Registration</p>
        <span className="rounded-full border border-red-200 bg-red-50/80 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-accent">
          Limited
        </span>
      </div>
      <div className="grid gap-4">
        <label className="text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-600">
          Full Name
          <input
            required
            name="name"
            value={values.name}
            onChange={(event) => setValues((prev) => ({ ...prev, name: event.target.value }))}
            className="mt-1.5 w-full rounded-lg border border-white/60 bg-white/75 px-3 py-2.5 text-sm font-medium text-slate-900 outline-none ring-red-200 transition focus:ring"
          />
        </label>

        <label className="text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-600">
          Company Name
          <input
            required
            name="company"
            value={values.company}
            onChange={(event) => setValues((prev) => ({ ...prev, company: event.target.value }))}
            className="mt-1.5 w-full rounded-lg border border-white/60 bg-white/75 px-3 py-2.5 text-sm font-medium text-slate-900 outline-none ring-red-200 transition focus:ring"
          />
        </label>

        <label className="text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-600">
          Work Email
          <input
            required
            type="email"
            name="workEmail"
            value={values.workEmail}
            onChange={(event) => setValues((prev) => ({ ...prev, workEmail: event.target.value }))}
            className="mt-1.5 w-full rounded-lg border border-white/60 bg-white/75 px-3 py-2.5 text-sm font-medium text-slate-900 outline-none ring-red-200 transition focus:ring"
          />
        </label>

        <label className="text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-600">
          Company Size
          <select
            required
            name="employeeCount"
            value={values.employeeCount}
            onChange={(event) =>
              setValues((prev) => ({
                ...prev,
                employeeCount: event.target.value,
              }))
            }
            className="mt-1.5 w-full rounded-lg border border-white/60 bg-white/75 px-3 py-2.5 text-sm font-medium text-slate-900 outline-none ring-red-200 transition focus:ring"
          >
            <option value="">Select company size</option>
            {employeeCountOptions.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>

        <label className="text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-600">
          WhatsApp Number (Optional)
          <input
            name="whatsapp"
            value={values.whatsapp}
            onChange={(event) =>
              setValues((prev) => ({
                ...prev,
                whatsapp: event.target.value,
              }))
            }
            className="mt-1.5 w-full rounded-lg border border-white/60 bg-white/75 px-3 py-2.5 text-sm font-medium text-slate-900 outline-none ring-red-200 transition focus:ring"
            placeholder="+65 9000 0000"
          />
        </label>

        <label className="text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-600">
          Primary Need
          <select
            required
            name="primaryNeed"
            value={values.primaryNeed}
            onChange={(event) =>
              setValues((prev) => ({
                ...prev,
                primaryNeed: event.target.value,
              }))
            }
            className="mt-1.5 w-full rounded-lg border border-white/60 bg-white/75 px-3 py-2.5 text-sm font-medium text-slate-900 outline-none ring-red-200 transition focus:ring"
          >
            <option value="">Select primary need</option>
            {primaryNeedOptions.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>

        <motion.button
          type="submit"
          disabled={isSubmitting}
          className="mt-2 inline-flex w-full items-center justify-center rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
          whileHover={{ y: -2, scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          {isSubmitting ? 'Submitting...' : 'Request Early Access'}
        </motion.button>
      </div>

      {message ? <p className="mt-4 text-sm font-medium text-emerald-700">{message}</p> : null}
      {error ? <p className="mt-4 text-sm font-medium text-accent">{error}</p> : null}
      <p className="mt-3 text-xs text-slate-500">
        We’ll only use your details to contact you about PassTrack early access.
      </p>
    </form>
  );
}
