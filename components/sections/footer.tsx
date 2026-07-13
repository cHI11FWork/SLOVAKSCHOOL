import { LogoMark } from "@/components/icons/logo-mark";
import type { FooterContent } from "@/lib/types";

export function Footer({ content }: { content: FooterContent }) {
  return (
    <footer className="w-full">
      <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-6 px-5 py-10 min-[900px]:px-8 min-[900px]:pb-14 min-[900px]:pt-10">
        <div className="flex items-center">
          <LogoMark className="h-8 w-auto" />
        </div>

        <nav className="flex flex-wrap gap-6 text-[15px]">
          {content.nav.map((item) => (
            <a key={item.href} href={item.href} className="text-[#777b86] transition-colors hover:text-[#1e2156]">
              {item.label}
            </a>
          ))}
        </nav>

        <div className="text-sm text-[#979799]">{content.copyright}</div>
      </div>

      <div className="mx-auto max-w-[1200px] border-t border-[#e5e5ea] px-5 py-5 text-center min-[900px]:px-8">
        <p className="text-sm text-[#979799]">
          Розробили сайт{" "}
          <a
            href="https://steck.top"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-[#1e2156] transition-colors hover:text-[#0f1130]"
          >
            СТЕК.
          </a>
        </p>
      </div>
    </footer>
  );
}
