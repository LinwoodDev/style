export type TranslationDictionaries = Record<string, Record<string, string>>;

export function toSnakeCase(label: string): string {
  return label.trim().toLowerCase().replace(/\s+/g, "_");
}

/** Reuse Crowdin UI dictionaries for Starlight sidebar labels. */
export function createTranslations(dictionaries: TranslationDictionaries) {
  const translations: Record<string, Record<string, string>> = {};
  for (const [lang, dictionary] of Object.entries(dictionaries)) {
    for (const [key, term] of Object.entries(dictionary)) {
      (translations[key] ??= {})[lang] = term;
    }
  }

  function getTranslations(key: string): Record<string, string> | undefined {
    return translations[key];
  }

  function getSidebarTranslatedLabel(label: string, key = toSnakeCase(label)) {
    return { label, translations: getTranslations(key) };
  }

  return { getTranslations, getSidebarTranslatedLabel };
}
