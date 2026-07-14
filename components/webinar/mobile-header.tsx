"use client";

import { useState } from "react";
import Image from "next/image";

export function WebinarMobileHeader({ phones }: { phones: { raw: string; label: string }[] }) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <header className="bg-white shadow-[0_1px_0_rgba(35,40,90,0.06)] min-[821px]:hidden">
      <div className="flex items-center justify-between px-5 py-3 min-[480px]:px-6">
        <a href="#top" className="flex shrink-0 items-center" onClick={close}>
          <Image src="/webinar/logo.png" alt="VIPSTUDY" width={96} height={96} className="h-11 w-auto min-[480px]:h-12" />
        </a>
        <div className="flex items-center gap-2">
          <a
            href={`tel:${phones[0].raw}`}
            aria-label="Подзвонити"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#FDECF4] text-[#E6308A] transition-colors active:bg-[#F8CFE4]"
          >
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.362 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0 1 22 16.92Z" />
            </svg>
          </a>
          <a
            href="#register"
            aria-label="Зареєструватись"
            onClick={close}
            className="flex h-11 shrink-0 items-center rounded-full bg-[#F0158C] px-5 text-[12px] font-bold tracking-[.08em] text-white uppercase shadow-[0_8px_18px_rgba(240,21,140,0.32)] transition-transform active:scale-[0.96]"
          >
            Реєстрація
          </a>
          <button
            type="button"
            aria-label={open ? "Закрити меню" : "Відкрити меню"}
            aria-expanded={open}
            aria-controls="wb-mobile-menu"
            onClick={() => setOpen((v) => !v)}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#F5F2FA] text-[#23285A] transition-colors active:bg-[#E9E4F2]"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              {open ? (
                <path d="M6 6l12 12M18 6 6 18" />
              ) : (
                <>
                  <path d="M4 7h16" />
                  <path d="M4 12h16" />
                  <path d="M4 17h16" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      <div
        id="wb-mobile-menu"
        className={`grid overflow-hidden border-t bg-[#FFF9FC] transition-[grid-template-rows] duration-300 ease-out ${
          open ? "grid-rows-[1fr] border-[#F5E4EC]" : "grid-rows-[0fr] border-transparent"
        }`}
      >
        <div className="min-h-0 overflow-hidden">
          <div className="grid grid-cols-1 gap-1.5 px-5 pt-3 pb-2 min-[360px]:grid-cols-2 min-[480px]:px-6">
            {phones.map((p) => (
              <a
                key={p.raw}
                href={`tel:${p.raw}`}
                onClick={close}
                className="flex min-w-0 items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[13px] font-semibold whitespace-nowrap text-[#E6308A] transition-colors active:bg-[#FDECF4]"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className="shrink-0 opacity-70">
                  <path d="M6.6 10.8c1.4 2.8 3.8 5.2 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.5.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.2.2 2.4.6 3.5.1.4 0 .8-.2 1L6.6 10.8Z" />
                </svg>
                {p.label}
              </a>
            ))}
          </div>

          <nav className="flex items-center gap-2 border-t border-[#F1E0EB] px-5 py-2.5 min-[480px]:px-6">
            <a
              href="#how"
              onClick={close}
              className="flex-1 rounded-full py-2 text-center text-[12.5px] font-bold tracking-[.03em] text-[#23285A] uppercase transition-colors active:bg-white min-[480px]:text-[13px]"
            >
              Як вступити?
            </a>
            <span className="h-4 w-px shrink-0 bg-[#E6E4EF]" aria-hidden />
            <a
              href="#program"
              onClick={close}
              className="flex-1 rounded-full py-2 text-center text-[12.5px] font-bold tracking-[.03em] text-[#23285A] uppercase transition-colors active:bg-white min-[480px]:text-[13px]"
            >
              Програма вебінару
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
}
