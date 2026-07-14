import type { Metadata } from "next";
import { Manrope, Montserrat } from "next/font/google";
import Script from "next/script";

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
      {/* Meta Pixel Code */}
      <Script id="meta-pixel-webinar" strategy="afterInteractive">
        {`
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '1010501235024835');
          fbq('track', 'PageView');
        `}
      </Script>
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          src="https://www.facebook.com/tr?id=1010501235024835&ev=PageView&noscript=1"
          alt=""
        />
      </noscript>
      {/* End Meta Pixel Code */}
      {children}
    </div>
  );
}
