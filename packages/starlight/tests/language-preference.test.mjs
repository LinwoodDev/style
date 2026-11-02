import assert from "node:assert/strict";
import test from "node:test";
import { getLanguageSuggestion, matchLanguage } from "../utils/language-preference.ts";
import { createLanguageDetectionIntegration } from "../utils/language-detection.ts";

const links = Object.entries({ en: "", de: "de", fr: "fr", pt: "pt", "pt-BR": "pt-br", zh: "zh", "zh-Hant": "zh-hant", no: "no" })
  .map(([lang, prefix]) => ({ lang, href: `https://example.com/${prefix ? prefix + "/" : ""}docs/intro/` }));

test("browser preferences use the first supported language, including the root language", () => {
  assert.equal(matchLanguage(["de-DE", "en"], links)?.lang, "de");
  assert.equal(matchLanguage(["en-GB", "de"], links)?.lang, "en");
  assert.equal(matchLanguage(["zz", "fr-CA"], links)?.lang, "fr");
  assert.equal(matchLanguage(["not_a_language", "de"], links)?.lang, "de");
  assert.equal(matchLanguage(["zz"], links), undefined);
});

test("regional and script variants choose the appropriate translation", () => {
  assert.equal(matchLanguage(["pt-BR"], links)?.lang, "pt-BR");
  assert.equal(matchLanguage(["pt-PT"], links)?.lang, "pt");
  assert.equal(matchLanguage(["zh-TW"], links)?.lang, "zh-Hant");
  assert.equal(matchLanguage(["zh-HK"], links)?.lang, "zh-Hant");
  assert.equal(matchLanguage(["zh-CN"], links)?.lang, "zh");
  assert.equal(matchLanguage(["nb-NO"], links)?.lang, "no");
});

test("unprefixed entry offers the same page, preserving query and hash", () => {
  const current = new URL("http://localhost:4321/docs/intro?download=1#install");
  assert.equal(getLanguageSuggestion(current, "en", links, ["de-DE"])?.href,
    "http://localhost:4321/de/docs/intro/?download=1#install");
});

test("explicit locale URLs, remembered English, and unsupported languages stay put", () => {
  assert.equal(getLanguageSuggestion(new URL("https://example.com/fr/docs/intro/"), "en", links, ["de"]), undefined);
  assert.equal(getLanguageSuggestion(new URL("https://example.com/docs/intro/"), "en", links, ["en", "de"]), undefined);
  assert.equal(getLanguageSuggestion(new URL("https://example.com/docs/intro/"), "en", links, ["zz"]), undefined);
  assert.equal(getLanguageSuggestion(new URL("https://example.com/docs/intro"), "en", links, ["en"]), undefined);
});

test("base paths, missing alternate metadata, and 404 pages are handled safely", () => {
  const based = links.map((link) => ({ ...link, href: link.href.replace("example.com/", "example.com/project/") }));
  assert.equal(getLanguageSuggestion(new URL("https://example.com/project/docs/intro/"), "en", based, ["de"])?.href,
    "https://example.com/project/de/docs/intro/");
  assert.equal(getLanguageSuggestion(new URL("https://example.com/docs/intro/"), "en", [], ["de"]), undefined);
  const notFound = links.map((link) => ({ ...link, href: link.href.replace("docs/intro/", "404/") }));
  assert.equal(getLanguageSuggestion(new URL("https://example.com/404/"), "en", notFound, ["de"]), undefined);
});

test("detection integrates as a processed page script without replacing a site's Head", () => {
  const scripts = [];
  createLanguageDetectionIntegration("en").hooks["astro:config:setup"]({
    injectScript: (stage, code) => scripts.push({ stage, code }),
  });
  assert.equal(scripts[0].stage, "page");
  assert.match(scripts[0].code, /setupLanguageDetection\("en", \{\}\)/);
  assert.match(scripts[0].code, /scripts\/language-detection\.ts/);
});
