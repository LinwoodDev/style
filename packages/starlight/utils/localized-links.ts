import { getCollection } from "astro:content";
import { getRelativeLocaleUrl, pathHasLocale } from "astro:i18n";

let pagePaths: Promise<Set<string>> | undefined;

/** Localize only root-relative content links, leaving assets and explicit locales alone. */
export async function getLinkLocalizer(locale: string | undefined) {
  if (!locale) return (href: string) => href;

  pagePaths ??= getCollection("docs").then(
    (entries) =>
      new Set(
        entries
          .map(({ id }) => {
            const firstSegment = id.split("/")[0]!;
            const slug = pathHasLocale(firstSegment)
              ? id.slice(firstSegment.length + 1)
              : id;
            return slug.replace(/(^|\/)index$/, "").replace(/\/$/, "");
          }),
      ),
  );
  const paths = await pagePaths;

  return (href: string): string => {
    if (!href.startsWith("/") || href.startsWith("//")) return href;
    const boundary = href.search(/[?#]/);
    const pathname = boundary === -1 ? href : href.slice(0, boundary);
    const suffix = boundary === -1 ? "" : href.slice(boundary);
    const slug = pathname.replace(/^\/|\/$/g, "");
    if (!paths.has(slug)) return href;
    return getRelativeLocaleUrl(locale, slug) + suffix;
  };
}
