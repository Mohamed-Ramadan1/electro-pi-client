"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

interface MotionRevealProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  y?: number;
  blur?: number;
  once?: boolean;
  amount?: number;
  className?: string;
}

export function MotionReveal({
  children,
  delay = 0,
  duration = 0.7,
  y = 26,
  blur = 10,
  once = true,
  amount = 0.22,
  className,
}: MotionRevealProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={
        prefersReducedMotion
          ? false
          : { opacity: 0, y, filter: `blur(${blur}px)` }
      }
      whileInView={
        prefersReducedMotion
          ? undefined
          : { opacity: 1, y: 0, filter: "blur(0px)" }
      }
      viewport={{ once, amount, margin: "0px 0px -12% 0px" }}
      transition={{ duration, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
