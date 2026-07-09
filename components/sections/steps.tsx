"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/motion/reveal";
import type { StepRow, StepsIntroContent } from "@/lib/types";

export function Steps({ intro, steps }: { intro: StepsIntroContent; steps: StepRow[] }) {
  return (
    <section id="steps" className="py-20">
      <div className="container-page">
        <Reveal>
          <h2 className="text-[28px] font-extrabold text-navy sm:text-[36px]">{intro.title}</h2>
        </Reveal>

        <div className="mt-12 space-y-14">
          {steps.map((step, i) => (
            <div
              key={step.id}
              className={cn(
                "grid items-center gap-8 lg:grid-cols-2 lg:gap-16",
                i % 2 === 1 && "lg:[&>*:first-child]:order-2"
              )}
            >
              <Reveal direction={i % 2 === 0 ? "left" : "right"}>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="relative aspect-[5/2.8] w-full overflow-hidden rounded-[15px]"
                >
                  {step.image_url && (
                    <Image
                      src={step.image_url}
                      alt={step.title}
                      fill
                      sizes="(min-width: 1024px) 560px, 100vw"
                      className="object-cover"
                    />
                  )}
                </motion.div>
              </Reveal>
              <Reveal direction={i % 2 === 0 ? "right" : "left"} delay={0.1}>
                <h3 className="text-2xl font-semibold text-navy">{step.title}</h3>
                <p className="mt-3 text-base leading-relaxed text-navy/80">{step.description}</p>
              </Reveal>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
