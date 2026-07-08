export type NavItem = { label: string; href: string };

export type HeaderContent = { nav: NavItem[] };
export type FooterContent = { nav: NavItem[] };

export type HeroContent = {
  headline: string;
  bullets: string[];
  image: string;
  form_title: string;
  form_subtitle: string;
  form_button: string;
};

export type WhyUsContent = {
  title: string;
  tag: string;
  paragraph: string;
  image: string;
};

export type BenefitsBandContent = {
  title: string;
  form_title: string;
  form_subtitle: string;
  form_button: string;
};

export type StepsIntroContent = { title: string };

export type CostContent = {
  title: string;
  paragraph_1: string;
  paragraph_2: string;
};

export type TopReasonsIntroContent = { title: string };
export type TestimonialsIntroContent = { title: string };

export type FeedbackFormContent = {
  form_title: string;
  form_subtitle: string;
  form_button: string;
};

export type ThankYouContent = {
  title: string;
  message: string;
  button: string;
};

export type SiteSectionKey =
  | "header"
  | "hero"
  | "why_us"
  | "benefits_band"
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

export type BenefitRow = { id: string; text: string; position: number; visible: boolean };

export type StepRow = {
  id: string;
  title: string;
  description: string;
  image_url: string | null;
  position: number;
  visible: boolean;
};

export type CostItemRow = {
  id: string;
  amount: string;
  label: string;
  position: number;
  visible: boolean;
};

export type TopReasonRow = { id: string; text: string; position: number; visible: boolean };

export type TestimonialRow = {
  id: string;
  name: string;
  quote: string;
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

export type LeadSource = "hero_form" | "consultation_form" | "feedback_form";
export type LeadStatus = "new" | "in_progress" | "done";

export type LeadRow = {
  id: string;
  name: string;
  phone: string;
  source: LeadSource;
  status: LeadStatus;
  created_at: string;
};

export type LandingData = {
  header: HeaderContent;
  hero: HeroContent;
  whyUs: WhyUsContent;
  benefitsBand: BenefitsBandContent;
  benefits: BenefitRow[];
  stepsIntro: StepsIntroContent;
  steps: StepRow[];
  cost: CostContent;
  costItems: CostItemRow[];
  topReasonsIntro: TopReasonsIntroContent;
  topReasons: TopReasonRow[];
  testimonialsIntro: TestimonialsIntroContent;
  testimonials: TestimonialRow[];
  feedbackForm: FeedbackFormContent;
  thankYou: ThankYouContent;
  footer: FooterContent;
  socialLinks: SocialLinkRow[];
  sectionVisibility: Record<string, boolean>;
};
