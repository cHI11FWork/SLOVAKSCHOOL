"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DotScatter } from "@/components/icons/decorative";
import { Reveal } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";
import type { TestimonialRow, TestimonialsIntroContent } from "@/lib/types";

function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

const EASE = [0.16, 1, 0.3, 1] as const;

const slideVariants = {
  enter: (dir: number) => ({ opacity: 0, x: dir > 0 ? 60 : -60 }),
  center: { opacity: 1, x: 0 },
  exit: (dir: number) => ({ opacity: 0, x: dir > 0 ? -60 : 60 }),
};

export function Testimonials({
  intro,
  testimonials,
}: {
  intro: TestimonialsIntroContent;
  testimonials: TestimonialRow[];
}) {
  const slides = chunk(testimonials, 2);
  const total = slides.length;
  const [[index, direction], setState] = useState<[number, number]>([0, 1]);

  function go(dir: number) {
    setState(([i]) => [(i + dir + total) % total, dir]);
  }

  useEffect(() => {
    if (total <= 1) return;
    const id = setInterval(() => go(1), 6000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [total, index]);

  return (
    <section id="testimonials" className="relative overflow-hidden bg-pink-light py-20">
      <DotScatter className="absolute -left-6 top-8 w-40" />

      <div className="container-page relative">
        <Reveal>
          <h2 className="text-[28px] font-extrabold text-navy sm:text-[36px]">{intro.title}</h2>
        </Reveal>

        <div className="relative mt-10">
          <div className="relative grid gap-6 overflow-hidden lg:grid-cols-2" style={{ minHeight: 1 }}>
            <AnimatePresence mode="wait" custom={direction} initial={false}>
              <motion.div
                key={index}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.45, ease: EASE }}
                className="grid gap-6 lg:col-span-2 lg:grid-cols-2"
              >
                {slides[index]?.map((t) => (
                  <div key={t.id} className="rounded-[15px] bg-white p-8">
                    <p className="text-base leading-relaxed text-navy/80">{t.quote}</p>
                    <p className="mt-6 text-lg font-bold text-navy">{t.name}</p>
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

          {total > 1 && (
            <div className="mt-8 flex items-center justify-center gap-4">
              <button
                aria-label="Попередній"
                onClick={() => go(-1)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-navy shadow-sm transition-transform hover:scale-105 active:scale-95"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              <div className="flex items-center gap-2">
                {slides.map((_, i) => (
                  <button
                    key={i}
                    aria-label={`Слайд ${i + 1}`}
                    onClick={() => setState([i, i > index ? 1 : -1])}
                    className="relative h-2.5 w-2.5"
                  >
                    <span
                      className={cn(
                        "absolute inset-0 rounded-full transition-colors",
                        i === index ? "bg-pink" : "bg-navy/20"
                      )}
                    />
                    {i === index && (
                      <motion.span
                        layoutId="testimonial-dot"
                        className="absolute -inset-1 rounded-full ring-2 ring-pink/40"
                      />
                    )}
                  </button>
                ))}
              </div>

              <button
                aria-label="Наступний"
                onClick={() => go(1)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-navy shadow-sm transition-transform hover:scale-105 active:scale-95"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
