"use client";

import { useEffect, useState } from "react";

function formatRemaining(ms: number): string {
  if (ms <= 0) return "вже наживо";
  const totalSeconds = Math.floor(ms / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${days} дн ${pad(hours)} год ${pad(minutes)} хв ${pad(seconds)} сек`;
}

export function WebinarCountdown({ targetIso }: { targetIso: string }) {
  const [text, setText] = useState<string | null>(null);

  useEffect(() => {
    const target = new Date(targetIso).getTime();
    const tick = () => setText(formatRemaining(target - Date.now()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [targetIso]);

  return <>{text ?? "…"}</>;
}
