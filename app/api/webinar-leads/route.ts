import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { webinarLeadSchema } from "@/lib/validations";
import { sendLeadTelegramNotification } from "@/lib/telegram";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = webinarLeadSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_input" }, { status: 400 });
  }

  // honeypot: real users never fill this hidden field in
  if (parsed.data.company) {
    return NextResponse.json({ ok: true });
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("leads")
    .insert({
      name: parsed.data.name,
      phone: parsed.data.phone,
      source: parsed.data.source,
    })
    .select("lead_number")
    .single();

  if (error) {
    return NextResponse.json({ error: "insert_failed" }, { status: 500 });
  }

  await sendLeadTelegramNotification({
    leadNumber: data.lead_number,
    name: parsed.data.name,
    phone: parsed.data.phone,
    source: parsed.data.source,
  });

  return NextResponse.json({ ok: true });
}
