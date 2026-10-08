import assert from "node:assert/strict";
import test from "node:test";
import { createTranslations } from "../translations.ts";
import { localizeContentLinks } from "../utils/content-links.ts";

test("Crowdin dictionaries support language tags, missing terms, and custom sidebar keys", () => {
  const dictionaries = {
    en: { privacy_policy: "Privacy policy", nightly: "Nightly builds" },
    "pt-BR": { privacy_policy: "Política de privacidade" },
    fr: { nightly: "Versions quotidiennes" },
  };
  const original = structuredClone(dictionaries);
  const { getSidebarTranslatedLabel } = createTranslations(dictionaries);
  assert.deepEqual(getSidebarTranslatedLabel(" Privacy   policy "), {
    label: " Privacy   policy ",
    translations: { en: "Privacy policy", "pt-BR": "Política de privacidade" },
  });
  assert.deepEqual(getSidebarTranslatedLabel("Nightly builds", "nightly"), {
    label: "Nightly builds",
    translations: { en: "Nightly builds", fr: "Versions quotidiennes" },
  });
  assert.equal(getSidebarTranslatedLabel("Untranslated").translations, undefined);
  assert.deepEqual(dictionaries, original);
});

test("rendered Markdown and cards preserve code and scripts when localizing anchors", () => {
  const html = '<a class="card" href="/guide/?a=1&amp;b=2#install" data-test="yes">Guide</a>' +
    '<a href="https://example.com">External</a><a href="#install">Anchor</a>' +
    '<pre>&lt;a href="/guide/"&gt;</pre><script>const x = "<a href=\"/guide/\">";</script>';
  const result = localizeContentLinks(html, (href) =>
    href.startsWith("/guide/") ? "/fr" + href : href,
  );
  assert.ok(result.includes('href="/fr/guide/?a=1&amp;b=2#install"'));
  assert.ok(result.includes('class="card"'));
  assert.ok(result.includes('data-test="yes"'));
  assert.ok(result.endsWith(html.slice(html.indexOf('<a href="https:'))));
});

test("content without changed page links is returned verbatim", () => {
  const html = "<!-- comment -->\n<A href='/assets/logo.svg' class='brand'>Logo</A>";
  assert.equal(localizeContentLinks(html, (href) => href), html);
});
