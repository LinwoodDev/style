import type { AstroIntegration } from "astro";
import { fileURLToPath } from "node:url";

export interface LanguageSuggestionLabels {
  title: string;
  dismiss: string;
}

export function createLanguageDetectionIntegration(
  rootLanguage: string,
  labels: Record<string, LanguageSuggestionLabels> = {},
): AstroIntegration {
  return {
    name: "@linwooddev/starlight-style/language-detection",
    hooks: {
      "astro:config:setup": ({ injectScript }) => {
        const script = fileURLToPath(new URL("../scripts/language-detection.ts", import.meta.url));
        injectScript("page", `import { setupLanguageDetection } from ${JSON.stringify(script)};
setupLanguageDetection(${JSON.stringify(rootLanguage)}, ${JSON.stringify(labels)});`);
      },
    },
  };
}
