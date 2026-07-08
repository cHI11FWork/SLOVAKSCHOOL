import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import type { ListTableName, SectionKey } from "@/lib/admin-tables";
import type { LeadRow, SiteSectionRow } from "@/lib/types";

export async function getLeads(): Promise<LeadRow[]> {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getLeadStats() {
  const leads = await getLeads();
  return {
    total: leads.length,
    new: leads.filter((l) => l.status === "new").length,
    inProgress: leads.filter((l) => l.status === "in_progress").length,
    done: leads.filter((l) => l.status === "done").length,
    recent: leads.slice(0, 5),
  };
}

export async function getListTable<T = Record<string, unknown>>(table: ListTableName): Promise<T[]> {
  const admin = createAdminClient();
  const { data, error } = await admin.from(table).select("*").order("position");
  if (error) throw new Error(error.message);
  return (data as T[]) ?? [];
}

export async function getSection(key: SectionKey): Promise<SiteSectionRow | null> {
  const admin = createAdminClient();
  const { data, error } = await admin.from("site_sections").select("*").eq("key", key).single();
  if (error) return null;
  return data as SiteSectionRow;
}
