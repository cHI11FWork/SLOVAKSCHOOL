"use client";

import { motion } from "framer-motion";
import { Reveal, RevealGroup, revealItemScale } from "@/components/motion/reveal";
import type { CostContent, CostItemRow } from "@/lib/types";

export function CostSection({ content, items }: { content: CostContent; items: CostItemRow[] }) {
  return (
    <section id="cost" className="py-20">
      <div className="container-page">
        <Reveal>
          <h2 className="font-display text-[28px] font-extrabold text-navy sm:text-[36px]">
            {content.title}
          </h2>
        </Reveal>
        <Reveal delay={0.05}>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-navy/80">{content.paragraph_1}</p>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-navy/80">{content.paragraph_2}</p>
        </Reveal>

        <RevealGroup className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4" stagger={0.08}>
          {items.map((item) => (
            <motion.div
              key={item.id}
              variants={revealItemScale}
              whileHover={{ y: -6, boxShadow: "0 16px 32px -12px rgba(23,25,28,0.18)" }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center justify-center rounded-[15px] bg-pink-light px-4 py-8 text-center"
            >
              <span className="font-display text-2xl font-bold text-navy">{item.amount}</span>
              <span className="mt-2 text-sm text-navy/70">{item.label}</span>
            </motion.div>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
