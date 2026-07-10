import { cookies } from "next/headers";
import { getLandingData } from "@/lib/content";
import { DEFAULT_LANG, LANG_COOKIE, isLang } from "@/lib/i18n";
import { DEFAULT_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/seo";
import { Header } from "@/components/sections/header";
import { Hero } from "@/components/sections/hero";
import { WhyUs } from "@/components/sections/why-us";
import { Steps } from "@/components/sections/steps";
import { CostSection } from "@/components/sections/cost-section";
import { TopReasons } from "@/components/sections/top-reasons";
import { Testimonials } from "@/components/sections/testimonials";
import { LeadForm } from "@/components/sections/lead-form";
import { Footer } from "@/components/sections/footer";
import { Reveal } from "@/components/motion/reveal";

export const revalidate = 60;

export default async function Home() {
  const cookieStore = await cookies();
  const rawLang = cookieStore.get(LANG_COOKIE)?.value;
  const lang = isLang(rawLang) ? rawLang : DEFAULT_LANG;

  const data = await getLandingData(lang);
  const isVisible = (key: string) => data.sectionVisibility[key] !== false;

  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/logo.svg`,
    description: DEFAULT_DESCRIPTION,
    areaServed: "UA",
  };

  return (
    <div className="flex min-h-full flex-col bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationJsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <Header content={data.header} lang={lang} />

      <main className="flex-1">
        {isVisible("hero") && <Hero content={data.hero} />}
        {isVisible("why_us") && data.benefits.length > 0 && (
          <WhyUs content={data.whyUs} benefits={data.benefits} />
        )}
        {isVisible("steps_intro") && data.steps.length > 0 && (
          <Steps intro={data.stepsIntro} steps={data.steps} />
        )}
        {isVisible("cost") && data.costItems.length > 0 && (
          <CostSection content={data.cost} items={data.costItems} />
        )}
        {isVisible("top_reasons_intro") && data.topReasons.length > 0 && (
          <TopReasons intro={data.topReasonsIntro} reasons={data.topReasons} />
        )}
        {isVisible("testimonials_intro") && data.testimonials.length > 0 && (
          <Testimonials intro={data.testimonialsIntro} testimonials={data.testimonials} />
        )}
        {isVisible("feedback_form") && (
          <section id="contact" className="bg-[#fafafb] py-16 min-[900px]:py-24">
            <Reveal className="mx-auto flex max-w-[720px] flex-col items-center gap-8 px-5 text-center min-[900px]:px-8">
              <h2 className="font-display text-[34px] font-normal leading-[1.2] tracking-[-0.5px] text-[#1e2156] min-[640px]:text-[52px] min-[640px]:tracking-[-0.8px]">
                {data.contact.title_main} <span className="not-italic">{data.contact.title_emphasis}</span>
              </h2>
              <p className="max-w-[480px] text-[17px] leading-relaxed text-[#777b86]">
                {data.contact.paragraph}
              </p>
              <LeadForm
                source="feedback_form"
                buttonText={data.contact.submit_label}
                thankYou={data.thankYou}
                lang={lang}
              />
              <div className="text-sm text-[#979799]">{data.contact.footnote}</div>
            </Reveal>
          </section>
        )}
      </main>

      <Footer content={data.footer} />
    </div>
  );
}
