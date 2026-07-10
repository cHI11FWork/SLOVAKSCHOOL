"use client";

import type { ReactNode } from "react";
import { motion, type Variants } from "framer-motion";
import { CountUp } from "@/components/motion/count-up";
import { cardHover } from "@/components/motion/reveal";

export function StatCard({
  label,
  value,
  icon,
  variants,
}: {
  label: string;
  value: number;
  icon: ReactNode;
  variants?: Variants;
}) {
  return (
    <motion.div
      variants={variants}
      whileHover={cardHover}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className="rounded-2xl border border-gray-100 bg-white p-5"
    >
      {icon}
      <p className="mt-3 text-2xl font-bold text-navy">
        <CountUp value={value} />
      </p>
      <p className="text-sm text-navy/60">{label}</p>
    </motion.div>
  );
}
