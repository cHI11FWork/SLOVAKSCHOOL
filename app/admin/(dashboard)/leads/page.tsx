import { getLeads } from "@/lib/admin-data";
import { LeadsTable } from "@/components/admin/leads-table";
import { Reveal } from "@/components/motion/reveal";

export default async function LeadsPage() {
  const leads = await getLeads();

  return (
    <div>
      <Reveal>
        <h1 className="text-2xl font-bold text-navy">Заявки</h1>
        <p className="mt-1 text-sm text-navy/60">Усі ліди з лендингу, з усіх трьох форм.</p>
      </Reveal>

      <Reveal delay={0.1} className="mt-6">
        <LeadsTable leads={leads} />
      </Reveal>
    </div>
  );
}
