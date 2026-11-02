import { getLanguageSuggestion, normalizePath, type LanguageLink } from "../utils/language-preference";
import type { LanguageSuggestionLabels } from "../utils/language-detection";

const preferenceKey = "linwood:preferred-language";
const stores = ["localStorage", "sessionStorage"] as const;
let installed = false;

function readPreference() {
  for (const name of stores) {
    try {
      const value = window[name].getItem(preferenceKey);
      if (value) return value;
    } catch {
      // Preferences are optional when browser storage is unavailable.
    }
  }
  return undefined;
}

function rememberPreference(language: string) {
  for (const name of stores) {
    try {
      window[name].setItem(preferenceKey, language);
      return;
    } catch {
      // Try session storage if persistent storage is unavailable.
    }
  }
}

function alternateLanguages(): LanguageLink[] {
  return Array.from(document.querySelectorAll<HTMLLinkElement>('link[rel="alternate"][hreflang]'))
    .filter((link) => link.hreflang !== "x-default")
    .map((link) => ({ lang: link.hreflang, href: link.href }));
}

function languageName(link: LanguageLink) {
  const path = normalizePath(new URL(link.href).pathname);
  const option = Array.from(document.querySelectorAll<HTMLOptionElement>("starlight-lang-select option"))
    .find((option) => normalizePath(new URL(option.value, window.location.href).pathname) === path);
  return option?.textContent?.trim() || link.lang;
}

export function setupLanguageDetection(
  rootLanguage: string,
  labels: Record<string, LanguageSuggestionLabels> = {},
) {
  if (installed) return;
  installed = true;
  let panel: HTMLElement | undefined;
  let dismissed = false;
  const hide = () => { panel?.remove(); panel = undefined; };
  const keepCurrent = () => {
    dismissed = true;
    rememberPreference(rootLanguage);
    hide();
  };
  const suggest = () => {
    hide();
    if (dismissed || !document.querySelector("starlight-lang-select")) return;
    const links = alternateLanguages();
    const preferences = [
      readPreference(),
      ...(navigator.languages.length ? navigator.languages : [navigator.language]),
    ].filter((language): language is string => Boolean(language));
    const suggestion = getLanguageSuggestion(new URL(window.location.href), rootLanguage, links, preferences);
    const root = links.find((link) => link.lang.toLowerCase() === rootLanguage.toLowerCase());
    if (!suggestion || !root) return;
    const text = labels[suggestion.lang] ?? { title: "Select language", dismiss: "Cancel" };

    panel = document.createElement("aside");
    panel.className = "linwood-language-suggestion";
    panel.setAttribute("role", "region");
    panel.setAttribute("aria-label", text.title);
    panel.setAttribute("aria-live", "polite");
    panel.lang = suggestion.lang;
    const title = document.createElement("p");
    title.className = "linwood-language-suggestion__title";
    title.dir = "auto";
    title.textContent = text.title;
    const close = document.createElement("button");
    close.type = "button";
    close.className = "linwood-language-suggestion__close";
    close.setAttribute("aria-label", text.dismiss);
    close.textContent = "×";
    close.addEventListener("click", keepCurrent);
    const choices = document.createElement("div");
    choices.className = "linwood-language-suggestion__choices";
    const keep = document.createElement("button");
    keep.type = "button";
    keep.lang = rootLanguage;
    keep.dir = "auto";
    keep.textContent = languageName(root);
    keep.addEventListener("click", keepCurrent);
    const accept = document.createElement("a");
    accept.className = "linwood-language-suggestion__accept";
    accept.lang = suggestion.lang;
    accept.dir = "auto";
    accept.href = suggestion.href;
    accept.textContent = languageName(suggestion);
    accept.addEventListener("click", () => {
      dismissed = true;
      rememberPreference(suggestion.lang);
    });
    choices.append(keep, accept);
    panel.append(title, close, choices);
    document.body.append(panel);
  };

  // The native language picker remains authoritative, including an explicit English choice.
  document.addEventListener("change", (event) => {
    const select = event.target;
    if (!(select instanceof HTMLSelectElement) || !select.closest("starlight-lang-select")) return;
    const target = new URL(select.value, window.location.href);
    const selected = alternateLanguages().find((link) =>
      normalizePath(new URL(link.href).pathname) === normalizePath(target.pathname),
    );
    if (selected) rememberPreference(selected.lang);
    dismissed = true;
    hide();
  }, true);
  document.addEventListener("astro:before-swap", hide);
  document.addEventListener("astro:page-load", suggest);
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", suggest, { once: true });
  } else {
    suggest();
  }
}
