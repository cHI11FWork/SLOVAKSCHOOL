import { createClient } from "@/lib/supabase/server";
import { pickLang, pickText, type Lang, type I18nText } from "@/lib/i18n";
import type {
  BenefitItem,
  BenefitRow,
  CostItem,
  CostItemRow,
  LandingData,
  StepItem,
  StepRow,
  TestimonialItem,
  TestimonialRow,
  TopReasonItem,
  TopReasonRow,
} from "@/lib/types";

function toRoman(num: number): string {
  const table: [number, string][] = [
    [1000, "M"], [900, "CM"], [500, "D"], [400, "CD"],
    [100, "C"], [90, "XC"], [50, "L"], [40, "XL"],
    [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"],
  ];
  let n = num;
  let out = "";
  for (const [value, symbol] of table) {
    while (n >= value) {
      out += symbol;
      n -= value;
    }
  }
  return out;
}

function initialsFromName(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

// ---------------------------------------------------------------------------
// Raw, trilingual fallback content — mirrors exactly what's stored in Supabase
// (site_sections.content as { uk, en, sk } per field; list tables as sibling
// `_en`/`_sk` columns). Used only if Supabase is unreachable/unseeded.
// ---------------------------------------------------------------------------

const t = (uk: string, en: string, sk: string): I18nText => ({ uk, en, sk });

const NAV_RAW = [
  { label: t("Чому Словаччина", "Why Slovakia", "Prečo Slovensko"), href: "#why" },
  { label: t("Етапи", "Steps", "Kroky"), href: "#steps" },
  { label: t("Вартість", "Cost", "Cena"), href: "#cost" },
  { label: t("Відгуки", "Reviews", "Recenzie"), href: "#reviews" },
];

const FALLBACK_SECTIONS = {
  header: { nav: NAV_RAW, cta: t("Залишити заявку", "Get in touch", "Nechať žiadosť") },
  hero: {
    eyebrow: t(
      "Вища освіта в Європі · для українців",
      "Higher education in Europe · for Ukrainians",
      "Vysokoškolské vzdelanie v Európe · pre Ukrajincov"
    ),
    title_main: t("Стань студентом", "Become a student at a", "Staň sa študentom"),
    title_emphasis: t("словацького", "Slovak", "slovenskej"),
    title_suffix: t("університету", "university", "univerzity"),
    paragraph: t(
      "Безкоштовне навчання, гуртожиток поруч із корпусом і ВНЖ на весь період. Результати НМТ не враховуються — ми супроводжуємо вступ від консультації до зарахування.",
      "Free tuition, a dormitory right next to campus, and a residence permit for your whole studies. NMT results don't matter — we guide you from consultation to enrollment.",
      "Bezplatné štúdium, internát priamo pri kampuse a povolenie na pobyt na celé štúdium. Výsledky NMT sa neberú do úvahy — sprevádzame ťa od konzultácie až po zápis."
    ),
    cta_primary: t("Отримати консультацію", "Get a consultation", "Získať konzultáciu"),
    cta_secondary: t("Як це працює", "How it works", "Ako to funguje"),
    bullets: [
      t("Безкоштовна освіта", "Free education", "Bezplatné vzdelanie"),
      t("Без результатів НМТ", "No NMT required", "Bez výsledkov NMT"),
      t("Гуртожиток поруч", "Dormitory nearby", "Internát nablízku"),
    ],
    image: "/images/hero.webp",
    stat1_value: "150+",
    stat1_label: t("абітурієнтів цього року", "applicants this year", "uchádzačov tento rok"),
    stat2_badge: "100%",
    stat2_text: t(
      "гарантія вступу при вчасній подачі документів",
      "guarantee of admission with documents submitted on time",
      "záruka prijatia pri včasnom podaní dokumentov"
    ),
  },
  why_us: {
    title_main: t("Безкоштовна вища освіта в", "Free higher education in", "Bezplatné vysokoškolské vzdelanie v"),
    title_emphasis: t("Європі", "Europe", "Európe"),
    paragraph: t(
      "З професійним супроводом вступ не складніший, ніж в Україні. А переваг — суттєво більше.",
      "With professional guidance, admission is no harder than in Ukraine. And the benefits are significantly greater.",
      "S odborným sprevádzaním nie je prijatie náročnejšie ako na Ukrajine. A výhod je oveľa viac."
    ),
    image: "/images/why-us-v2.webp",
  },
  steps_intro: {
    title: t("Шість кроків до зарахування", "Six steps to enrollment", "Šesť krokov k zápisu"),
    paragraph: t(
      "Працюємо офіційно, за договором. Ви завжди знаєте, що відбувається і що далі.",
      "We work officially, under contract. You always know what's happening and what's next.",
      "Pracujeme oficiálne, na základe zmluvy. Vždy vieš, čo sa deje a čo bude ďalej."
    ),
  },
  cost: {
    title: t(
      "Скільки коштує студентське життя у Словаччині?",
      "How much does student life cost in Slovakia?",
      "Koľko stojí študentský život na Slovensku?"
    ),
    paragraph: t(
      "Навчання у державних університетах словацькою мовою — безкоштовне. Основні щомісячні витрати студента становлять лише:",
      "Tuition at state universities in the Slovak language is free. A student's main monthly expenses are just:",
      "Štúdium na štátnych univerzitách v slovenskom jazyku je bezplatné. Hlavné mesačné výdavky študenta sú len:"
    ),
    note: t(
      "💶 У середньому студенту достатньо 200–250 € на місяць для комфортного життя в Словаччині (без урахування особистих покупок та подорожей).",
      "💶 On average, 200–250 € a month is enough for a student to live comfortably in Slovakia (not including personal purchases and travel).",
      "💶 Študentovi v priemere stačí 200–250 € mesačne na pohodlný život na Slovensku (bez osobných nákupov a ciest)."
    ),
  },
  top_reasons_intro: {
    title_main: t("Чому обирають", "Why they choose", "Prečo si vyberajú"),
    title_emphasis: t("VipStudy", "VipStudy", "VipStudy"),
  },
  testimonials_intro: {
    title: t("Відгуки студентів", "Student reviews", "Recenzie študentov"),
  },
  feedback_form: {
    title_main: t("Залиште контакти —", "Leave your contact —", "Zanechaj kontakt —"),
    title_emphasis: t("передзвонимо", "we'll call you back", "zavoláme ti späť"),
    paragraph: t(
      "Фахівець безкоштовно відповість на всі питання про навчання у Словаччині.",
      "A specialist will answer all your questions about studying in Slovakia for free.",
      "Špecialista bezplatne odpovie na všetky otázky o štúdiu na Slovensku."
    ),
    submit_label: t("Надіслати", "Send", "Odoslať"),
    footnote: t(
      "Працюємо офіційно · договір у двох примірниках · відповідаємо протягом дня",
      "We work officially · contract in two copies · we respond within a day",
      "Pracujeme oficiálne · zmluva v dvoch vyhotoveniach · odpovedáme do jedného dňa"
    ),
  },
  thank_you: {
    message: t(
      "Дякуємо! Зв'яжемося з вами найближчим часом.",
      "Thank you! We'll contact you shortly.",
      "Ďakujeme! Čoskoro sa vám ozveme."
    ),
  },
  footer: {
    nav: NAV_RAW,
    copyright: t(
      "© 2026 VipStudy · Навчання у Словаччині",
      "© 2026 VipStudy · Study in Slovakia",
      "© 2026 VipStudy · Štúdium na Slovensku"
    ),
  },
} as const;

const FALLBACK_BENEFITS: BenefitRow[] = [
  { id: "f1", title: "Безкоштовне навчання", title_en: "Free education", title_sk: "Bezplatné vzdelanie", text: "Навчайтеся у державних університетах без оплати за навчання.", text_en: "Study at public universities free of tuition fees.", text_sk: "Študuj na štátnych univerzitách bez poplatkov za štúdium.", position: 1, visible: true },
  { id: "f2", title: "Вступ без НМТ", title_en: "Admission without NMT", title_sk: "Prijatie bez NMT", text: "Для більшості спеціальностей достатньо атестата.", text_en: "A school certificate is enough for most majors.", text_sk: "Pre väčšinu odborov stačí vysvedčenie.", position: 2, visible: true },
  { id: "f3", title: "Легка адаптація", title_en: "Easy adaptation", title_sk: "Ľahká adaptácia", text: "Словацька мова близька до української, тому звикнути набагато простіше.", text_en: "Slovak is close to Ukrainian, so settling in is much easier.", text_sk: "Slovenčina je blízka ukrajinčine, takže zvyknúť si je oveľa jednoduchšie.", position: 3, visible: true },
  { id: "f4", title: "ВНЖ на весь період навчання", title_en: "Residence permit for the whole studies", title_sk: "Povolenie na pobyt na celé štúdium", text: "Офіційне проживання в Словаччині протягом усього навчання.", text_en: "Official residence in Slovakia for the entire duration of your studies.", text_sk: "Oficiálny pobyt na Slovensku počas celého štúdia.", position: 4, visible: true },
  { id: "f5", title: "Безпечне середовище", title_en: "Safe environment", title_sk: "Bezpečné prostredie", text: "Комфортне студентське життя та високий рівень безпеки.", text_en: "Comfortable student life and a high level of safety.", text_sk: "Pohodlný študentský život a vysoká úroveň bezpečnosti.", position: 5, visible: true },
];

const FALLBACK_STEPS: StepRow[] = [
  { id: "s1", title: "Знайомство та консультація", title_en: "Introduction and consultation", title_sk: "Zoznámenie a konzultácia", description: "Обговорюємо ваші цілі, відповідаємо на всі запитання та будуємо індивідуальний план вступу.", description_en: "We discuss your goals, answer all your questions, and build a personal admission plan.", description_sk: "Prediskutujeme tvoje ciele, odpovieme na všetky otázky a zostavíme individuálny plán prijatia.", image_url: null, position: 1, visible: true },
  { id: "s2", title: "Офіційне оформлення", title_en: "Official paperwork", title_sk: "Oficiálne vybavenie", description: "Укладаємо договір і розпочинаємо повний супровід до моменту зарахування.", description_en: "We sign a contract and begin full support all the way to enrollment.", description_sk: "Uzavrieme zmluvu a začneme kompletné sprevádzanie až po zápis.", image_url: null, position: 2, visible: true },
  { id: "s3", title: "Вибір університету", title_en: "Choosing a university", title_sk: "Výber univerzity", description: "Підбираємо спеціальність і університети відповідно до ваших побажань та шансів на вступ.", description_en: "We select a major and universities based on your preferences and chances of admission.", description_sk: "Vyberieme odbor a univerzity podľa tvojich preferencií a šancí na prijatie.", image_url: null, position: 3, visible: true },
  { id: "s4", title: "Підготовка документів", title_en: "Document preparation", title_sk: "Príprava dokumentov", description: "Допомагаємо з оформленням усіх документів, нострифікацією та поданням заяв.", description_en: "We help prepare all documents, handle nostrification, and submit applications.", description_sk: "Pomôžeme s vybavením všetkých dokumentov, nostrifikáciou a podaním prihlášok.", image_url: null, position: 4, visible: true },
  { id: "s5", title: "Вступ і зарахування", title_en: "Admission and enrollment", title_sk: "Prijatie a zápis", description: "Контролюємо всі етапи вступу та супроводжуємо до отримання наказу про зарахування.", description_en: "We oversee every stage of admission and support you until you receive the enrollment order.", description_sk: "Kontrolujeme všetky fázy prijímacieho konania a sprevádzame ťa až po získanie rozhodnutia o prijatí.", image_url: null, position: 5, visible: true },
  { id: "s6", title: "Переїзд до Словаччини", title_en: "Moving to Slovakia", title_sk: "Presťahovanie na Slovensko", description: "Допомагаємо з гуртожитком, оформленням ВНЖ та підтримуємо вас навіть після початку навчання.", description_en: "We help with the dormitory, residence permit paperwork, and support you even after your studies begin.", description_sk: "Pomôžeme s internátom, vybavením povolenia na pobyt a podporujeme ťa aj po začiatku štúdia.", image_url: null, position: 6, visible: true },
];

const FALLBACK_COST_ITEMS: CostItemRow[] = [
  { id: "c1", amount: "70–140 €", label: "Проживання в гуртожитку", label_en: "Dormitory accommodation", label_sk: "Bývanie na internáte", position: 1, visible: true },
  { id: "c2", amount: "150–250 €", label: "Харчування (обід у студентській їдальні — 2,5–5 €)", label_en: "Food (a meal at the student canteen — €2.5–5)", label_sk: "Strava (obed v študentskej jedálni — 2,5–5 €)", position: 2, visible: true },
  { id: "c3", amount: "20 €", label: "Студентський проїзний", label_en: "Student transport pass", label_sk: "Študentský cestovný lístok", position: 3, visible: true },
  { id: "c4", amount: "15 €", label: "Мобільний зв'язок", label_en: "Mobile plan", label_sk: "Mobilné služby", position: 4, visible: true },
];

const FALLBACK_TOP_REASONS: TopReasonRow[] = [
  { id: "r1", text: "Наші люди самі навчаються в Словаччині й особисто пройшли всі етапи вступу.", text_en: "Our own people study in Slovakia and went through every stage of admission themselves.", text_sk: "Naši ľudia sami študujú na Slovensku a osobne prešli všetkými etapami prijatia.", position: 1, visible: true },
  { id: "r2", text: "Послуги під ключ або окремо на кожному етапі — можна заощадити.", text_en: "Full-service or step-by-step help — so you can save money.", text_sk: "Služby na kľúč alebo po jednotlivých etapách — môžeš ušetriť.", position: 2, visible: true },
  { id: "r3", text: "100% гарантія вступу за умови вчасного подання документів.", text_en: "100% admission guarantee if documents are submitted on time.", text_sk: "100% záruka prijatia pri včasnom podaní všetkých dokumentov.", position: 3, visible: true },
  { id: "r4", text: "Гнучка цінова політика.", text_en: "Flexible pricing.", text_sk: "Flexibilná cenová politika.", position: 4, visible: true },
  { id: "r5", text: "Понад 150 успішних абітурієнтів лише цього року.", text_en: "Over 150 successful applicants this year alone.", text_sk: "Viac ako 150 úspešných uchádzačov len tento rok.", position: 5, visible: true },
];

const FALLBACK_TESTIMONIALS: TestimonialRow[] = [
  { id: "t1", name: "Анна Андріївна", name_en: "Anna Andriivna", name_sk: "Anna Andrijivna", quote: "Вступила без НМТ, гуртожиток за п'ять хвилин від корпусу. Хлопці супроводжували на кожному кроці — від договору до міграційної поліції.", quote_en: "I got in without NMT, and my dorm is five minutes from campus. The team supported me every step — from the contract to the migration office.", quote_sk: "Dostala som sa bez NMT, internát mám päť minút od budovy. Tím ma sprevádzal na každom kroku — od zmluvy až po cudzineckú políciu.", meta: "Економічний університет, Братислава", meta_en: "University of Economics, Bratislava", meta_sk: "Ekonomická univerzita, Bratislava", position: 1, visible: true },
  { id: "t2", name: "Олексій К.", name_en: "Oleksiy K.", name_sk: "Oleksij K.", quote: "Найбільше боявся документів і нострифікації — усе зробили за мене. Через два місяці вже мав наказ про зарахування.", quote_en: "I was most afraid of paperwork and nostrification — they handled it all for me. Two months later I already had my enrollment order.", quote_sk: "Najviac som sa bál dokumentov a nostrifikácie — všetko za mňa vybavili. O dva mesiace som už mal rozhodnutie o prijatí.", meta: "Технічний університет, Кошиці", meta_en: "Technical University, Košice", meta_sk: "Technická univerzita, Košice", position: 2, visible: true },
];

function resolveNav(lang: Lang) {
  return NAV_RAW.map((n) => ({ label: pickText(n.label, lang), href: n.href }));
}

/** Fetches every content table in parallel and assembles the shape the landing page needs, already resolved to `lang`. Falls back to the design defaults if Supabase isn't reachable/seeded yet. */
export async function getLandingData(lang: Lang): Promise<LandingData> {
  let sectionByKey = new Map<string, { content: Record<string, unknown>; visible: boolean }>();
  let benefitsRaw: BenefitRow[] = FALLBACK_BENEFITS;
  let stepsRaw: StepRow[] = FALLBACK_STEPS;
  let costItemsRaw: CostItemRow[] = FALLBACK_COST_ITEMS;
  let topReasonsRaw: TopReasonRow[] = FALLBACK_TOP_REASONS;
  let testimonialsRaw: TestimonialRow[] = FALLBACK_TESTIMONIALS;
  const visibility: Record<string, boolean> = {};

  try {
    const supabase = await createClient();
    const [sections, benefits, steps, costItems, topReasons, testimonials] = await Promise.all([
      supabase.from("site_sections").select("*"),
      supabase.from("benefits").select("*").eq("visible", true).order("position"),
      supabase.from("steps").select("*").eq("visible", true).order("position"),
      supabase.from("cost_items").select("*").eq("visible", true).order("position"),
      supabase.from("top_reasons").select("*").eq("visible", true).order("position"),
      supabase.from("testimonials").select("*").eq("visible", true).order("position"),
    ]);

    if (sections.error) throw sections.error;
    sectionByKey = new Map(sections.data?.map((s) => [s.key, s]));
    for (const s of sections.data ?? []) visibility[s.key] = s.visible;

    if (benefits.data?.length) benefitsRaw = benefits.data as BenefitRow[];
    if (steps.data?.length) stepsRaw = steps.data as StepRow[];
    if (costItems.data?.length) costItemsRaw = costItems.data as CostItemRow[];
    if (topReasons.data?.length) topReasonsRaw = topReasons.data as TopReasonRow[];
    if (testimonials.data?.length) testimonialsRaw = testimonials.data as TestimonialRow[];
  } catch {
    // Supabase unreachable/unseeded — fall through with the defaults above.
  }

  const pick = (key: keyof typeof FALLBACK_SECTIONS): Record<string, unknown> =>
    (sectionByKey.get(key)?.content as Record<string, unknown> | undefined) ?? FALLBACK_SECTIONS[key];

  const header = pick("header") as typeof FALLBACK_SECTIONS.header;
  const hero = pick("hero") as typeof FALLBACK_SECTIONS.hero;
  const whyUs = pick("why_us") as typeof FALLBACK_SECTIONS.why_us;
  const stepsIntro = pick("steps_intro") as typeof FALLBACK_SECTIONS.steps_intro;
  const cost = pick("cost") as typeof FALLBACK_SECTIONS.cost;
  const topReasonsIntro = pick("top_reasons_intro") as typeof FALLBACK_SECTIONS.top_reasons_intro;
  const testimonialsIntro = pick("testimonials_intro") as typeof FALLBACK_SECTIONS.testimonials_intro;
  const feedbackForm = pick("feedback_form") as typeof FALLBACK_SECTIONS.feedback_form;
  const thankYou = pick("thank_you") as typeof FALLBACK_SECTIONS.thank_you;
  const footer = pick("footer") as typeof FALLBACK_SECTIONS.footer;

  const benefitItems: BenefitItem[] = benefitsRaw.map((b) => ({
    id: b.id,
    title: pickLang(b, "title", lang),
    text: pickLang(b, "text", lang),
  }));

  const stepItems: StepItem[] = stepsRaw.map((s) => ({
    id: s.id,
    num: String(s.position).padStart(2, "0"),
    title: pickLang(s, "title", lang),
    text: pickLang(s, "description", lang),
  }));

  const costItemItems: CostItem[] = costItemsRaw.map((c) => ({
    id: c.id,
    price: c.amount,
    label: pickLang(c, "label", lang),
  }));

  const topReasonItems: TopReasonItem[] = topReasonsRaw.map((r) => ({
    id: r.id,
    num: toRoman(r.position),
    text: pickLang(r, "text", lang),
  }));

  const testimonialItems: TestimonialItem[] = testimonialsRaw.map((tm) => ({
    id: tm.id,
    quote: pickLang(tm, "quote", lang),
    initials: initialsFromName(tm.name),
    name: pickLang(tm, "name", lang),
    meta: pickLang(tm, "meta", lang),
  }));

  return {
    header: { nav: resolveNav(lang), cta: pickText(header.cta, lang) },
    hero: {
      eyebrow: pickText(hero.eyebrow, lang),
      title_main: pickText(hero.title_main, lang),
      title_emphasis: pickText(hero.title_emphasis, lang),
      title_suffix: pickText(hero.title_suffix, lang),
      paragraph: pickText(hero.paragraph, lang),
      cta_primary: pickText(hero.cta_primary, lang),
      cta_secondary: pickText(hero.cta_secondary, lang),
      bullets: (hero.bullets as unknown as I18nText[]).map((b) => pickText(b, lang)),
      image: hero.image as string,
      stat1_value: hero.stat1_value as string,
      stat1_label: pickText(hero.stat1_label, lang),
      stat2_badge: hero.stat2_badge as string,
      stat2_text: pickText(hero.stat2_text, lang),
    },
    whyUs: {
      title_main: pickText(whyUs.title_main, lang),
      title_emphasis: pickText(whyUs.title_emphasis, lang),
      paragraph: pickText(whyUs.paragraph, lang),
      image: whyUs.image as string,
    },
    benefits: benefitItems,
    stepsIntro: {
      title: pickText(stepsIntro.title, lang),
      paragraph: pickText(stepsIntro.paragraph, lang),
    },
    steps: stepItems,
    cost: { title: pickText(cost.title, lang), paragraph: pickText(cost.paragraph, lang), note: pickText(cost.note, lang) },
    costItems: costItemItems,
    topReasonsIntro: {
      title_main: pickText(topReasonsIntro.title_main, lang),
      title_emphasis: pickText(topReasonsIntro.title_emphasis, lang),
    },
    topReasons: topReasonItems,
    testimonialsIntro: { title: pickText(testimonialsIntro.title, lang) },
    testimonials: testimonialItems,
    contact: {
      title_main: pickText(feedbackForm.title_main, lang),
      title_emphasis: pickText(feedbackForm.title_emphasis, lang),
      paragraph: pickText(feedbackForm.paragraph, lang),
      submit_label: pickText(feedbackForm.submit_label, lang),
      footnote: pickText(feedbackForm.footnote, lang),
    },
    thankYou: { message: pickText(thankYou.message, lang) },
    footer: { nav: resolveNav(lang), copyright: pickText(footer.copyright, lang) },
    sectionVisibility: visibility,
  };
}
