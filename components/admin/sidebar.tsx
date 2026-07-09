"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
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

export function Sidebar({
  email,
  newLeadsCount = 0,
}: {
  email: string | undefined;
  newLeadsCount?: number;
}) {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-[264px] shrink-0 flex-col border-r border-gray-100 bg-white">
      <div className="flex h-20 items-center justify-between px-6">
        <LogoMark className="w-16" />
        <NotificationBell initialCount={newLeadsCount} />
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3">
        {NAV.map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
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
    </aside>
  );
}
