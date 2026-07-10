"use client";

import { Reveal, RevealGroup, revealItem, cardHover } from "@/components/motion/reveal";
import { ParallaxImage } from "@/components/motion/parallax-image";
import { motion } from "framer-motion";
import type { BenefitItem, WhyUsContent } from "@/lib/types";

export function WhyUs({ content, benefits }: { content: WhyUsContent; benefits: BenefitItem[] }) {
  return (
    <section id="why" className="bg-[#fafafb] py-16 min-[900px]:py-24">
      <div className="mx-auto grid max-w-[1200px] grid-cols-1 items-center gap-10 px-5 min-[900px]:grid-cols-[0.9fr_1.1fr] min-[900px]:gap-16 min-[900px]:px-8">
        <Reveal direction="left" className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl">
          <ParallaxImage
            src={content.image}
            alt=""
            sizes="(min-width: 900px) 520px, 100vw"
            strength={24}
          />
        </Reveal>

        <div className="flex flex-col gap-8">
          <Reveal direction="right">
            <h2 className="font-display text-[34px] font-normal leading-[1.2] tracking-[-0.5px] text-[#1e2156] min-[640px]:text-[52px] min-[640px]:tracking-[-0.8px]">
              {content.title_main} <em className="italic">{content.title_emphasis}</em>
            </h2>
          </Reveal>
          <Reveal direction="right" delay={0.1}>
            <p className="text-[17px] leading-relaxed text-[#777b86]">{content.paragraph}</p>
          </Reveal>

          <RevealGroup className="grid grid-cols-1 gap-3 min-[640px]:grid-cols-2" stagger={0.08}>
            {benefits.map((b) => (
              <motion.div
                key={b.id}
                variants={revealItem}
                whileHover={cardHover}
                transition={{ duration: 0.3 }}
                className="flex flex-col gap-1.5 rounded-2xl bg-[#f2f2f3] p-5 transition-colors hover:bg-white"
              >
                <div className="text-base font-medium text-[#1e2156]">{b.title}</div>
                <div className="text-[15px] leading-snug text-[#777b86]">{b.text}</div>
              </motion.div>
            ))}
          </RevealGroup>
        </div>
      </div>
    </section>
  );
}
