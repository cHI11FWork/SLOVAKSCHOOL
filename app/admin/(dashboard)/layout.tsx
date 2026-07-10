import { createClient } from "@/lib/supabase/server";
import { Sidebar } from "@/components/admin/sidebar";
import { getLeadStats } from "@/lib/admin-data";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { new: newLeadsCount } = await getLeadStats();

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <Sidebar email={user?.email} newLeadsCount={newLeadsCount} />
      <main className="flex-1 overflow-x-hidden px-4 py-6 min-[480px]:px-6 min-[480px]:py-8 lg:px-10 lg:py-10">
        <div className="mx-auto max-w-5xl">{children}</div>
      </main>
    </div>
  );
}
