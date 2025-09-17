export type Language = "th" | "en";
export type LanguageId = "1" | "2";

export const LANGUAGE_MAP: Record<Language, LanguageId> = {
  th: "1",
  en: "2",
};

export function getLanguageId(lang: Language = "th"): LanguageId {
  return LANGUAGE_MAP[lang];
}

export function getCurrentLanguage(): Language {
  return "th";
}
