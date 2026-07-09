"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TelegramIcon } from "@/components/icons/social-icons";
import type { SocialLinkRow } from "@/lib/types";

export function FloatingContact({ socialLinks }: { socialLinks: SocialLinkRow[] }) {
  const [open, setOpen] = useState(false);
  const link = socialLinks.find((l) => l.platform === "telegram") ?? socialLinks[0];
  if (!link) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      <AnimatePresence>
        {open && (
          <motion.a
            href={link.url}
            target="_blank"
            rel="noreferrer"
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-navy shadow-[0_12px_32px_-8px_rgba(23,25,28,0.35)]"
          >
            Напишіть нам — ми завжди на звязку
          </motion.a>
        )}
      </AnimatePresence>

      <motion.a
        href={link.url}
        target="_blank"
        rel="noreferrer"
        aria-label="Звязатись з нами"
        onHoverStart={() => setOpen(true)}
        onHoverEnd={() => setOpen(false)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        className="relative flex h-16 w-16 items-center justify-center rounded-full bg-pink text-white shadow-[0_12px_32px_-6px_rgba(93,42,26,0.55)]"
      >
        <motion.span
          animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 rounded-full bg-pink"
        />
        <TelegramIcon className="relative h-7 w-7" />
      </motion.a>
    </div>
  );
}
