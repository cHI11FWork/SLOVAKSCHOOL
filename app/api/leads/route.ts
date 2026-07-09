import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { leadSchema } from "@/lib/validations";
import { sendLeadTelegramNotification } from "@/lib/telegram";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = leadSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_input" }, { status: 400 });
  }

  // honeypot: real users never fill this hidden field in
  if (parsed.data.company) {
    return NextResponse.json({ ok: true });
  }

  const supabase = await createClient();
  const { error } = await supabase.from("leads").insert({
    name: parsed.data.name,
    phone: parsed.data.phone,
    source: parsed.data.source,
  });

  if (error) {
    return NextResponse.json({ error: "insert_failed" }, { status: 500 });
  }

  await sendLeadTelegramNotification({
    name: parsed.data.name,
    phone: parsed.data.phone,
    source: parsed.data.source,
  });

  return NextResponse.json({ ok: true });
}
