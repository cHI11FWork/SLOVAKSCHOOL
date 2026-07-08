import Image from "next/image";
import { LeadForm } from "@/components/sections/lead-form";
import type { HeroContent, ThankYouContent } from "@/lib/types";

export function Hero({ content, thankYou }: { content: HeroContent; thankYou: ThankYouContent }) {
  return (
    <section id="top" className="relative overflow-hidden pb-20 pt-40 lg:pt-48">
      <div className="container-page">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="animate-fade-up">
            <h1 className="text-[32px] font-extrabold leading-[1.15] text-navy sm:text-[40px]">
              {content.headline}
            </h1>
            <ul className="mt-8 space-y-3">
              {content.bullets.map((bullet) => (
                <li key={bullet} className="text-lg text-navy/90">
                  {bullet}
                </li>
              ))}
            </ul>
          </div>

          <div className="relative animate-fade-up [animation-delay:150ms]">
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
            </div>
          </div>
        </div>

        <div className="mt-16 lg:mt-24">
          <LeadForm
            title={content.form_title}
            subtitle={content.form_subtitle}
            buttonText={content.form_button}
            source="hero_form"
            thankYou={thankYou}
            decorated
          />
        </div>
      </div>
    </section>
  );
}
