"use client";

import { motion } from "framer-motion";
import { Reveal, RevealGroup, revealItem } from "@/components/motion/reveal";
import type { StepItem, StepsIntroContent } from "@/lib/types";

export function Steps({ intro, steps }: { intro: StepsIntroContent; steps: StepItem[] }) {
  return (
    <section id="steps" className="mx-auto max-w-[1200px] px-5 py-16 min-[900px]:px-8 min-[900px]:py-24">
      <Reveal className="flex max-w-[640px] flex-col gap-4">
        <h2 className="font-display text-[34px] font-normal leading-[1.2] tracking-[-0.5px] text-[#17191c] min-[640px]:text-[52px] min-[640px]:tracking-[-0.8px]">
          {intro.title}
        </h2>
        <p className="text-[17px] leading-relaxed text-[#777b86]">{intro.paragraph}</p>
      </Reveal>

      <RevealGroup
        className="mt-12 grid grid-cols-1 gap-5 min-[640px]:grid-cols-2 min-[900px]:grid-cols-3"
        stagger={0.08}
      >
        {steps.map((step) => (
          <motion.div
            key={step.id}
            variants={revealItem}
            whileHover={{ y: -4 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col gap-3 rounded-3xl bg-[#f2f2f3] p-7"
          >
            <div className="font-display text-[32px] text-[#979799]">{step.num}</div>
            <div className="text-lg font-medium text-[#17191c]">{step.title}</div>
            <div className="text-[15px] leading-relaxed text-[#777b86]">{step.text}</div>
          </motion.div>
        ))}
      </RevealGroup>
    </section>
  );
}
