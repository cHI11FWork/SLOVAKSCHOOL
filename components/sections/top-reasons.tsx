"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Reveal, RevealGroup, revealItem } from "@/components/motion/reveal";
import type { TopReasonRow, TopReasonsIntroContent } from "@/lib/types";

export function TopReasons({
  intro,
  reasons,
}: {
  intro: TopReasonsIntroContent;
  reasons: TopReasonRow[];
}) {
  const listRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: listRef,
    offset: ["start 0.8", "end 0.6"],
  });
  const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section className="py-20">
      <div className="container-page">
        <Reveal>
          <h2 className="text-center text-[28px] font-extrabold text-navy sm:text-[36px]">
            {intro.title}
          </h2>
        </Reveal>

        <div ref={listRef} className="relative mx-auto mt-14 max-w-2xl">
          <div className="absolute bottom-6 left-[17px] top-6 w-[2px] bg-pink/15" />
          <motion.div
            style={{ scaleY: lineScale }}
            className="absolute bottom-6 left-[17px] top-6 w-[2px] origin-top bg-pink/60"
          />
          <RevealGroup as="ul" className="space-y-8" stagger={0.12}>
            {reasons.map((reason, i) => (
              <motion.li key={reason.id} variants={revealItem} className="relative flex items-start gap-6">
                <motion.span
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ type: "spring", duration: 0.5, bounce: 0.55, delay: i * 0.05 }}
                  className="relative z-10 flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-full bg-pink font-display text-lg font-semibold text-white"
                >
                  {i + 1}
                </motion.span>
                <motion.div
                  whileHover={{ y: -2, boxShadow: "0 12px 24px -10px rgba(23,25,28,0.2)" }}
                  transition={{ duration: 0.25 }}
                  className="flex-1 rounded-lg border-t-4 border-pink-dark bg-white px-6 py-5 shadow-sm"
                >
                  <p className="text-base leading-relaxed text-navy/90">{reason.text}</p>
                </motion.div>
              </motion.li>
            ))}
          </RevealGroup>
        </div>
      </div>
    </section>
  );
}
