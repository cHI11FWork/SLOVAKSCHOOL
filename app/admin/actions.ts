"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { ListTableName, SectionKey } from "@/lib/admin-tables";
import type { LeadStatus } from "@/lib/types";
import { adminLeadSchema, type AdminLeadInput } from "@/lib/validations";

async function requireAuth() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");
  return user;
}

function refreshAll() {
  revalidatePath("/");
  revalidatePath("/webinar");
  revalidatePath("/admin", "layout");
}

export async function signOutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

export async function createItem(table: ListTableName, data: Record<string, unknown>) {
  await requireAuth();
  const admin = createAdminClient();
  const { count } = await admin.from(table).select("id", { count: "exact", head: true });
  const { data: inserted, error } = await admin
    .from(table)
    .insert({ ...data, position: (count ?? 0) + 1 })
    .select()
    .single();
  if (error) throw new Error(error.message);
  refreshAll();
  return inserted as Record<string, unknown> & { id: string };
}

export async function updateItem(table: ListTableName, id: string, data: Record<string, unknown>) {
  await requireAuth();
  const admin = createAdminClient();
  const { error } = await admin.from(table).update(data).eq("id", id);
  if (error) throw new Error(error.message);
  refreshAll();
}

export async function deleteItem(table: ListTableName, id: string) {
  await requireAuth();
  const admin = createAdminClient();
  const { error } = await admin.from(table).delete().eq("id", id);
  if (error) throw new Error(error.message);
  refreshAll();
}

export async function toggleItemVisible(table: ListTableName, id: string, visible: boolean) {
  await requireAuth();
  const admin = createAdminClient();
  const { error } = await admin.from(table).update({ visible }).eq("id", id);
  if (error) throw new Error(error.message);
  refreshAll();
}

export async function reorderItems(table: ListTableName, orderedIds: string[]) {
  await requireAuth();
  const admin = createAdminClient();
  await Promise.all(
    orderedIds.map((id, i) => admin.from(table).update({ position: i + 1 }).eq("id", id))
  );
  refreshAll();
}

export async function updateSection(
  key: SectionKey,
  content: Record<string, unknown>,
  visible: boolean
) {
  await requireAuth();
  const admin = createAdminClient();
  const { error } = await admin
    .from("site_sections")
    .update({ content, visible, updated_at: new Date().toISOString() })
    .eq("key", key);
  if (error) throw new Error(error.message);
  refreshAll();
}

export async function updateLeadStatus(id: string, status: LeadStatus) {
  await requireAuth();
  const admin = createAdminClient();
  const { error } = await admin.from("leads").update({ status }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/leads");
  revalidatePath("/admin");
}

export async function deleteLead(id: string) {
  await requireAuth();
  const admin = createAdminClient();
  const { error } = await admin.from("leads").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/leads");
  revalidatePath("/admin");
}

export async function createLead(input: AdminLeadInput) {
  await requireAuth();
  const parsed = adminLeadSchema.parse(input);
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("leads")
    .insert({
      name: parsed.name,
      phone: parsed.phone,
      grade: parsed.grade,
      source: parsed.source,
      status: parsed.status,
      notes: parsed.notes || null,
    })
    .select()
    .single();
  if (error) throw new Error(error.message);
  revalidatePath("/admin/leads");
  revalidatePath("/admin");
  return data;
}

export async function updateLead(id: string, input: AdminLeadInput) {
  await requireAuth();
  const parsed = adminLeadSchema.parse(input);
  const admin = createAdminClient();
  const { error } = await admin
    .from("leads")
    .update({
      name: parsed.name,
      phone: parsed.phone,
      grade: parsed.grade,
      source: parsed.source,
      status: parsed.status,
      notes: parsed.notes || null,
    })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/leads");
  revalidatePath("/admin");
}

export async function uploadImage(formData: FormData): Promise<{ url: string }> {
  await requireAuth();
  const file = formData.get("file") as File | null;
  if (!file) throw new Error("no_file");

  const admin = createAdminClient();
  const ext = file.name.split(".").pop() ?? "jpg";
  const path = `uploads/${crypto.randomUUID()}.${ext}`;

  const { error } = await admin.storage.from("site-media").upload(path, file, {
    contentType: file.type,
    upsert: false,
  });
  if (error) throw new Error(error.message);

  const { data } = admin.storage.from("site-media").getPublicUrl(path);
  return { url: data.publicUrl };
}
