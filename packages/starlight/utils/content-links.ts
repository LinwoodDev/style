import { attrs, ELEMENT_NODE, parse, walkSync } from "ultrahtml";

/** Rewrite rendered anchors so Markdown, MDX cards, and fallback content all work. */
export function localizeContentLinks(
  html: string,
  localize: (href: string) => string,
): string {
  const replacements: { start: number; end: number; html: string }[] = [];
  walkSync(parse(html), (node) => {
    if (
      node.type !== ELEMENT_NODE ||
      node.name !== "a" ||
      !node.attributes.href
    )
      return;
    const href = localize(node.attributes.href);
    if (href === node.attributes.href) return;
    const location = node.loc[0];
    replacements.push({
      start: location.start,
      end: location.end,
      html: `<a${attrs({ ...node.attributes, href }).value}>`,
    });
  });
  // Patch only changed opening tags; preserve scripts, code samples, and all other markup.
  for (const replacement of replacements.sort((a, b) => b.start - a.start)) {
    html =
      html.slice(0, replacement.start) +
      replacement.html +
      html.slice(replacement.end);
  }
  return html;
}
