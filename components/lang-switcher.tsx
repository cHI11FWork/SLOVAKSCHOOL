"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { LANGS, LANG_COOKIE, type Lang } from "@/lib/i18n";

const LABELS: Record<Lang, string> = { uk: "UA", en: "EN", sk: "SK" };

export function LangSwitcher({ current }: { current: Lang }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function pick(lang: Lang) {
    if (lang === current) return;
    document.cookie = `${LANG_COOKIE}=${lang}; path=/; max-age=31536000`;
    startTransition(() => router.refresh());
  }

  return (
    <div
      className="hidden items-center gap-0.5 rounded-full border border-[#e6e6e6] p-[3px] min-[640px]:flex"
      aria-label="Мова сайту"
    >
      {LANGS.map((lang) => (
        <button
          key={lang}
          type="button"
          onClick={() => pick(lang)}
          disabled={pending}
          className="rounded-full px-3 py-1.5 text-sm transition-colors"
          style={{
            background: current === lang ? "#1e2156" : "transparent",
            color: current === lang ? "#ffffff" : "#777b86",
          }}
        >
          {LABELS[lang]}
        </button>
      ))}
    </div>
  );
}
