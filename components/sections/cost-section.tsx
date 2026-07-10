"use client";

import { motion } from "framer-motion";
import { Reveal, RevealGroup, revealItemScale, cardHover } from "@/components/motion/reveal";
import type { CostContent, CostItem } from "@/lib/types";

export function CostSection({ content, items }: { content: CostContent; items: CostItem[] }) {
  return (
    <section id="cost" className="bg-[#fafafb] py-16 min-[900px]:py-24">
      <div className="mx-auto max-w-[1200px] px-5 min-[900px]:px-8">
        <div className="grid grid-cols-1 items-start gap-10 min-[900px]:grid-cols-2 min-[900px]:gap-16">
          <Reveal className="flex flex-col gap-4">
            <h2 className="font-display text-[34px] font-normal leading-[1.2] tracking-[-0.5px] text-[#1e2156] min-[640px]:text-[52px] min-[640px]:tracking-[-0.8px]">
              {content.title}
            </h2>
            <p className="text-[17px] leading-relaxed text-[#777b86]">{content.paragraph}</p>
          </Reveal>

          <div className="flex flex-col gap-4">
            <RevealGroup className="grid grid-cols-1 gap-4 min-[640px]:grid-cols-2" stagger={0.08}>
              {items.map((item) => (
                <motion.div
                  key={item.id}
                  variants={revealItemScale}
                  whileHover={cardHover}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col gap-1.5 rounded-[20px] bg-white p-6"
                  style={{ boxShadow: "0 0 0 1px rgba(4,23,43,0.05), 0 8px 10px -6px rgba(0,0,0,0.08)" }}
                >
                  <div className="text-2xl font-medium tracking-[-0.23px] text-[#1e2156]">{item.price}</div>
                  <div className="text-[15px] leading-snug text-[#777b86]">{item.label}</div>
                </motion.div>
              ))}
            </RevealGroup>

            <Reveal delay={0.2}>
              <div className="rounded-2xl bg-[#fde6f4] px-6 py-5 text-[15px] leading-relaxed text-[#f41a94]">
                {content.note}
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
