"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { LogoMark } from "@/components/icons/logo-mark";
import { LeadForm } from "@/components/sections/lead-form";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import type { HeaderContent, ThankYouContent } from "@/lib/types";

export function Header({
  content,
  formTitle,
  formSubtitle,
  formButton,
  thankYou,
}: {
  content: HeaderContent;
  formTitle: string;
  formSubtitle: string;
  formButton: string;
  thankYou: ThankYouContent;
}) {
  const [open, setOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-30 transition-[background-color,box-shadow,backdrop-filter] duration-300",
        scrolled ? "bg-white/80 shadow-[0_4px_24px_-8px_rgba(23,25,28,0.15)] backdrop-blur-md" : "bg-transparent"
      )}
    >
      <div className="container-page flex h-24 items-center justify-between lg:h-28">
        <a href="#top" className="shrink-0">
          <LogoMark />
        </a>

        <nav className="hidden items-center gap-9 lg:flex">
          {content.nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="group relative py-1 text-[15px] font-medium text-navy transition-colors hover:text-pink"
            >
              {item.label}
              <span className="absolute inset-x-0 -bottom-0.5 h-[2px] origin-left scale-x-0 bg-pink transition-transform duration-300 ease-out group-hover:scale-x-100" />
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-4">
          <Dialog open={contactOpen} onOpenChange={setContactOpen}>
            <DialogTrigger asChild>
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                className="relative flex h-10 items-center justify-center overflow-hidden rounded-full bg-pink px-4 text-sm font-semibold text-white shadow-[0_8px_20px_-6px_rgba(93,42,26,0.55)] sm:px-6"
              >
                <motion.span
                  animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute inset-0 rounded-full bg-pink"
                />
                <span className="relative">Зв&apos;язатись</span>
              </motion.button>
            </DialogTrigger>
            <DialogContent>
              <LeadForm
                title={formTitle}
                subtitle={formSubtitle}
                buttonText={formButton}
                source="consultation_form"
                thankYou={thankYou}
                card={false}
              />
            </DialogContent>
          </Dialog>

          <button
            className="flex h-10 w-10 items-center justify-center rounded-full text-navy lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Меню"
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden bg-white shadow-lg lg:hidden"
          >
            <div className="container-page flex flex-col gap-4 py-6">
              {content.nav.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="text-base font-medium text-navy"
                >
                  {item.label}
                </a>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
