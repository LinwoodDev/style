import type { StarlightPlugin } from "@astrojs/starlight/types";
import type { TranslationDictionaries } from "./translations";
import { uiStrings } from "./ui-strings";

export interface Options {
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
      "config:setup": ({ config, updateConfig, addRouteMiddleware }) => {
        addRouteMiddleware({
          entrypoint: "@linwooddev/starlight-style/route-middleware",
          order: "post",
        });
        updateConfig({
          customCss: [
            "@fontsource-variable/inter",
            "@linwooddev/starlight-style/styles/linwood-style.scss",
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
