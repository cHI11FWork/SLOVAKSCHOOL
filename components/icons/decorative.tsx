"use client";

import type { SVGProps } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

/** Hand-drawn-style curved arrow, used pointing into/out of the lead-form cards. */
export function SquiggleArrow({ className, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 160 90"
      fill="none"
      className={cn("text-pink", className)}
      {...props}
    >
      <path
        d="M4 8c28 2 40 22 30 40S10 68 24 82c10 10 40 6 60-6"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        strokeDasharray="1 14"
      />
      <path
        d="M70 64l16 12-4 19"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

/** Tightly interlocking chevron weave — decorative accent used in the benefits band. */
export function ChevronPattern({
  className,
  rows = 4,
  cols = 3,
  animated = false,
}: {
  className?: string;
  rows?: number;
  cols?: number;
  animated?: boolean;
}) {
  return (
    <div className={cn("flex flex-col opacity-90", className)}>
      {Array.from({ length: rows }).map((_, row) => (
        <div
          key={row}
          className="flex"
          style={{
            marginTop: row === 0 ? 0 : "-1.05rem",
            transform: row % 2 === 1 ? "translateX(-0.6rem)" : undefined,
          }}
        >
          {Array.from({ length: cols }).map((_, col) => (
            <motion.svg
              key={col}
              viewBox="0 0 40 40"
              className={cn("h-10 w-10 shrink-0 text-pink-dark", col > 0 && "-ml-1.5")}
              animate={animated ? { y: [0, -6, 0] } : undefined}
              transition={
                animated
                  ? {
                      duration: 2.6,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: col * 0.15 + row * 0.08,
                    }
                  : undefined
              }
            >
              <path
                d="M6 4l16 16-16 16"
                stroke="currentColor"
                strokeWidth="7"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            </motion.svg>
          ))}
        </div>
      ))}
    </div>
  );
}

/** Horizontal wavy squiggle accent, used above headings (e.g. the benefits band title). */
export function ZigzagLine({ className, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 90 24"
      fill="none"
      className={cn("text-pink", className)}
      {...props}
    >
      <path
        d="M2 18c6-14 12-14 18 0s12 14 18 0 12-14 18 0 12 14 18 0 8-10 14-12"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function DotScatter({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 60" className={cn("text-pink", className)} fill="none">
      {Array.from({ length: 5 }).map((_, i) => (
        <circle key={i} cx={20 + i * 40} cy={20 + (i % 2) * 20} r="9" fill="currentColor" opacity={0.15 + i * 0.03} />
      ))}
    </svg>
  );
}
