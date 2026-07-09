import { LogoMark } from "@/components/icons/logo-mark";
import { LangSwitcher } from "@/components/lang-switcher";
import type { Lang } from "@/lib/i18n";
import type { HeaderContent } from "@/lib/types";

export function Header({ content, lang }: { content: HeaderContent; lang: Lang }) {
  return (
    <header className="w-full">
      <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-6 px-5 py-4 min-[900px]:px-8 min-[900px]:py-6">
        <a href="#top" className="flex shrink-0 items-center">
          <LogoMark className="h-8 w-auto min-[900px]:h-10" />
        </a>

        <nav className="hidden items-center gap-7 text-base min-[900px]:flex">
          {content.nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-[#17191c] hover:underline"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <LangSwitcher current={lang} />
          <a
            href="#contact"
            className="inline-flex items-center rounded-full bg-[#17191c] px-5 py-2.5 text-base text-white transition-opacity hover:opacity-90"
          >
            {content.cta}
          </a>
        </div>
      </div>
    </header>
  );
}
