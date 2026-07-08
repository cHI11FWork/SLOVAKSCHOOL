import { DotScatter } from "@/components/icons/decorative";
import type { TestimonialRow, TestimonialsIntroContent } from "@/lib/types";

export function Testimonials({
  intro,
  testimonials,
}: {
  intro: TestimonialsIntroContent;
  testimonials: TestimonialRow[];
}) {
  return (
    <section id="testimonials" className="relative overflow-hidden bg-pink-light py-20">
      <DotScatter className="absolute -left-6 top-8 w-40" />

      <div className="container-page relative">
        <h2 className="text-[28px] font-extrabold text-navy sm:text-[36px]">
          {intro.title}
        </h2>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          {testimonials.map((t) => (
            <div key={t.id} className="rounded-[15px] bg-white p-8">
              <p className="text-base leading-relaxed text-navy/80">{t.quote}</p>
              <p className="mt-6 text-lg font-bold text-navy">{t.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
