import { createClient } from "@/lib/supabase/server";
import type {
  BenefitRow,
  CostItemRow,
  LandingData,
  SocialLinkRow,
  StepRow,
  TestimonialRow,
  TopReasonRow,
} from "@/lib/types";

const FALLBACK: LandingData = {
  header: {
    nav: [
      { label: "Чому Словаччина?", href: "#why-us" },
      { label: "Співпраця", href: "#steps" },
      { label: "Вартість", href: "#cost" },
      { label: "Відгуки", href: "#testimonials" },
    ],
  },
  hero: {
    headline: "СТАНЬ СТУДЕНТОМ СЛОВАЦЬКОГО УНІВЕРСИТЕТУ",
    bullets: [
      "Безкоштовна освіта",
      "Результати ЗНО до уваги не беруться",
      "Сучасні методи навчання",
      "Гуртожитки поруч з навчальним корпусом",
    ],
    image: "/images/hero.webp",
    form_title: "Залиште свої контакти",
    form_subtitle: "Наші співробітники зв'яжуться з вами і дадуть відповідь на всі питання",
    form_button: "Надіслати",
  },
  whyUs: {
    title: "Чому варто поступати у Словаччину?",
    tag: "НАСКІЛЬКИ СКЛАДНО ОТРИМАТИ ВИЩУ ОСВІТУ В СЛОВАЧЧИНІ ДЛЯ УКРАЇНЦІВ?",
    paragraph:
      "Якщо підходити до питання вступу професійно, то ніяких особливих труднощів не виникає. Навпаки, навчання в Словаччині, організована за допомогою фахівців нашої компанії «West Study», є цілком доступною і має важливі переваги, серед яких:",
    image: "/images/why-us.webp",
  },
  benefitsBand: {
    title: "5 причин обрати Словаччину для навчання",
    form_title: "Отримайте онлайн консультацію",
    form_subtitle:
      "Наш фахівець безкоштовно відповість на всі ваші питання про навчання у Словаччині. Залишайте заявку і отримайте у подарунок «ЩОСЬ»",
    form_button: "Зв'язатись",
  },
  benefits: [],
  stepsIntro: { title: "Етапи співпраці" },
  steps: [],
  cost: {
    title: "Вартість навчання у Словаччині",
    paragraph_1:
      "Сьогодні навчання в Словаччині для українців, вартість якого цілком прийнятна в порівнянні з іншими європейськими країнами, є доступним і вигідним варіантом отримання вищої освіти високого рівня!",
    paragraph_2:
      "Отримати безкоштовну вищу освіту в Словаччині можна в різних ВУЗах, на факультетах медицини, економіки, інформаційних технологій. Також популярними є військові, поліцейські, духовні академії.",
  },
  costItems: [],
  topReasonsIntro: { title: "ТОП 5 причин чому обирають VipStudy" },
  topReasons: [],
  testimonialsIntro: { title: "Відгуки" },
  testimonials: [],
  feedbackForm: {
    form_title: "Форма зворотного зв'язку",
    form_subtitle:
      "Наш фахівець безкоштовно відповість на всі ваші питання про навчання у Словаччині. Залишайте заявку і отримайте у подарунок «ЩОСЬ»",
    form_button: "Зв'язатись",
  },
  thankYou: {
    title: "Дякуємо!",
    message: "Наш менеджер зв'яжеться з Вами протягом 20 хвилин.",
    button: "На головну",
  },
  footer: {
    nav: [
      { label: "Чому Словаччина?", href: "#why-us" },
      { label: "Співпраця", href: "#steps" },
      { label: "Вартість", href: "#cost" },
      { label: "Відгуки", href: "#testimonials" },
    ],
  },
  socialLinks: [],
  sectionVisibility: {},
};

/** Fetches every content table in parallel and assembles the shape the landing page needs. Falls back to the design defaults if Supabase isn't reachable/seeded yet. */
export async function getLandingData(): Promise<LandingData> {
  try {
    const supabase = await createClient();

    const [sections, benefits, steps, costItems, topReasons, testimonials, socialLinks] =
      await Promise.all([
        supabase.from("site_sections").select("*"),
        supabase.from("benefits").select("*").eq("visible", true).order("position"),
        supabase.from("steps").select("*").eq("visible", true).order("position"),
        supabase.from("cost_items").select("*").eq("visible", true).order("position"),
        supabase.from("top_reasons").select("*").eq("visible", true).order("position"),
        supabase.from("testimonials").select("*").eq("visible", true).order("position"),
        supabase.from("social_links").select("*").eq("visible", true).order("position"),
      ]);

    if (sections.error) throw sections.error;

    const sectionByKey = new Map(sections.data?.map((s) => [s.key, s]));
    const visibility: Record<string, boolean> = {};
    for (const s of sections.data ?? []) visibility[s.key] = s.visible;

    const pick = <T,>(key: string, fallback: T): T =>
      (sectionByKey.get(key)?.content as T | undefined) ?? fallback;

    return {
      header: pick("header", FALLBACK.header),
      hero: pick("hero", FALLBACK.hero),
      whyUs: pick("why_us", FALLBACK.whyUs),
      benefitsBand: pick("benefits_band", FALLBACK.benefitsBand),
      benefits: (benefits.data as BenefitRow[] | null) ?? FALLBACK.benefits,
      stepsIntro: pick("steps_intro", FALLBACK.stepsIntro),
      steps: (steps.data as StepRow[] | null) ?? FALLBACK.steps,
      cost: pick("cost", FALLBACK.cost),
      costItems: (costItems.data as CostItemRow[] | null) ?? FALLBACK.costItems,
      topReasonsIntro: pick("top_reasons_intro", FALLBACK.topReasonsIntro),
      topReasons: (topReasons.data as TopReasonRow[] | null) ?? FALLBACK.topReasons,
      testimonialsIntro: pick("testimonials_intro", FALLBACK.testimonialsIntro),
      testimonials: (testimonials.data as TestimonialRow[] | null) ?? FALLBACK.testimonials,
      feedbackForm: pick("feedback_form", FALLBACK.feedbackForm),
      thankYou: pick("thank_you", FALLBACK.thankYou),
      footer: pick("footer", FALLBACK.footer),
      socialLinks: (socialLinks.data as SocialLinkRow[] | null) ?? FALLBACK.socialLinks,
      sectionVisibility: visibility,
    };
  } catch {
    return FALLBACK;
  }
}
