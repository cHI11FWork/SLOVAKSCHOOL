export type FieldConfig = {
  key: string;
  label: string;
  type: "text" | "textarea" | "image" | "string-list";
};

export type ListTableName =
  | "benefits"
  | "steps"
  | "cost_items"
  | "top_reasons"
  | "testimonials"
  | "social_links";

export const LIST_TABLES: Record<
  ListTableName,
  { label: string; fields: FieldConfig[]; emptyItem: Record<string, string> }
> = {
  benefits: {
    label: "5 причин обрати Словаччину",
    fields: [{ key: "text", label: "Текст", type: "text" }],
    emptyItem: { text: "" },
  },
  steps: {
    label: "Етапи співпраці",
    fields: [
      { key: "title", label: "Заголовок", type: "text" },
      { key: "description", label: "Опис", type: "textarea" },
      { key: "image_url", label: "Фото", type: "image" },
    ],
    emptyItem: { title: "", description: "", image_url: "" },
  },
  cost_items: {
    label: "Картки вартості",
    fields: [
      { key: "amount", label: "Сума", type: "text" },
      { key: "label", label: "Підпис", type: "text" },
    ],
    emptyItem: { amount: "", label: "" },
  },
  top_reasons: {
    label: "Топ 5 причин VipStudy",
    fields: [{ key: "text", label: "Текст", type: "text" }],
    emptyItem: { text: "" },
  },
  testimonials: {
    label: "Відгуки",
    fields: [
      { key: "name", label: "Ім'я", type: "text" },
      { key: "quote", label: "Відгук", type: "textarea" },
    ],
    emptyItem: { name: "", quote: "" },
  },
  social_links: {
    label: "Соцмережі (футер)",
    fields: [
      { key: "platform", label: "Платформа (instagram / telegram / linkedin)", type: "text" },
      { key: "url", label: "Посилання", type: "text" },
    ],
    emptyItem: { platform: "", url: "#" },
  },
};

export type SectionKey =
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

export const SECTION_FIELDS: Record<SectionKey, FieldConfig[]> = {
  header: [],
  hero: [
    { key: "headline", label: "Заголовок", type: "textarea" },
    { key: "bullets", label: "Список переваг (по одному в рядку)", type: "string-list" },
    { key: "image", label: "Фото", type: "image" },
    { key: "form_title", label: "Заголовок форми", type: "text" },
    { key: "form_subtitle", label: "Підзаголовок форми", type: "textarea" },
    { key: "form_button", label: "Текст кнопки", type: "text" },
  ],
  why_us: [
    { key: "title", label: "Заголовок", type: "text" },
    { key: "tag", label: "Підзаголовок (рожевий)", type: "text" },
    { key: "paragraph", label: "Текст", type: "textarea" },
    { key: "image", label: "Фото", type: "image" },
  ],
  benefits_band: [
    { key: "title", label: "Заголовок", type: "text" },
    { key: "form_title", label: "Заголовок форми", type: "text" },
    { key: "form_subtitle", label: "Підзаголовок форми", type: "textarea" },
    { key: "form_button", label: "Текст кнопки", type: "text" },
  ],
  steps_intro: [{ key: "title", label: "Заголовок", type: "text" }],
  cost: [
    { key: "title", label: "Заголовок", type: "text" },
    { key: "paragraph_1", label: "Абзац 1", type: "textarea" },
    { key: "paragraph_2", label: "Абзац 2", type: "textarea" },
  ],
  top_reasons_intro: [{ key: "title", label: "Заголовок", type: "text" }],
  testimonials_intro: [{ key: "title", label: "Заголовок", type: "text" }],
  feedback_form: [
    { key: "form_title", label: "Заголовок форми", type: "text" },
    { key: "form_subtitle", label: "Підзаголовок форми", type: "textarea" },
    { key: "form_button", label: "Текст кнопки", type: "text" },
  ],
  thank_you: [
    { key: "title", label: "Заголовок", type: "text" },
    { key: "message", label: "Повідомлення", type: "textarea" },
    { key: "button", label: "Текст кнопки", type: "text" },
  ],
  footer: [],
};

export const SECTION_LABELS: Record<SectionKey, string> = {
  header: "Шапка (меню)",
  hero: "Головний екран",
  why_us: "Чому варто поступати",
  benefits_band: "5 причин + консультація",
  steps_intro: "Заголовок етапів",
  cost: "Вартість навчання",
  top_reasons_intro: "Заголовок топ 5 причин",
  testimonials_intro: "Заголовок відгуків",
  feedback_form: "Форма зворотного зв'язку",
  thank_you: "Модалка «Дякуємо»",
  footer: "Футер",
};
