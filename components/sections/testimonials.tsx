"use client";

import { motion } from "framer-motion";
import { Reveal, RevealGroup, revealItem } from "@/components/motion/reveal";
import type { TestimonialItem, TestimonialsIntroContent } from "@/lib/types";

export function Testimonials({
  intro,
  testimonials,
}: {
  intro: TestimonialsIntroContent;
  testimonials: TestimonialItem[];
}) {
  return (
    <section id="reviews" className="mx-auto max-w-[1200px] px-5 pb-16 min-[900px]:px-8 min-[900px]:pb-24">
      <Reveal>
        <h2 className="mb-10 font-display text-[34px] font-normal leading-[1.2] tracking-[-0.5px] text-[#1e2156] min-[640px]:mb-12 min-[640px]:text-[52px] min-[640px]:tracking-[-0.8px]">
          {intro.title}
        </h2>
      </Reveal>

      <RevealGroup className="grid grid-cols-1 gap-5 min-[640px]:grid-cols-2" stagger={0.1}>
        {testimonials.map((t) => (
          <motion.div
            key={t.id}
            variants={revealItem}
            whileHover={{ y: -4 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col gap-6 rounded-3xl bg-[#f2f2f3] p-6 min-[640px]:p-10"
          >
            <p className="font-display text-[22px] italic leading-snug text-[#1e2156]">{t.quote}</p>
            <div className="flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-sm font-medium text-[#1e2156]">
                {t.initials}
              </span>
              <div className="flex flex-col">
                <span className="text-[15px] font-medium text-[#1e2156]">{t.name}</span>
                <span className="text-sm text-[#979799]">{t.meta}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </RevealGroup>
    </section>
  );
}
