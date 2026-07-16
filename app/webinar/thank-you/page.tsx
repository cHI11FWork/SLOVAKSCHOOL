import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Дякуємо за реєстрацію — VipStudy",
};

export default function WebinarThankYouPage() {
  return (
    <div className="flex min-h-full flex-col items-center justify-center gap-8 bg-gradient-to-b from-[#FFF7FB] to-[#FCE4F0] px-5 py-16 text-center">
      <Link href="/webinar" className="flex items-center">
        <Image src="/webinar/logo.png" alt="VIPSTUDY" width={96} height={96} className="h-16 w-auto" />
      </Link>
      <div className="w-full max-w-[440px] rounded-[20px] bg-white px-8 pt-14 pb-12 shadow-[0_30px_80px_rgba(0,0,0,0.12)] min-[480px]:px-16">
        <h1 className="mb-[18px] font-[family-name:var(--font-montserrat)] text-[22px] font-extrabold uppercase text-[#23285A]">
          Дякуємо за реєстрацію!
        </h1>
        <p className="mb-3.5 text-[15px] font-bold text-[#23285A]">
          Наш менеджер з Вами зв&rsquo;яжеться протягом дня!
        </p>
        <p className="mb-7 text-sm leading-relaxed text-[#6B6F8C]">
          Також отримайте бонус — доступ до телеграм каналу про безкоштовне навчання в Словаччині
        </p>
        <Link
          href="/webinar"
          className="inline-block rounded-[10px] bg-[#F0158C] px-11 py-[15px] text-[13px] font-bold tracking-[.12em] text-white uppercase shadow-[0_12px_26px_rgba(240,21,140,0.35)] transition-colors hover:bg-[#C11367]"
        >
          На вебінар
        </Link>
      </div>
    </div>
  );
}
