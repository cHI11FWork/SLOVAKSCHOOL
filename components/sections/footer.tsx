import { LogoMark } from "@/components/icons/logo-mark";
import { SOCIAL_ICON_BY_PLATFORM } from "@/components/icons/social-icons";
import type { FooterContent, SocialLinkRow } from "@/lib/types";

export function Footer({ content, socialLinks }: { content: FooterContent; socialLinks: SocialLinkRow[] }) {
  return (
    <footer className="bg-black py-10">
      <div className="container-page flex flex-col items-center gap-6 lg:flex-row lg:justify-between">
        <LogoMark />

        <nav className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
          {content.nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-white/90 transition-colors hover:text-pink"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          {socialLinks.map((link) => {
            const Icon = SOCIAL_ICON_BY_PLATFORM[link.platform];
            if (!Icon) return null;
            return (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noreferrer"
                aria-label={link.platform}
                className="text-white/90 transition-colors hover:text-pink"
              >
                <Icon className="h-6 w-6" />
              </a>
            );
          })}
        </div>
      </div>
    </footer>
  );
}
