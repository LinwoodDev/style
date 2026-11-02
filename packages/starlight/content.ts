import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { docsLoader, i18nLoader } from "@astrojs/starlight/loaders";
import { docsSchema, i18nSchema } from "@astrojs/starlight/schema";

/** Default sites only register documentation content. */
export const collections = {
  docs: defineCollection({ loader: docsLoader(), schema: docsSchema() }),
};

/** Opt into Starlight i18n, allowing partial translations of the default UI dictionary. */
export function createCollections(defaultTranslations: Record<string, string>) {
  return {
    ...collections,
    i18n: defineCollection({
      loader: i18nLoader(),
      schema: i18nSchema({
        extend: z.object(
          Object.fromEntries(
            Object.keys(defaultTranslations).map((key) => [key, z.string().optional()]),
          ),
        ),
      }),
    }),
  };
}
