import { getLandingData } from "@/lib/content";
import { Header } from "@/components/sections/header";
import { Hero } from "@/components/sections/hero";
import { WhyUs } from "@/components/sections/why-us";
import { BenefitsBand } from "@/components/sections/benefits-band";
import { Steps } from "@/components/sections/steps";
import { CostSection } from "@/components/sections/cost-section";
import { TopReasons } from "@/components/sections/top-reasons";
import { Testimonials } from "@/components/sections/testimonials";
import { LeadForm } from "@/components/sections/lead-form";
import { Footer } from "@/components/sections/footer";
import { Reveal } from "@/components/motion/reveal";

export const revalidate = 60;

export default async function Home() {
  const data = await getLandingData();
  const isVisible = (key: string) => data.sectionVisibility[key] !== false;

  return (
    <div className="flex min-h-full flex-col">
      <Header content={data.header} />

      <main className="flex-1">
        {isVisible("hero") && <Hero content={data.hero} thankYou={data.thankYou} />}
        {isVisible("why_us") && data.whyUs && <WhyUs content={data.whyUs} />}
        {isVisible("benefits_band") && data.benefits.length > 0 && (
          <BenefitsBand content={data.benefitsBand} benefits={data.benefits} thankYou={data.thankYou} />
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
          <section className="container-page py-20">
            <Reveal className="mx-auto max-w-2xl">
              <LeadForm
                title={data.feedbackForm.form_title}
                subtitle={data.feedbackForm.form_subtitle}
                buttonText={data.feedbackForm.form_button}
                source="feedback_form"
                thankYou={data.thankYou}
                decorated
              />
            </Reveal>
          </section>
        )}
      </main>

      <Footer content={data.footer} socialLinks={data.socialLinks} />
    </div>
  );
}
