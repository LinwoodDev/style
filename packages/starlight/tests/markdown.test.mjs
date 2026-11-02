import assert from "node:assert/strict";
import test from "node:test";
import { satteri, createSatteriMarkdownProcessor } from "@astrojs/markdown-satteri";
import {
  createMarkdownIntegration,
  getMathStyles,
  mdxHeadingAttributes,
  renderGithubEmojiPlugin,
  renderMathPlugin,
} from "../utils/markdown.ts";

function configure(processor, options) {
  const updates = [];
  createMarkdownIntegration(options).hooks["astro:config:setup"]({
    config: { markdown: { processor } },
    updateConfig: (config) => updates.push(config),
  });
  return updates;
}

test("default Markdown preserves existing plugins and leaves math disabled", () => {
  const custom = { name: "site-plugin" };
  const processor = satteri({ features: { directive: true }, mdastPlugins: [custom] });
  const [update] = configure(processor);
  assert.deepEqual(processor.options.features, { directive: true, headingAttributes: true });
  assert.deepEqual(processor.options.mdastPlugins, [custom, renderGithubEmojiPlugin]);
  assert.equal(update.vite.plugins[0], mdxHeadingAttributes);
  assert.deepEqual(getMathStyles(), []);
});

test("math is enabled only when requested, including KaTeX styles", () => {
  const processor = satteri();
  configure(processor, { math: true });
  assert.equal(processor.options.features.math, true);
  assert.ok(processor.options.mdastPlugins.includes(renderMathPlugin));
  assert.match(getMathStyles(true)[0], /katex[\/]dist[\/]katex\.min\.css$/);
  assert.match(renderMathPlugin.inlineMath({ value: "x^2" }).rawHtml, /class="katex"/);
  assert.match(renderMathPlugin.math({ value: "x^2" }).rawHtml, /class="katex-display"/);
  assert.doesNotThrow(() => renderMathPlugin.inlineMath({ value: "\\frac{" }));
});

test("custom Markdown processors are preserved", () => {
  const processor = { name: "custom", options: { unchanged: true } };
  const original = structuredClone(processor);
  configure(processor);
  assert.deepEqual(processor, original);
});

test("MDX heading IDs support escaped braces and ignore unrelated files", () => {
  const input = "# Heading {#heading-id}\n## Escaped \\{#escaped\\}\n### Plain heading";
  assert.equal(mdxHeadingAttributes.transform(input, "/page.md"), undefined);
  assert.equal(mdxHeadingAttributes.transform("# Plain heading", "/page.mdx"), undefined);
  assert.deepEqual(mdxHeadingAttributes.transform(input, "/page.mdx?astro"), {
    code: '<h1 id="heading-id">Heading</h1>\n<h2 id="escaped">Escaped</h2>\n### Plain heading',
    map: null,
  });
});

test("GitHub emoji replacements leave ordinary text unchanged", () => {
  const replacements = [];
  const context = { replaceNode: (_old, replacement) => replacements.push(replacement) };
  renderGithubEmojiPlugin.text({ value: ":warning: :white_check_mark: :x: :unknown:" }, context);
  assert.deepEqual(replacements, [{ type: "text", value: "⚠️ ✅ ❌ :unknown:" }]);
  renderGithubEmojiPlugin.text({ value: "No emoji" }, context);
  assert.equal(replacements.length, 1);
});

test("Markdown rendering applies heading IDs and emoji with math opt-in", async () => {
  const source = "## Heading {#custom-id}\n\n:warning: `:x:` $x^2$";
  for (const math of [false, true]) {
    const processor = satteri();
    configure(processor, { math });
    const renderer = await createSatteriMarkdownProcessor({
      ...processor.options,
      syntaxHighlight: false,
    });
    const { code } = await renderer.render(source);
    assert.match(code, /id="custom-id"/);
    assert.match(code, /⚠️/);
    assert.match(code, /<code>:x:<\/code>/);
    assert.equal(code.includes('class="katex"'), math);
    assert.equal(code.includes("$x^2$"), !math);
  }
});
