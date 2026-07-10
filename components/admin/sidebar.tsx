"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  Sparkles,
  ListChecks,
  Route as RouteIcon,
  Wallet,
  Trophy,
  MessageSquareQuote,
  Send,
  Share2,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { LogoMark } from "@/components/icons/logo-mark";
import { NotificationBell } from "@/components/admin/notification-bell";
import { signOutAction } from "@/app/admin/actions";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/admin", label: "Дашборд", icon: LayoutDashboard },
  { href: "/admin/leads", label: "Заявки", icon: Users },
  { href: "/admin/content/hero", label: "Головний екран", icon: Sparkles },
  { href: "/admin/content/why_us", label: "Чому Словаччина", icon: RouteIcon },
  { href: "/admin/content-list/benefits", label: "5 причин", icon: ListChecks },
  { href: "/admin/content-list/steps", label: "Етапи співпраці", icon: RouteIcon },
  { href: "/admin/content-list/cost_items", label: "Вартість навчання", icon: Wallet },
  { href: "/admin/content-list/top_reasons", label: "Топ 5 причин", icon: Trophy },
  { href: "/admin/content-list/testimonials", label: "Відгуки", icon: MessageSquareQuote },
  { href: "/admin/content/feedback_form", label: "Форма зв'язку", icon: Send },
  { href: "/admin/content-list/social_links", label: "Соцмережі", icon: Share2 },
];

const DESKTOP_QUERY = "(min-width: 1024px)";

function subscribeIsDesktop(callback: () => void) {
  const mq = window.matchMedia(DESKTOP_QUERY);
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}

function getIsDesktopSnapshot() {
  return window.matchMedia(DESKTOP_QUERY).matches;
}

function getIsDesktopServerSnapshot() {
  return false;
}

function SidebarNav({ email, onNavigate }: { email: string | undefined; onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <>
      <nav className="flex-1 space-y-1 overflow-y-auto px-3">
        {NAV.map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className="relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-navy/70 transition-colors hover:text-navy"
            >
              {active && (
                <motion.span
                  layoutId="admin-nav-active"
                  className="absolute inset-0 rounded-lg bg-pink-light"
                  transition={{ type: "spring", duration: 0.4, bounce: 0.2 }}
                />
              )}
              <Icon className={cn("relative z-10 h-4 w-4", active && "text-pink")} />
              <span className={cn("relative z-10", active && "text-navy")}>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-gray-100 p-4">
        <p className="truncate px-2 text-xs text-navy/50">{email}</p>
        <form action={signOutAction}>
          <button className="mt-2 flex w-full items-center gap-2 rounded-lg px-2 py-2 text-sm text-navy/70 transition-colors hover:bg-pink-light hover:text-navy">
            <LogOut className="h-4 w-4" />
            Вийти
          </button>
        </form>
      </div>
    </>
  );
}

export function Sidebar({
  email,
  newLeadsCount = 0,
}: {
  email: string | undefined;
  newLeadsCount?: number;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [prevPathname, setPrevPathname] = useState(pathname);
  const isDesktop = useSyncExternalStore(subscribeIsDesktop, getIsDesktopSnapshot, getIsDesktopServerSnapshot);

  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setOpen(false);
  }

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      {/* Mobile topbar */}
      <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center justify-between border-b border-gray-100 bg-white/90 px-4 backdrop-blur-md lg:hidden">
        <LogoMark className="w-14" />
        <div className="flex items-center gap-2">
          {!isDesktop && <NotificationBell initialCount={newLeadsCount} />}
          <button
            type="button"
            aria-label={open ? "Закрити меню" : "Відкрити меню"}
            onClick={() => setOpen((v) => !v)}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-100 text-navy transition-colors hover:bg-pink-light"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-40 bg-navy/40 backdrop-blur-sm lg:hidden"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", duration: 0.4, bounce: 0.15 }}
              className="fixed inset-y-0 left-0 z-50 flex w-[280px] max-w-[80vw] flex-col bg-white shadow-2xl lg:hidden"
            >
              <div className="flex h-16 items-center justify-between px-6">
                <LogoMark className="w-14" />
                <button
                  type="button"
                  aria-label="Закрити меню"
                  onClick={() => setOpen(false)}
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-navy/60 hover:bg-pink-light"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <SidebarNav email={email} onNavigate={() => setOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Desktop sidebar */}
      <aside className="hidden h-full w-[264px] shrink-0 flex-col border-r border-gray-100 bg-white lg:flex">
        <div className="flex h-20 items-center justify-between px-6">
          <LogoMark className="w-16" />
          {isDesktop && <NotificationBell initialCount={newLeadsCount} />}
        </div>
        <SidebarNav email={email} />
      </aside>
    </>
  );
}
