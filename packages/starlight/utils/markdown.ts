import { createRequire } from "node:module";
import type { AstroIntegration } from "astro";
import { isSatteriProcessor, type SatteriProcessorOptions } from "@astrojs/markdown-satteri";
import katex from "katex";

type MdastPlugin = NonNullable<SatteriProcessorOptions["mdastPlugins"]>[number];

export const mdxHeadingAttributes = {
  name: "mdx-heading-attributes",
  enforce: "pre" as const,
  transform(code: string, id: string) {
    if (!id.split("?", 1)[0].endsWith(".mdx")) return;
    const transformed = code.replace(
      /^(#{1,6})[ \t]+(.+?)[ \t]+\\?\{#([\w-]+)\\?\}[ \t]*$/gm,
      (_, hashes: string, heading: string, headingId: string) =>
        `<h${hashes.length} id="${headingId}">${heading}</h${hashes.length}>`,
    );
    if (transformed === code) return;
    return { code: transformed, map: null };
  },
};

const renderMath = (value: string, displayMode = false) =>
  katex.renderToString(value, { displayMode, throwOnError: false });

export const renderMathPlugin = {
  name: "render-math",
  inlineMath(node) {
    return { rawHtml: renderMath(node.value) };
  },
  math(node) {
    return { rawHtml: renderMath(node.value, true) };
  },
} satisfies MdastPlugin;

const githubEmoji = {
  warning: "⚠️",
  white_check_mark: "✅",
  x: "❌",
};

export const renderGithubEmojiPlugin = {
  name: "render-github-emoji",
  text(node, context) {
    const value = node.value.replace(
      /:(warning|white_check_mark|x):/g,
      (_, name: keyof typeof githubEmoji) => githubEmoji[name],
    );
    if (value !== node.value) context.replaceNode(node, { type: "text", value });
  },
} satisfies MdastPlugin;

/** KaTeX's stylesheet and fonts are resolved from this package, not the consuming site. */
export function getMathStyles(math = false): string[] {
  return math ? [createRequire(import.meta.url).resolve("katex/dist/katex.min.css")] : [];
}

export function createMarkdownIntegration({ math = false } = {}): AstroIntegration {
  return {
    name: "@linwooddev/starlight-style/markdown",
    hooks: {
      "astro:config:setup": ({ config, updateConfig }) => {
        const processor = config.markdown.processor;
        // Extend the current pipeline so Starlight's own transforms and site plugins survive.
        if (isSatteriProcessor(processor)) {
          processor.options.features.headingAttributes = true;
          processor.options.mdastPlugins.push(renderGithubEmojiPlugin);
          if (math) {
            processor.options.features.math = true;
            processor.options.mdastPlugins.push(renderMathPlugin);
          }
        }
        updateConfig({ vite: { plugins: [mdxHeadingAttributes] } });
      },
    },
  };
}
