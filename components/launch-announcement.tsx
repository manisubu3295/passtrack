"use client";

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const launchAt = new Date('2026-03-23T09:30:00+08:00').getTime();

type Countdown = {
  isOpen: boolean;
  days: number;
  hours: number;
  minutes: number;
};

const getCountdown = (): Countdown => {
  const now = Date.now();
  const diff = launchAt - now;

  if (diff <= 0) {
    return {
      isOpen: true,
      days: 0,
      hours: 0,
      minutes: 0,
    };
  }

  const totalMinutes = Math.floor(diff / (1000 * 60));
  const days = Math.floor(totalMinutes / (24 * 60));
  const hours = Math.floor((totalMinutes % (24 * 60)) / 60);
  const minutes = totalMinutes % 60;

  return {
    isOpen: false,
    days,
    hours,
    minutes,
  };
};

const pad = (value: number) => value.toString().padStart(2, '0');

type CountdownItemProps = {
  value: string;
  label: string;
};

function CountdownItem({ value, label }: CountdownItemProps) {
  return (
    <div className="rounded-lg border border-white/60 bg-white/75 px-2.5 py-1.5 text-center shadow-[0_8px_20px_rgba(15,23,42,0.08)]">
      <motion.p
        key={`${label}-${value}`}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="text-sm font-semibold tabular-nums text-slate-900"
      >
        {value}
      </motion.p>
      <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-slate-500">{label}</p>
    </div>
  );
}

export function LaunchAnnouncement() {
  const [countdown, setCountdown] = useState<Countdown>(() => getCountdown());

  useEffect(() => {
    const interval = window.setInterval(() => {
      setCountdown(getCountdown());
    }, 1000);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <section className="border-b border-sky-100/80 bg-sky-50/75 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-center gap-2.5 px-4 py-2.5 text-center sm:flex-row sm:gap-3">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-white/60 bg-white/70 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-600">
          <motion.span
            className="h-1.5 w-1.5 rounded-full bg-accent"
            animate={{ opacity: [0.45, 1, 0.45], scale: [1, 1.18, 1] }}
            transition={{ duration: 0.6, ease: 'easeOut', repeat: Infinity, repeatDelay: 1.1 }}
          />
          Launch Window
        </span>
        <motion.p
          className="max-w-[22rem] text-xs font-medium leading-5 text-slate-700 sm:max-w-none sm:text-sm sm:leading-5"
          animate={countdown.isOpen ? { opacity: 1 } : { opacity: [0.88, 1, 0.88] }}
          transition={{ duration: 0.6, ease: 'easeOut', repeat: countdown.isOpen ? 0 : Infinity, repeatDelay: 1.6 }}
        >
          {countdown.isOpen
            ? 'PassTrack Early Access is Now Open'
            : 'PassTrack Early Access Opens — 23 March 2026 • 09:30 AM (Singapore Time)'}
        </motion.p>
        {!countdown.isOpen ? (
          <div className="flex items-center gap-1.5">
            <CountdownItem value={String(countdown.days)} label="Days" />
            <CountdownItem value={pad(countdown.hours)} label="Hours" />
            <CountdownItem value={pad(countdown.minutes)} label="Minutes" />
          </div>
        ) : null}
        <motion.a
          href="#early-access"
          className="inline-flex w-full items-center justify-center rounded-md bg-accent px-3 py-1.5 text-xs font-semibold text-white shadow-[0_10px_24px_rgba(239,68,68,0.28)] transition hover:bg-red-600 sm:w-auto"
          whileHover={{ y: -2, scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          Join Early Access
        </motion.a>
      </div>
    </section>
  );
}
