import { readdirSync, readFileSync } from "node:fs";

export type TranslationDictionaries = Record<string, Record<string, string>>;

export function toSnakeCase(label: string): string {
  return label.trim().toLowerCase().replace(/\s+/g, "_");
}

/** Read the JSON dictionaries used by Starlight's native i18n collection at build time. */
export function loadTranslations(directory: URL): TranslationDictionaries {
  const dictionaries: TranslationDictionaries = {};
  for (const file of readdirSync(directory, { withFileTypes: true })) {
    if (!file.isFile() || file.name.startsWith("_") || !file.name.endsWith(".json")) continue;
    const source = new URL(file.name, directory);
    const dictionary: unknown = JSON.parse(readFileSync(source, "utf8"));
    if (
      !dictionary || typeof dictionary !== "object" || Array.isArray(dictionary) ||
      Object.values(dictionary).some((value) => typeof value !== "string")
    ) {
      throw new TypeError(`Expected a flat dictionary of UI strings in ${source.href}`);
    }
    dictionaries[file.name.slice(0, -5)] = dictionary as Record<string, string>;
  }
  return dictionaries;
}

/** Build Starlight sidebar labels from dictionaries or the site's native i18n directory. */
export function createTranslations(source: TranslationDictionaries | URL) {
  const dictionaries = source instanceof URL ? loadTranslations(source) : source;
  const translations: Record<string, Record<string, string>> = {};
  for (const [lang, dictionary] of Object.entries(dictionaries)) {
    for (const [key, term] of Object.entries(dictionary)) {
      if (term) (translations[key] ??= {})[lang] = term;
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

export interface I18nOptions {
  /** The dictionary to serve at the site root and use for fallback content. */
  defaultLocale?: string;
}

/** Opt into native Starlight i18n using the languages present in the UI dictionaries. */
export function createI18n(
  source: TranslationDictionaries | URL,
  { defaultLocale = "en" }: I18nOptions = {},
) {
  const dictionaries = source instanceof URL ? loadTranslations(source) : source;
  if (!Object.hasOwn(dictionaries, defaultLocale)) {
    throw new Error(`Default UI dictionary "${defaultLocale}" was not found.`);
  }
  const locales: Record<string, { label: string; lang: string; dir: "ltr" | "rtl" }> = {};
  const languages = new Set<string>();
  for (const lang of Object.keys(dictionaries)) {
    const locale = new Intl.Locale(lang);
    if (languages.has(locale.toString())) {
      throw new Error(`Duplicate UI dictionaries for language "${locale.toString()}".`);
    }
    languages.add(locale.toString());
    const path = lang === defaultLocale ? "root" : lang.toLowerCase();
    locales[path] = {
      label: new Intl.DisplayNames(lang, { type: "language" }).of(lang) ?? lang,
      lang,
      dir: locale.getTextInfo().direction ?? "ltr",
    };
  }
  return {
    config: { defaultLocale: "root", locales },
    ...createTranslations(dictionaries),
  };
}
