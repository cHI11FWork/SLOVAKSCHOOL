import type { TopReasonRow, TopReasonsIntroContent } from "@/lib/types";

export function TopReasons({
  intro,
  reasons,
}: {
  intro: TopReasonsIntroContent;
  reasons: TopReasonRow[];
}) {
  return (
    <section className="py-20">
      <div className="container-page">
        <h2 className="text-center text-[28px] font-extrabold text-navy sm:text-[36px]">
          {intro.title}
        </h2>

        <div className="relative mx-auto mt-14 max-w-2xl">
          <div className="absolute bottom-6 left-[17px] top-6 w-[2px] bg-pink/40" />
          <ol className="space-y-8">
            {reasons.map((reason, i) => (
              <li key={reason.id} className="relative flex items-start gap-6">
                <span className="relative z-10 flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-full bg-pink font-display text-lg font-semibold text-white">
                  {i + 1}
                </span>
                <div className="flex-1 rounded-lg border-t-4 border-pink-dark bg-white px-6 py-5 shadow-sm">
                  <p className="text-base leading-relaxed text-navy/90">{reason.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
