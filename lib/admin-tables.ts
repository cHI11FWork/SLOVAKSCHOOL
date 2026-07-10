export type FieldConfig = {
  key: string;
  label: string;
  type: "text" | "textarea" | "image" | "string-list" | "text-i18n" | "textarea-i18n";
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
    label: "Причини обрати Словаччину",
    fields: [
      { key: "title", label: "Заголовок", type: "text-i18n" },
      { key: "text", label: "Текст", type: "textarea-i18n" },
    ],
    emptyItem: { title: "", title_en: "", title_sk: "", text: "", text_en: "", text_sk: "" },
  },
  steps: {
    label: "Кроки до зарахування",
    fields: [
      { key: "title", label: "Заголовок", type: "text-i18n" },
      { key: "description", label: "Опис", type: "textarea-i18n" },
    ],
    emptyItem: {
      title: "",
      title_en: "",
      title_sk: "",
      description: "",
      description_en: "",
      description_sk: "",
    },
  },
  cost_items: {
    label: "Картки вартості",
    fields: [
      { key: "amount", label: "Сума (однакова для всіх мов)", type: "text" },
      { key: "label", label: "Підпис", type: "text-i18n" },
    ],
    emptyItem: { amount: "", label: "", label_en: "", label_sk: "" },
  },
  top_reasons: {
    label: "Чому обирають VipStudy",
    fields: [
      { key: "title", label: "Заголовок", type: "text-i18n" },
      { key: "text", label: "Текст", type: "textarea-i18n" },
    ],
    emptyItem: { title: "", title_en: "", title_sk: "", text: "", text_en: "", text_sk: "" },
  },
  testimonials: {
    label: "Відгуки",
    fields: [
      { key: "photo", label: "Фото", type: "image" },
      { key: "name", label: "Ім'я", type: "text-i18n" },
      { key: "quote", label: "Відгук", type: "textarea-i18n" },
      { key: "meta", label: "Університет / контекст", type: "text-i18n" },
    ],
    emptyItem: {
      photo: "",
      name: "",
      name_en: "",
      name_sk: "",
      quote: "",
      quote_en: "",
      quote_sk: "",
      meta: "",
      meta_en: "",
      meta_sk: "",
    },
  },
  social_links: {
    label: "Соцмережі (наразі не показуються на сайті)",
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
  | "steps_intro"
  | "cost"
  | "top_reasons_intro"
  | "testimonials_intro"
  | "feedback_form"
  | "thank_you"
  | "footer";

export const SECTION_FIELDS: Record<SectionKey, FieldConfig[]> = {
  header: [{ key: "cta", label: "Текст кнопки", type: "text-i18n" }],
  hero: [
    { key: "eyebrow", label: "Надпис над заголовком", type: "text-i18n" },
    { key: "title_main", label: "Заголовок (початок)", type: "text-i18n" },
    { key: "title_emphasis", label: "Заголовок (курсивом)", type: "text-i18n" },
    { key: "title_suffix", label: "Заголовок (кінець)", type: "text-i18n" },
    { key: "paragraph", label: "Текст", type: "textarea-i18n" },
    { key: "cta_primary", label: "Кнопка 1", type: "text-i18n" },
    { key: "cta_secondary", label: "Кнопка 2", type: "text-i18n" },
    { key: "image", label: "Фото", type: "image" },
    { key: "stat1_value", label: "Число у першій картці (однакове для всіх мов)", type: "text" },
    { key: "stat1_label", label: "Підпис першої картки", type: "text-i18n" },
    { key: "stat2_badge", label: "Бейдж другої картки (однаковий для всіх мов)", type: "text" },
    { key: "stat2_text", label: "Текст другої картки", type: "textarea-i18n" },
  ],
  why_us: [
    { key: "title_main", label: "Заголовок (початок)", type: "text-i18n" },
    { key: "title_emphasis", label: "Заголовок (курсивом)", type: "text-i18n" },
    { key: "paragraph", label: "Текст", type: "textarea-i18n" },
    { key: "image", label: "Фото", type: "image" },
  ],
  steps_intro: [
    { key: "title", label: "Заголовок", type: "text-i18n" },
    { key: "paragraph", label: "Підзаголовок", type: "textarea-i18n" },
  ],
  cost: [
    { key: "title", label: "Заголовок", type: "text-i18n" },
    { key: "paragraph", label: "Текст", type: "textarea-i18n" },
    { key: "note", label: "Плашка знизу", type: "textarea-i18n" },
  ],
  top_reasons_intro: [
    { key: "title_main", label: "Заголовок (початок)", type: "text-i18n" },
    { key: "title_emphasis", label: "Заголовок (курсивом)", type: "text-i18n" },
    { key: "image", label: "Фото", type: "image" },
  ],
  testimonials_intro: [{ key: "title", label: "Заголовок", type: "text-i18n" }],
  feedback_form: [
    { key: "title_main", label: "Заголовок (початок)", type: "text-i18n" },
    { key: "title_emphasis", label: "Заголовок (курсивом)", type: "text-i18n" },
    { key: "paragraph", label: "Текст", type: "textarea-i18n" },
    { key: "submit_label", label: "Текст кнопки", type: "text-i18n" },
    { key: "footnote", label: "Дрібний текст під формою", type: "text-i18n" },
  ],
  thank_you: [{ key: "message", label: "Повідомлення після відправки", type: "textarea-i18n" }],
  footer: [{ key: "copyright", label: "Копірайт", type: "text-i18n" }],
};

export const SECTION_LABELS: Record<SectionKey, string> = {
  header: "Шапка (меню)",
  hero: "Головний екран",
  why_us: "Чому Словаччина",
  steps_intro: "Заголовок кроків",
  cost: "Вартість навчання",
  top_reasons_intro: "Заголовок «Чому VipStudy»",
  testimonials_intro: "Заголовок відгуків",
  feedback_form: "Форма заявки",
  thank_you: "Повідомлення після відправки форми",
  footer: "Футер",
};
