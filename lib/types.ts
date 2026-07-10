import type { I18nText } from "@/lib/i18n";

export type NavItem = { label: string; href: string };

export type HeaderContent = { nav: NavItem[]; cta: string };
export type FooterContent = { nav: NavItem[]; copyright: string };

export type HeroContent = {
  eyebrow: string;
  title_main: string;
  title_emphasis: string;
  title_suffix: string;
  paragraph: string;
  cta_primary: string;
  cta_secondary: string;
  bullets: string[];
  image: string;
  stat1_value: string;
  stat1_label: string;
  stat2_badge: string;
  stat2_text: string;
};

export type WhyUsContent = {
  title_main: string;
  title_emphasis: string;
  paragraph: string;
  image: string;
};

export type StepsIntroContent = { title: string; paragraph: string };

export type CostContent = { title: string; paragraph: string; note: string };

export type TopReasonsIntroContent = { title_main: string; title_emphasis: string };
export type TestimonialsIntroContent = { title: string };

/** Content for the single contact/lead-capture section (was "feedback_form"). */
export type ContactContent = {
  title_main: string;
  title_emphasis: string;
  paragraph: string;
  submit_label: string;
  footnote: string;
};

export type ThankYouContent = { message: string };

export type SiteSectionKey =
  | "header"
  | "hero"
  | "why_us"
  | "steps_intro"
  | "cost"
  | "top_reasons_intro"
  | "testimonials_intro"
  | "feedback_form"
  | "thank_you"
  | "footer";

export type SiteSectionRow = {
  id: string;
  key: SiteSectionKey;
  content: Record<string, unknown>;
  visible: boolean;
  updated_at: string;
};

/** Raw DB rows — every translatable text column has `_en`/`_sk` siblings (nullable, fall back to the base uk column). */
export type BenefitRow = {
  id: string;
  title: string;
  title_en: string | null;
  title_sk: string | null;
  text: string;
  text_en: string | null;
  text_sk: string | null;
  position: number;
  visible: boolean;
};

export type StepRow = {
  id: string;
  title: string;
  title_en: string | null;
  title_sk: string | null;
  description: string;
  description_en: string | null;
  description_sk: string | null;
  image_url: string | null;
  position: number;
  visible: boolean;
};

export type CostItemRow = {
  id: string;
  amount: string;
  label: string;
  label_en: string | null;
  label_sk: string | null;
  position: number;
  visible: boolean;
};

export type TopReasonRow = {
  id: string;
  text: string;
  text_en: string | null;
  text_sk: string | null;
  position: number;
  visible: boolean;
};

export type TestimonialRow = {
  id: string;
  name: string;
  name_en: string | null;
  name_sk: string | null;
  quote: string;
  quote_en: string | null;
  quote_sk: string | null;
  meta: string | null;
  meta_en: string | null;
  meta_sk: string | null;
  position: number;
  visible: boolean;
};

export type SocialLinkRow = {
  id: string;
  platform: string;
  url: string;
  position: number;
  visible: boolean;
};

/** Language-resolved items handed to the landing-page components (plain strings, current `lang` already picked). */
export type BenefitItem = { id: string; title: string; text: string };
export type StepItem = { id: string; num: string; title: string; text: string };
export type CostItem = { id: string; price: string; label: string };
export type TopReasonItem = { id: string; num: string; text: string };
export type TestimonialItem = { id: string; quote: string; initials: string; name: string; meta: string };

export type LeadSource = "hero_form" | "consultation_form" | "feedback_form";
export type LeadStatus = "new" | "in_progress" | "done";
export type LeadGrade = "8" | "9" | "10" | "11" | "college";

export type LeadRow = {
  id: string;
  lead_number: number;
  name: string;
  phone: string;
  grade: LeadGrade | null;
  source: LeadSource;
  status: LeadStatus;
  notes: string | null;
  created_at: string;
};

export type LandingData = {
  header: HeaderContent;
  hero: HeroContent;
  whyUs: WhyUsContent;
  benefits: BenefitItem[];
  stepsIntro: StepsIntroContent;
  steps: StepItem[];
  cost: CostContent;
  costItems: CostItem[];
  topReasonsIntro: TopReasonsIntroContent;
  topReasons: TopReasonItem[];
  testimonialsIntro: TestimonialsIntroContent;
  testimonials: TestimonialItem[];
  contact: ContactContent;
  thankYou: ThankYouContent;
  footer: FooterContent;
  sectionVisibility: Record<string, boolean>;
};

export type { I18nText };
