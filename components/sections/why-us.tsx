import Image from "next/image";
import type { WhyUsContent } from "@/lib/types";

export function WhyUs({ content }: { content: WhyUsContent }) {
  return (
    <section id="why-us" className="py-20">
      <div className="container-page grid items-center gap-12 lg:grid-cols-2">
        <div className="relative aspect-[5/3.5] w-full overflow-hidden rounded-[15px] lg:order-1">
          <Image
            src={content.image}
            alt={content.title}
            fill
            sizes="(min-width: 1024px) 560px, 100vw"
            className="object-cover"
          />
        </div>

        <div className="lg:order-2">
          <h2 className="text-[28px] font-extrabold leading-tight text-navy sm:text-[36px]">
            {content.title}
          </h2>
          <p className="mt-6 text-sm font-semibold uppercase tracking-wide text-pink">{content.tag}</p>
          <p className="mt-4 text-base leading-relaxed text-navy/80">{content.paragraph}</p>
        </div>
      </div>
    </section>
  );
}
