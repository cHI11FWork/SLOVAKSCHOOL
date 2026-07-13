import type { Metadata } from "next";
import { Manrope, Montserrat } from "next/font/google";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700", "800"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin", "cyrillic"],
  weight: ["700", "800"],
});

export const metadata: Metadata = {
  title: "Безкоштовний вебінар від VipStudy",
  description:
    "Онлайн-вебінар: як гарантовано вступити на бюджет до державного університету Словаччини — без ЗНО, без мовного підтвердження.",
};

export default function WebinarLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${manrope.variable} ${montserrat.variable} font-[family-name:var(--font-manrope)]`}>
      {children}
    </div>
  );
}
