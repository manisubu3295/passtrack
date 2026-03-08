"use client";

import { FormEvent, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

type PopupFormState = {
  name: string;
  email: string;
  company: string;
};

const popupSessionKey = 'passtrack-early-access-popup-seen';

const initialState: PopupFormState = {
  name: '',
  email: '',
  company: '',
};

export function EarlyAccessPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [formValues, setFormValues] = useState<PopupFormState>(initialState);

  useEffect(() => {
    const alreadySeen = window.sessionStorage.getItem(popupSessionKey) === '1';
    if (alreadySeen) {
      return;
    }

    const onScroll = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (maxScroll <= 0) {
        return;
      }

      const progress = window.scrollY / maxScroll;
      if (progress >= 0.5) {
        setIsOpen(true);
        window.sessionStorage.setItem(popupSessionKey, '1');
        window.removeEventListener('scroll', onScroll);
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const closePopup = () => {
    setIsOpen(false);
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const response = await fetch('/api/early-access', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formValues.name,
          workEmail: formValues.email,
          company: formValues.company,
          employeeCount: '11–50',
          whatsapp: '',
          primaryNeed: 'Track pass expiries',
          source: 'scroll-popup',
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

      setSuccessMessage('Thank you. We will notify you when early access begins.');
      setFormValues(initialState);
    } catch (submitError) {
      setErrorMessage(submitError instanceof Error ? submitError.message : 'Submission failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-900/40 px-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <motion.div
            className="glass-card w-full max-w-md rounded-2xl p-5 sm:p-6"
            initial={{ opacity: 0, y: 18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <h3 className="text-xl font-semibold leading-tight text-primary">
                  Early Access for Singapore Companies
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  PassTrack opens early access on 23 March 2026 • 09:30 AM (SGT). Join the first
                  group of HR teams trying the platform.
                </p>
              </div>

              <button
                type="button"
                onClick={closePopup}
                aria-label="Close popup"
                className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/60 bg-white/70 text-slate-500 transition hover:text-slate-800"
              >
                ✕
              </button>
            </div>

            <form onSubmit={onSubmit} className="grid gap-3" noValidate>
              <label className="text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-600">
                Name
                <input
                  required
                  name="name"
                  value={formValues.name}
                  onChange={(event) =>
                    setFormValues((prev) => ({
                      ...prev,
                      name: event.target.value,
                    }))
                  }
                  className="mt-1.5 w-full rounded-lg border border-white/60 bg-white/75 px-3 py-2.5 text-sm font-medium text-slate-900 outline-none ring-red-200 transition focus:ring"
                />
              </label>

              <label className="text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-600">
                Work Email
                <input
                  required
                  type="email"
                  name="email"
                  value={formValues.email}
                  onChange={(event) =>
                    setFormValues((prev) => ({
                      ...prev,
                      email: event.target.value,
                    }))
                  }
                  className="mt-1.5 w-full rounded-lg border border-white/60 bg-white/75 px-3 py-2.5 text-sm font-medium text-slate-900 outline-none ring-red-200 transition focus:ring"
                />
              </label>

              <label className="text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-600">
                Company
                <input
                  required
                  name="company"
                  value={formValues.company}
                  onChange={(event) =>
                    setFormValues((prev) => ({
                      ...prev,
                      company: event.target.value,
                    }))
                  }
                  className="mt-1.5 w-full rounded-lg border border-white/60 bg-white/75 px-3 py-2.5 text-sm font-medium text-slate-900 outline-none ring-red-200 transition focus:ring"
                />
              </label>

              <motion.button
                type="submit"
                disabled={isSubmitting}
                className="mt-1 inline-flex w-full items-center justify-center rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-70"
                whileHover={{ y: -2, scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
              >
                {isSubmitting ? 'Submitting...' : 'Request Early Access'}
              </motion.button>
            </form>

            {successMessage ? (
              <p className="mt-3 text-sm font-medium text-emerald-700">{successMessage}</p>
            ) : null}
            {errorMessage ? <p className="mt-3 text-sm font-medium text-accent">{errorMessage}</p> : null}

            <p className="mt-4 text-center text-xs font-medium text-slate-500">
              Limited early access invitations available.
            </p>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
