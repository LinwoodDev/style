export interface LanguageLink {
  lang: string;
  href: string;
}

function languageInfo(tag: string) {
  try {
    const locale = new Intl.Locale(tag);
    const expanded = locale.maximize();
    return {
      tag: locale.baseName.toLowerCase(),
      language: locale.language === "nb" ? "no" : locale.language,
      script: expanded.script,
      region: expanded.region,
      generic: locale.baseName === locale.language,
    };
  } catch {
    return undefined;
  }
}

/** Match browser preferences in order, including language, script, and regional fallbacks. */
export function matchLanguage(preferences: readonly string[], links: readonly LanguageLink[]) {
  const supported = links.flatMap((link) => {
    const info = languageInfo(link.lang);
    return info ? [{ link, info }] : [];
  });
  for (const preference of preferences) {
    const requested = languageInfo(preference);
    if (!requested) continue;
    const exact = supported.find(({ info }) => info.tag === requested.tag);
    if (exact) return exact.link;
    const candidates = supported
      .filter(({ info }) => info.language === requested.language)
      .map(({ link, info }) => ({
        link,
        score: (info.script === requested.script ? 4 : 0) +
          (info.region === requested.region ? 2 : 0) + (info.generic ? 1 : 0),
      }))
      .sort((a, b) => b.score - a.score);
    if (candidates[0]) return candidates[0].link;
  }
  return undefined;
}

export const normalizePath = (pathname: string) => pathname.replace(/\/+$/, "") || "/";

/** Offer a language for unprefixed pages without navigating or changing explicit locale URLs. */
export function getLanguageSuggestion(
  current: URL,
  rootLanguage: string,
  links: readonly LanguageLink[],
  preferences: readonly string[],
) {
  const root = links.find((link) => link.lang.toLowerCase() === rootLanguage.toLowerCase());
  if (!root) return undefined;
  const rootUrl = new URL(root.href, current);
  if (normalizePath(current.pathname) !== normalizePath(rootUrl.pathname)) return undefined;
  if (/\/404(?:\.html)?\/?$/.test(current.pathname)) return undefined;
  const preferred = matchLanguage(preferences, links);
  if (!preferred) return undefined;
  const target = new URL(preferred.href, current);
  if (!/^https?:$/.test(target.protocol)) return undefined;
  if (normalizePath(target.pathname) === normalizePath(current.pathname)) return undefined;
  // Use the current origin so local previews and alternate deployments stay on their own host.
  const redirect = new URL(current);
  redirect.pathname = target.pathname;
  return { lang: preferred.lang, href: redirect.href };
}
