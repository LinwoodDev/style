import type { AstroIntegration } from "astro";
import { fileURLToPath } from "node:url";

export default function LinwoodStyleIntegration(): AstroIntegration {
  return {
    name: "linwood-style-astro",
    hooks: {
      "astro:config:setup": async ({ config, updateConfig, injectScript }) => {
        injectScript(
          "page-ssr",
          `import "linwood-style-astro/base.css";`
        );
      },
    },
  };
}
