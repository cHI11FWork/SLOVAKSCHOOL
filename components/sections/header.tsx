"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { LogoMark } from "@/components/icons/logo-mark";
import { LangSwitcher } from "@/components/lang-switcher";
import type { Lang } from "@/lib/i18n";
import type { HeaderContent } from "@/lib/types";

export function Header({ content, lang }: { content: HeaderContent; lang: Lang }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 12);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-[background-color,box-shadow,backdrop-filter] duration-300 ${
        scrolled
          ? "bg-white/80 shadow-[0_1px_0_rgba(30,33,86,0.08),0_8px_24px_-16px_rgba(30,33,86,0.25)] backdrop-blur-md"
          : "bg-white/0"
      }`}
    >
      <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-6 px-5 py-4 min-[900px]:px-8 min-[900px]:py-6">
        <a href="#top" className="flex shrink-0 items-center">
          <LogoMark className="h-8 w-auto min-[900px]:h-10" />
        </a>

        <nav className="hidden items-center gap-7 text-base min-[900px]:flex">
          {content.nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="relative text-[#1e2156] transition-colors after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:w-0 after:bg-[#f41a94] after:transition-all after:duration-300 hover:after:w-full"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3 min-[900px]:gap-4">
          <LangSwitcher current={lang} />
          <a
            href="#contact"
            className="hidden items-center rounded-full bg-[#1e2156] px-5 py-2.5 text-base text-white shadow-[0_8px_20px_-10px_rgba(30,33,86,0.6)] transition-all hover:-translate-y-0.5 hover:shadow-[0_12px_24px_-8px_rgba(30,33,86,0.5)] min-[900px]:inline-flex"
          >
            {content.cta}
          </a>
          <a
            href="#contact"
            className="inline-flex items-center rounded-full bg-[#1e2156] px-4 py-2 text-sm text-white shadow-[0_8px_20px_-10px_rgba(30,33,86,0.6)] transition-transform active:scale-95 min-[900px]:hidden"
          >
            {content.cta}
          </a>
          <button
            type="button"
            aria-label={menuOpen ? "Закрити меню" : "Відкрити меню"}
            onClick={() => setMenuOpen((v) => !v)}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#e6e6e6] text-[#1e2156] transition-colors hover:bg-[#fafafb] min-[900px]:hidden"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden border-t border-[#e6e6e6] bg-white min-[900px]:hidden"
          >
            <div className="flex flex-col gap-1 px-5 py-4">
              {content.nav.map((item, i) => (
                <motion.a
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.25, delay: i * 0.04, ease: [0.16, 1, 0.3, 1] }}
                  className="rounded-xl px-3 py-3 text-base text-[#1e2156] transition-colors hover:bg-[#fafafb]"
                >
                  {item.label}
                </motion.a>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
