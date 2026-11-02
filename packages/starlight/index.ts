import type { StarlightPlugin } from "@astrojs/starlight/types";
import type { TranslationDictionaries } from "./translations";
import { uiStrings } from "./ui-strings";
import { createMarkdownIntegration, getMathStyles } from "./utils/markdown";
import { createLanguageDetectionIntegration } from "./utils/language-detection";

export interface Options {
  /** Suggest the visitor's preferred language on unprefixed pages. Disabled by default. */
  detectLanguage?: boolean;
  /** Enable math syntax and KaTeX rendering and styles. Disabled by default. */
  math?: boolean;
  /** UI dictionaries keyed by BCP-47 language tag, for example Crowdin JSON files. */
  translations?: TranslationDictionaries;
}

export default function createPlugin(options: Options = {}): StarlightPlugin {
  return {
    name: "@linwooddev/starlight-style",
    hooks: {
      "i18n:setup": ({ injectTranslations }) => {
        injectTranslations(uiStrings);
        if (options.translations) injectTranslations(options.translations);
      },
      "config:setup": ({ config, updateConfig, addRouteMiddleware, addIntegration, useTranslations }) => {
        addIntegration(createMarkdownIntegration({ math: options.math }));
        if (options.detectLanguage && config.locales?.root && Object.keys(config.locales).length > 1) {
          const labels = Object.fromEntries(Object.entries(config.locales).flatMap(([code, locale]) => {
            if (!locale) return [];
            const lang = locale.lang || code;
            const t = useTranslations(lang);
            return [[lang, { title: t("languageSelect.accessibleLabel"), dismiss: t("search.cancelLabel") }]];
          }));
          addIntegration(createLanguageDetectionIntegration(config.locales.root.lang, labels));
        }
        addRouteMiddleware({
          entrypoint: "@linwooddev/starlight-style/route-middleware",
          order: "post",
        });
        updateConfig({
          customCss: [
            "@fontsource-variable/inter",
            "@linwooddev/starlight-style/styles/linwood-style.scss",
            ...getMathStyles(options.math),
            ...(options.detectLanguage && config.locales?.root && Object.keys(config.locales).length > 1
              ? ["@linwooddev/starlight-style/styles/language-suggestion.scss"] : []),
            ...(config.customCss ?? []),
          ],
          components: {
            Search: "@linwooddev/starlight-style/components/Search.astro",
            ContentPanel: "@linwooddev/starlight-style/components/ContentPanel.astro",
            Sidebar: "@linwooddev/starlight-style/components/Sidebar.astro",
            MarkdownContent: "@linwooddev/starlight-style/components/MarkdownContent.astro",
            Footer: "@linwooddev/starlight-style/components/Footer.astro",
            ...config.components,
          },
        });
      },
    },
  };
}
