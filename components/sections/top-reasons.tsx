import { Reveal } from "@/components/motion/reveal";
import type { TopReasonItem, TopReasonsIntroContent } from "@/lib/types";

export function TopReasons({
  intro,
  reasons,
}: {
  intro: TopReasonsIntroContent;
  reasons: TopReasonItem[];
}) {
  return (
    <section className="mx-auto max-w-[1200px] px-5 py-16 min-[900px]:px-8 min-[900px]:py-24">
      <Reveal
        className="grid grid-cols-1 gap-10 rounded-3xl bg-[#fbe1d1] p-6 min-[640px]:p-16 min-[900px]:grid-cols-[0.8fr_1.2fr] min-[900px]:gap-16"
      >
        <h2 className="font-display text-[36px] font-normal leading-[1.25] tracking-[-0.66px] text-[#5d2a1a]">
          {intro.title_main} <em className="italic">{intro.title_emphasis}</em>
        </h2>
        <div className="flex flex-col">
          {reasons.map((reason) => (
            <div
              key={reason.id}
              className="flex items-baseline gap-5 border-b border-[rgba(93,42,26,0.18)] py-4"
            >
              <span className="font-display min-w-[28px] text-xl text-[#5d2a1a]">{reason.num}</span>
              <span className="text-[17px] leading-relaxed text-[#5d2a1a]">{reason.text}</span>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
