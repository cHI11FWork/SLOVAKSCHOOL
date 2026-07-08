import type { SVGProps } from "react";
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

/** Repeating chevron/arrow grid — decorative accent used in the benefits band. */
export function ChevronPattern({ className, rows = 4, cols = 3 }: { className?: string; rows?: number; cols?: number }) {
  return (
    <div
      className={cn("grid gap-3 opacity-90", className)}
      style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
    >
      {Array.from({ length: rows * cols }).map((_, i) => (
        <svg key={i} viewBox="0 0 40 40" className="text-pink-dark">
          <path
            d="M6 4l16 16-16 16"
            stroke="currentColor"
            strokeWidth="7"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
      ))}
    </div>
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
