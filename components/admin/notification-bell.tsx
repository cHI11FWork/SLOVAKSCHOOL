"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Bell } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";

function playChime() {
  try {
    const Ctx = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new Ctx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
    osc.connect(gain).connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.5);
  } catch {
    // audio autoplay may be blocked before the first user interaction — safe to ignore
  }
}

export function NotificationBell({ initialCount }: { initialCount: number }) {
  const [count, setCount] = useState(initialCount);
  const [rung, setRung] = useState(false);

  useEffect(() => {
    const supabase = createClient();

    async function refreshCount() {
      const { count: newCount } = await supabase
        .from("leads")
        .select("id", { count: "exact", head: true })
        .eq("status", "new");
      setCount(newCount ?? 0);
    }

    const channel = supabase
      .channel("admin-leads-notifications")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "leads" },
        (payload) => {
          const lead = payload.new as { name: string };
          setRung(true);
          setTimeout(() => setRung(false), 700);
          playChime();
          toast.success(`Нова заявка: ${lead.name}`, {
            description: "Натисніть, щоб переглянути",
            action: { label: "Заявки", onClick: () => (window.location.href = "/admin/leads") },
          });
          refreshCount();
        }
      )
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "leads" }, refreshCount)
      .on("postgres_changes", { event: "DELETE", schema: "public", table: "leads" }, refreshCount)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <Link
      href="/admin/leads"
      aria-label="Заявки"
      className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors hover:bg-pink-light"
    >
      <motion.span
        animate={rung ? { rotate: [0, -18, 16, -12, 8, 0] } : {}}
        transition={{ duration: 0.6, ease: "easeInOut" }}
      >
        <Bell className="h-5 w-5 text-navy/70" />
      </motion.span>
      {count > 0 && (
        <motion.span
          key={count}
          initial={{ scale: 0.6 }}
          animate={{ scale: 1 }}
          className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-pink px-1 text-[10px] font-bold text-white"
        >
          {count > 9 ? "9+" : count}
        </motion.span>
      )}
    </Link>
  );
}
