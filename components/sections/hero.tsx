import { Reveal } from "@/components/motion/reveal";
import { ParallaxImage } from "@/components/motion/parallax-image";
import type { HeroContent } from "@/lib/types";

export function Hero({ content }: { content: HeroContent }) {
  return (
    <section
      id="top"
      className="mx-auto grid max-w-[1200px] grid-cols-1 items-center gap-10 px-5 pt-8 pb-16 min-[900px]:grid-cols-[1.1fr_0.9fr] min-[900px]:gap-16 min-[900px]:px-8 min-[900px]:pt-16 min-[900px]:pb-24"
    >
      <div className="flex flex-col gap-5">
        <Reveal duration={0.7}>
          <div className="text-sm uppercase tracking-wide text-[#979799]">{content.eyebrow}</div>
        </Reveal>

        <Reveal duration={0.7} delay={0.1}>
          <h1
            className="font-display text-[42px] font-normal leading-[1.15] tracking-[-1px] text-[#1e2156] min-[640px]:text-[72px] min-[640px]:tracking-[-1.8px]"
          >
            {content.title_main} <span className="not-italic">{content.title_emphasis}</span>{" "}
            {content.title_suffix}
          </h1>
        </Reveal>

        <Reveal duration={0.7} delay={0.2}>
          <p className="max-w-[480px] text-lg leading-relaxed text-[#777b86]">{content.paragraph}</p>
        </Reveal>

        <Reveal duration={0.7} delay={0.3}>
          <div className="flex flex-wrap items-center gap-3">
            <a
              href="#contact"
              className="inline-flex items-center rounded-full bg-[#f41a94] px-7 py-3.5 text-base text-white shadow-[0_10px_24px_-10px_rgba(244,26,148,0.55)] transition-all hover:-translate-y-0.5 hover:opacity-90 hover:shadow-[0_16px_32px_-10px_rgba(244,26,148,0.5)] active:translate-y-0 active:scale-[0.98]"
            >
              {content.cta_primary}
            </a>
            <a
              href="#steps"
              className="inline-flex items-center rounded-full border border-[#1e2156] px-[27px] py-[13px] text-base text-[#1e2156] transition-all hover:-translate-y-0.5 hover:bg-[#fafafb] active:translate-y-0 active:scale-[0.98]"
            >
              {content.cta_secondary}
            </a>
          </div>
        </Reveal>

        <Reveal duration={0.7} delay={0.4}>
          <div className="flex flex-wrap gap-6 text-[15px] text-[#777b86]">
            {content.bullets.map((bullet, i) => (
              <span key={bullet} className="flex items-center gap-6">
                {i > 0 && <span aria-hidden="true">·</span>}
                <span>{bullet}</span>
              </span>
            ))}
          </div>
        </Reveal>
      </div>

      <Reveal duration={0.8} delay={0.2} className="relative">
        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl">
          <ParallaxImage
            src={content.image}
            alt=""
            sizes="(min-width: 900px) 480px, 100vw"
            priority
            strength={28}
          />
        </div>

        <div
          className="animate-vs-float-a absolute left-3 top-3 flex flex-col gap-1 rounded-[20px] bg-white p-4 min-[640px]:-left-12 min-[640px]:top-6"
          style={{ boxShadow: "0 0 0 1px rgba(4,23,43,0.05), 0 20px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)" }}
        >
          <div className="text-xl font-medium">{content.stat1_value}</div>
          <div className="text-sm text-[#777b86]">{content.stat1_label}</div>
        </div>

        <div
          className="animate-vs-float-b absolute bottom-3 left-3 flex items-center gap-3 rounded-[20px] bg-white p-4 min-[640px]:bottom-8 min-[640px]:-left-8"
          style={{ boxShadow: "0 0 0 1px rgba(4,23,43,0.05), 0 20px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)" }}
        >
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#fde6f4] text-sm font-medium text-[#f41a94]">
            {content.stat2_badge}
          </span>
          <div className="max-w-[160px] text-sm leading-tight text-[#1e2156]">{content.stat2_text}</div>
        </div>
      </Reveal>
    </section>
  );
}
