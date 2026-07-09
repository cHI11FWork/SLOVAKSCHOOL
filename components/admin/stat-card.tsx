"use client";

import { motion, type Variants } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { CountUp } from "@/components/motion/count-up";

export function StatCard({
  label,
  value,
  icon: Icon,
  tone,
  variants,
}: {
  label: string;
  value: number;
  icon: LucideIcon;
  tone: string;
  variants?: Variants;
}) {
  return (
    <motion.div
      variants={variants}
      whileHover={{ y: -4, boxShadow: "0 12px 28px -14px rgba(30,33,86,0.25)" }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className="rounded-2xl border border-gray-100 bg-white p-5"
    >
      <Icon className={`h-5 w-5 ${tone}`} />
      <p className="mt-3 text-2xl font-bold text-navy">
        <CountUp value={value} />
      </p>
      <p className="text-sm text-navy/60">{label}</p>
    </motion.div>
  );
}
