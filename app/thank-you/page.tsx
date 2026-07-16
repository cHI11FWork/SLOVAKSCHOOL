import { cookies } from "next/headers";
import Link from "next/link";
import { getLandingData } from "@/lib/content";
import { DEFAULT_LANG, LANG_COOKIE, isLang } from "@/lib/i18n";
import { LogoMark } from "@/components/icons/logo-mark";

export const revalidate = 60;

export default async function ThankYouPage() {
  const cookieStore = await cookies();
  const rawLang = cookieStore.get(LANG_COOKIE)?.value;
  const lang = isLang(rawLang) ? rawLang : DEFAULT_LANG;

  const data = await getLandingData(lang);

  return (
    <div className="flex min-h-full flex-1 flex-col items-center justify-center gap-8 bg-white px-5 py-24 text-center">
      <Link href="/" className="flex items-center">
        <LogoMark className="h-9 w-auto" />
      </Link>
      <div className="w-full max-w-[560px] rounded-2xl bg-[#fde6f4] px-8 py-8 text-[17px] text-[#f41a94]">
        {data.thankYou.message}
      </div>
      <Link
        href="/"
        className="rounded-full bg-[#1e2156] px-6 py-3 text-base text-white transition-opacity hover:opacity-90"
      >
        На головну
      </Link>
    </div>
  );
}
