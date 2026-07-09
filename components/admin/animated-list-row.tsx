"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

export function AnimatedListRow({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay, ease: [0.16, 1, 0.3, 1] }}
      className="flex items-center justify-between py-3"
    >
      {children}
    </motion.div>
  );
}
