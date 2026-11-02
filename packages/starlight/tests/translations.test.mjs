import assert from "node:assert/strict";
import test from "node:test";
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { createI18n, createTranslations, loadTranslations } from "../translations.ts";
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

function withDictionaries(run) {
  const directory = mkdtempSync(join(tmpdir(), "linwood-i18n-"));
  try {
    return run(directory, pathToFileURL(directory + "/"));
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
}

test("native i18n dictionaries preserve language tags and ignore non-content entries", () => {
  withDictionaries((directory, url) => {
    writeFileSync(join(directory, "en.json"), JSON.stringify({ guides: "Guides" }));
    writeFileSync(join(directory, "pt-BR.json"), JSON.stringify({ guides: "Guias" }));
    writeFileSync(join(directory, "zh-Hant.json"), JSON.stringify({ guides: "指南", empty: "" }));
    writeFileSync(join(directory, "_draft.json"), "not JSON");
    writeFileSync(join(directory, "README.md"), "Translation instructions");
    mkdirSync(join(directory, "nested.json"));

    assert.deepEqual(loadTranslations(url), {
      en: { guides: "Guides" },
      "pt-BR": { guides: "Guias" },
      "zh-Hant": { guides: "指南", empty: "" },
    });
    const { getSidebarTranslatedLabel } = createTranslations(url);
    assert.deepEqual(getSidebarTranslatedLabel("Guides"), {
      label: "Guides",
      translations: { en: "Guides", "pt-BR": "Guias", "zh-Hant": "指南" },
    });
    assert.equal(getSidebarTranslatedLabel("Missing").translations, undefined);
    assert.equal(getSidebarTranslatedLabel("Empty").translations, undefined);
  });
});

test("invalid native UI dictionaries report their source file", () => {
  withDictionaries((directory, url) => {
    for (const invalid of [null, [], { guides: 42 }, { guides: { nested: "Guides" } }]) {
      writeFileSync(join(directory, "fr.json"), JSON.stringify(invalid));
      assert.throws(() => loadTranslations(url), /flat dictionary.*fr\.json/);
    }
    writeFileSync(join(directory, "fr.json"), "{ invalid JSON");
    assert.throws(() => loadTranslations(url), SyntaxError);
  });
});

test("i18n derives locale paths, native names, and RTL from language tags", () => {
  const source = {
    en: { guides: "Guides" },
    de: { guides: "Anleitungen" },
    ar: {},
    he: {},
    "pt-BR": {},
    "zh-Hant": {},
  };
  const original = structuredClone(source);
  const { config, getSidebarTranslatedLabel } = createI18n(source);
  assert.equal(config.defaultLocale, "root");
  assert.deepEqual(config.locales.root, { label: "English", lang: "en", dir: "ltr" });
  assert.equal(config.locales.de.label, "Deutsch");
  assert.equal(config.locales.ar.dir, "rtl");
  assert.equal(config.locales.he.dir, "rtl");
  assert.equal(config.locales["pt-br"].lang, "pt-BR");
  assert.equal(config.locales["zh-hant"].lang, "zh-Hant");
  assert.equal(getSidebarTranslatedLabel("Guides").translations.de, "Anleitungen");
  assert.deepEqual(source, original);
  assert.equal(createI18n({ ...source, fr: {} }).config.locales.fr.lang, "fr");
  assert.equal(createI18n({ en: {}, zz: {} }).config.locales.zz.dir, "ltr");
});

test("the default language is configurable and dictionaries must be unambiguous", () => {
  const { config } = createI18n({ en: {}, fr: {} }, { defaultLocale: "fr" });
  assert.equal(config.locales.root.lang, "fr");
  assert.equal(config.locales.en.lang, "en");
  assert.throws(() => createI18n({ fr: {} }), /Default UI dictionary "en"/);
  assert.throws(() => createI18n({ en: {}, EN: {} }), /Duplicate UI dictionaries/);
  assert.throws(() => createI18n({ en: {}, not_a_language: {} }), RangeError);
});

test("adding a native UI dictionary enables its locale without another registry", () => {
  withDictionaries((directory, url) => {
    writeFileSync(join(directory, "en.json"), JSON.stringify({ guides: "Guides" }));
    assert.deepEqual(Object.keys(createI18n(url).config.locales), ["root"]);
    writeFileSync(join(directory, "fr.json"), JSON.stringify({ guides: "Guides français" }));
    const { config, getSidebarTranslatedLabel } = createI18n(url);
    assert.equal(config.locales.fr.lang, "fr");
    assert.equal(getSidebarTranslatedLabel("Guides").translations.fr, "Guides français");
  });
});
