"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { LeadForm } from "@/components/sections/lead-form";
import { ChevronPattern, ZigzagLine } from "@/components/icons/decorative";
import { Reveal, RevealGroup, revealItem } from "@/components/motion/reveal";
import type { BenefitRow, BenefitsBandContent, ThankYouContent } from "@/lib/types";

export function BenefitsBand({
  content,
  benefits,
  thankYou,
}: {
  content: BenefitsBandContent;
  benefits: BenefitRow[];
  thankYou: ThankYouContent;
}) {
  return (
    <section className="bg-pink-light py-20">
      <div className="container-page">
        <Reveal direction="left">
          <ZigzagLine className="h-5 w-20" />
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className="mt-2 text-[28px] font-extrabold text-navy sm:text-[36px]">{content.title}</h2>
        </Reveal>

        <div className="mt-10 grid gap-12 lg:grid-cols-2">
          <RevealGroup as="ul" className="space-y-4" stagger={0.1}>
            {benefits.map((b) => (
              <motion.li key={b.id} variants={revealItem} className="flex items-start gap-3">
                <motion.span
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ type: "spring", duration: 0.5, bounce: 0.5 }}
                  className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-pink text-white"
                >
                  <Check className="h-3.5 w-3.5" strokeWidth={3} />
                </motion.span>
                <span className="text-lg text-navy">{b.text}</span>
              </motion.li>
            ))}
          </RevealGroup>

          <Reveal direction="right" delay={0.15} className="hidden lg:block">
            <ChevronPattern rows={4} cols={3} animated />
          </Reveal>
        </div>

        <Reveal delay={0.2} className="mt-14 max-w-xl">
          <LeadForm
            title={content.form_title}
            subtitle={content.form_subtitle}
            buttonText={content.form_button}
            source="consultation_form"
            thankYou={thankYou}
            align="left"
            card={false}
          />
        </Reveal>
      </div>
    </section>
  );
}
