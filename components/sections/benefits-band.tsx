import { Check } from "lucide-react";
import { LeadForm } from "@/components/sections/lead-form";
import { ChevronPattern } from "@/components/icons/decorative";
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
        <h2 className="text-[28px] font-extrabold text-navy sm:text-[36px]">
          {content.title}
        </h2>

        <div className="mt-10 grid gap-12 lg:grid-cols-2">
          <ul className="space-y-4">
            {benefits.map((b) => (
              <li key={b.id} className="flex items-start gap-3">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-pink text-white">
                  <Check className="h-3.5 w-3.5" strokeWidth={3} />
                </span>
                <span className="text-lg text-navy">{b.text}</span>
              </li>
            ))}
          </ul>

          <ChevronPattern className="hidden lg:grid" rows={4} cols={3} />
        </div>

        <div className="mt-14 max-w-xl">
          <LeadForm
            title={content.form_title}
            subtitle={content.form_subtitle}
            buttonText={content.form_button}
            source="consultation_form"
            thankYou={thankYou}
            align="left"
            card={false}
          />
        </div>
      </div>
    </section>
  );
}
