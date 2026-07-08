import type { CostContent, CostItemRow } from "@/lib/types";

export function CostSection({ content, items }: { content: CostContent; items: CostItemRow[] }) {
  return (
    <section id="cost" className="py-20">
      <div className="container-page">
        <h2 className="font-display text-[28px] font-extrabold text-navy sm:text-[36px]">
          {content.title}
        </h2>
        <p className="mt-6 max-w-2xl text-base leading-relaxed text-navy/80">{content.paragraph_1}</p>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-navy/80">{content.paragraph_2}</p>

        <div className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex flex-col items-center justify-center rounded-[15px] bg-pink-light px-4 py-8 text-center"
            >
              <span className="font-display text-2xl font-bold text-navy">{item.amount}</span>
              <span className="mt-2 text-sm text-navy/70">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
