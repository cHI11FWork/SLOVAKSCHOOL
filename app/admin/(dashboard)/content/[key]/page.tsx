import { notFound } from "next/navigation";
import { getSection } from "@/lib/admin-data";
import { SECTION_FIELDS, SECTION_LABELS, type SectionKey } from "@/lib/admin-tables";
import { SectionForm } from "@/components/admin/section-form";
import { Reveal } from "@/components/motion/reveal";

export default async function SectionPage({ params }: { params: Promise<{ key: string }> }) {
  const { key } = await params;

  if (!(key in SECTION_FIELDS)) notFound();
  const sectionKey = key as SectionKey;

  const section = await getSection(sectionKey);

  return (
    <div>
      <Reveal>
        <h1 className="text-2xl font-bold text-navy">{SECTION_LABELS[sectionKey]}</h1>
        <p className="mt-1 text-sm text-navy/60">Редагування контенту цієї секції лендингу.</p>
      </Reveal>

      <Reveal delay={0.1} className="mt-6">
        <SectionForm
          sectionKey={sectionKey}
          fields={SECTION_FIELDS[sectionKey]}
          initialContent={(section?.content as Record<string, unknown>) ?? {}}
          initialVisible={section?.visible ?? true}
        />
      </Reveal>
    </div>
  );
}
