export type Lang = "uk" | "en" | "sk";
export const LANGS: Lang[] = ["uk", "en", "sk"];
export const DEFAULT_LANG: Lang = "uk";
export const LANG_COOKIE = "vs_lang";

export function isLang(value: string | undefined | null): value is Lang {
  return value === "uk" || value === "en" || value === "sk";
}

/** Reads a translated column: for "uk" reads `field` directly, otherwise `${field}_${lang}` with fallback to `field`. */
export function pickLang(row: Record<string, unknown>, field: string, lang: Lang): string {
  if (lang === DEFAULT_LANG) return (row[field] as string) ?? "";
  const translated = row[`${field}_${lang}`];
  return (translated as string) || ((row[field] as string) ?? "");
}

/** Same idea for `{ uk, en?, sk? }` value objects used inside jsonb `site_sections.content`. */
export type I18nText = { uk: string; en?: string; sk?: string };

export function pickText(value: I18nText | undefined, lang: Lang): string {
  if (!value) return "";
  if (lang === DEFAULT_LANG) return value.uk;
  return value[lang] || value.uk;
}
