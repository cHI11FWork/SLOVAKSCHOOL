import Link from "next/link";
import { Users, Clock, CheckCircle2, Inbox } from "lucide-react";
import { getLeadStats } from "@/lib/admin-data";
import { Badge } from "@/components/ui/badge";

const STATUS_LABEL = { new: "Новий", in_progress: "В обробці", done: "Оброблено" } as const;

export default async function DashboardPage() {
  const stats = await getLeadStats();

  const cards = [
    { label: "Всього заявок", value: stats.total, icon: Inbox, tone: "text-navy" },
    { label: "Нові", value: stats.new, icon: Users, tone: "text-pink" },
    { label: "В обробці", value: stats.inProgress, icon: Clock, tone: "text-amber-600" },
    { label: "Оброблено", value: stats.done, icon: CheckCircle2, tone: "text-emerald-600" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-navy">Дашборд</h1>
      <p className="mt-1 text-sm text-navy/60">Огляд заявок з лендингу VipStudy.</p>

      <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {cards.map((c) => (
          <div key={c.label} className="rounded-2xl border border-gray-100 bg-white p-5">
            <c.icon className={`h-5 w-5 ${c.tone}`} />
            <p className="mt-3 text-2xl font-bold text-navy">{c.value}</p>
            <p className="text-sm text-navy/60">{c.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 rounded-2xl border border-gray-100 bg-white p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-navy">Останні заявки</h2>
          <Link href="/admin/leads" className="text-sm font-medium text-pink hover:underline">
            Всі заявки →
          </Link>
        </div>

        <div className="mt-4 divide-y divide-gray-100">
          {stats.recent.length === 0 && (
            <p className="py-6 text-sm text-navy/50">Заявок ще немає.</p>
          )}
          {stats.recent.map((lead) => (
            <div key={lead.id} className="flex items-center justify-between py-3">
              <div>
                <p className="font-medium text-navy">{lead.name}</p>
                <p className="text-sm text-navy/60">{lead.phone}</p>
              </div>
              <Badge variant={lead.status}>{STATUS_LABEL[lead.status]}</Badge>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
