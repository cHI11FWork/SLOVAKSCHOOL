import Link from "next/link";
import { Users, Clock, CheckCircle2, Inbox } from "lucide-react";
import { getLeadStats } from "@/lib/admin-data";
import { RevealGroup, revealItem, Reveal } from "@/components/motion/reveal";
import { StatCard } from "@/components/admin/stat-card";
import { RecentLeadsList } from "@/components/admin/recent-leads-list";

export default async function DashboardPage() {
  const stats = await getLeadStats();

  const cards = [
    { label: "Всього заявок", value: stats.total, icon: <Inbox className="h-5 w-5 text-navy" /> },
    { label: "Нові", value: stats.new, icon: <Users className="h-5 w-5 text-pink" /> },
    { label: "В обробці", value: stats.inProgress, icon: <Clock className="h-5 w-5 text-amber-600" /> },
    { label: "Оброблено", value: stats.done, icon: <CheckCircle2 className="h-5 w-5 text-emerald-600" /> },
  ];

  return (
    <div>
      <Reveal>
        <h1 className="text-2xl font-bold text-navy">Дашборд</h1>
        <p className="mt-1 text-sm text-navy/60">Огляд заявок з лендингу VipStudy.</p>
      </Reveal>

      <RevealGroup className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4" stagger={0.08}>
        {cards.map((c) => (
          <StatCard key={c.label} {...c} variants={revealItem} />
        ))}
      </RevealGroup>

      <Reveal delay={0.15} className="mt-10 rounded-2xl border border-gray-100 bg-white p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-navy">Останні заявки</h2>
          <Link href="/admin/leads" className="text-sm font-medium text-pink transition-colors hover:underline">
            Всі заявки →
          </Link>
        </div>

        <div className="mt-4">
          <RecentLeadsList leads={stats.recent} />
        </div>
      </Reveal>
    </div>
  );
}
