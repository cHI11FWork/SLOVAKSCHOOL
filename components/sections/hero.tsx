"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { LeadForm } from "@/components/sections/lead-form";
import { Reveal, RevealGroup, revealItem } from "@/components/motion/reveal";
import type { HeroContent, ThankYouContent } from "@/lib/types";

export function Hero({ content, thankYou }: { content: HeroContent; thankYou: ThankYouContent }) {
  return (
    <section id="top" className="relative overflow-hidden pb-20 pt-40 lg:pt-48">
      <div className="container-page">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <motion.h1
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="text-[32px] font-extrabold leading-[1.15] text-navy sm:text-[40px]"
            >
              {content.headline}
            </motion.h1>
            <RevealGroup as="ul" className="mt-8 space-y-3" stagger={0.08} delay={0.2}>
              {content.bullets.map((bullet) => (
                <motion.li key={bullet} variants={revealItem} className="text-lg text-navy/90">
                  {bullet}
                </motion.li>
              ))}
            </RevealGroup>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 32, scale: 0.96 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            <div className="absolute -right-6 -top-6 -z-10 h-[70%] w-[70%] rotate-12 rounded-[28px] bg-pink/90 sm:h-[75%] sm:w-[75%]" />
            <div className="relative aspect-[5/4] w-full overflow-hidden rounded-[24px]">
              <Image
                src={content.image}
                alt="Студентка"
                fill
                priority
                sizes="(min-width: 1024px) 560px, 100vw"
                className="object-cover"
              />

              <div className="absolute inset-0 flex items-center justify-center">
                <span className="absolute h-16 w-16 animate-ping rounded-full bg-white/40" />
                <motion.span
                  whileHover={{ scale: 1.08 }}
                  className="relative flex h-16 w-16 items-center justify-center rounded-full bg-white/95 shadow-[0_8px_24px_rgba(30,33,86,0.35)] backdrop-blur-sm"
                >
                  <svg viewBox="0 0 24 24" className="ml-1 h-6 w-6 fill-pink">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </motion.span>
              </div>
            </div>
          </motion.div>
        </div>

        <Reveal delay={0.3} className="mt-16 lg:mt-24">
          <LeadForm
            title={content.form_title}
            subtitle={content.form_subtitle}
            buttonText={content.form_button}
            source="hero_form"
            thankYou={thankYou}
            decorated
          />
        </Reveal>
      </div>
    </section>
  );
}
