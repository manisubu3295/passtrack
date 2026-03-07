"use client";

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

type MotionProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  horizontalDrift?: boolean;
};

const baseTransition = {
  duration: 0.6,
  ease: 'easeOut' as const,
};

export function FadeUp({ children, className, delay = 0 }: MotionProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ ...baseTransition, delay }}
    >
      {children}
    </motion.div>
  );
}

export function SlideInCard({
  children,
  className,
  delay = 0,
  horizontalDrift = false,
}: MotionProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      animate={horizontalDrift ? { x: [0, 8, 0] } : undefined}
      whileHover={{ y: -6, boxShadow: '0 30px 65px rgba(15, 23, 42, 0.18)' }}
      viewport={{ once: true, amount: 0.25 }}
      transition={
        horizontalDrift
          ? {
              x: {
                duration: 0.6,
                ease: 'easeOut',
                repeat: Infinity,
                repeatDelay: 1.2,
                delay,
              },
              opacity: { ...baseTransition, delay },
              y: { ...baseTransition, delay },
            }
          : { ...baseTransition, delay }
      }
    >
      {children}
    </motion.div>
  );
}

type MotionButtonLinkProps = {
  href: string;
  className?: string;
  children: ReactNode;
};

export function MotionButtonLink({ href, className, children }: MotionButtonLinkProps) {
  return (
    <motion.a
      href={href}
      className={className}
      whileHover={{ y: -2, scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      transition={baseTransition}
    >
      {children}
    </motion.a>
  );
}
