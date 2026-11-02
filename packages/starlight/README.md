# Linwood Starlight style

Shared Starlight components, content collection configuration, typography, and
Linwood styling used by the documentation sites.

```js
import starlight from "@astrojs/starlight";
import linwoodStarlight from "@linwooddev/starlight-style";

starlight({
  plugins: [linwoodStarlight()],
});
```

Use the shared content collection from `src/content.config.ts`:

```ts
export { collections } from "@linwooddev/starlight-style/content";
```

The `collections` export registers only Starlight's `docs` collection. Internationalization
is optional. Opt in to the native `i18n` collection with `createCollections(en)`;
this also validates custom keys while allowing partial translations:

```ts
import { createCollections } from "@linwooddev/starlight-style/content";
import en from "./content/i18n/en.json";

export const collections = createCollections(en);
```

Use `createCollections({})` to enable i18n without custom UI keys. Sites without
UI dictionaries can keep the default `collections` export and do not need an
`src/content/i18n/` directory or any translation helper calls.

The download component is available as
`@linwooddev/starlight-style/components/DownloadButton.astro`.

`DownloadButton` opens its target in a new tab. File downloads show
`/downloads/thank-you/` after a short delay by default. Override `after` to show
installation instructions, or pass `after={false}` to disable that redirect.
Root-relative destinations follow the current locale using Astro's i18n routing;
explicitly localized paths and external URLs are preserved.

Use `download={false}` for web apps and other ordinary links. This omits the
HTML download attribute and the post-download redirect regardless of `after`.

```astro
<DownloadButton title="Installer" href="/releases/app.exe" after="/downloads/post-windows/" />
<DownloadButton title="Archive" href="/releases/app.zip" after={false} />
<DownloadButton title="Web app" href="https://app.example.com" download={false} />
```

## Markdown

The plugin adds explicit heading IDs in Markdown and MDX (`## Heading {#id}`)
and GitHub's `:warning:`, `:white_check_mark:`, and `:x:` emoji replacements to
Starlight's default Sätteri pipeline. Existing processor features and plugins
are preserved. Sites using another Markdown processor keep their configuration.

Math is disabled by default. Opt in to math syntax, KaTeX rendering, and its
stylesheet and fonts with:

```js
starlight({
  plugins: [linwoodStarlight({ math: true })],
});
```

The site does not need its own KaTeX dependency, Markdown plugins, or MDX Vite
transform. UI translation collections are a separate opt-in.

## Landing pages

Use `Landing` in a Starlight splash page to opt into a wide content area,
responsive hero spacing, centered section headings, and a compact principles
list. The styles are loaded by the component and only affect pages using the
layout. Keep site colors and content in the consuming project.

```mdx
import Landing from "@linwooddev/starlight-style/components/Landing.astro";
import LandingFeature from "@linwooddev/starlight-style/components/LandingFeature.astro";
import screenshot from "../../assets/screenshot.png";

<Landing>
  <ul class="landing-principles" aria-label="At a glance">
    <li>Open source</li>
    <li>Available offline</li>
  </ul>

  <LandingFeature image={screenshot} alt="The app workspace">

    ## Make room for your ideas

    Describe the feature beside its screenshot.

  </LandingFeature>

  <div class="landing-heading">

    ## Explore the possibilities

    Introduce the next section of cards or links.

  </div>

  <p class="landing-community">Link to the project's community.</p>
</Landing>
```

`Landing` accepts standard HTML attributes, including an additional `class`.
`LandingFeature` requires an imported Astro image as `image` and descriptive
`alt` text. Pass `reverse` to put the image first on wide screens; the content
returns to copy-then-image order on phones. An optional imported `darkImage`
switches the screenshot with Starlight's theme. Images are optimized as
responsive WebP assets and loaded lazily.

## Translations and navigation

The plugin keeps root-relative documentation links in the selected language,
including hero actions, Markdown links, MDX cards, and fallback content. It only
rewrites links to pages in the site's `docs` content collection. External URLs,
explicitly localized paths, fragments, and static assets are preserved.
Page content stays in the site's normal Starlight/Crowdin files.

Use [Starlight's native i18n collection](https://starlight.astro.build/guides/i18n/)
for site UI strings. Keep dictionaries in `src/content/i18n/` and name them with
the configured BCP-47 `lang` tag (`en.json`, `pt-BR.json`, `zh-Hant.json`). Content
locale paths can differ (`pt-br/`, `zh-hant/`). Render strings with
`Astro.locals.t("key")`; Starlight supplies its built-in translations and fallback.

Use locale-independent slugs for internal sidebar links. Starlight automatically
reads translated page titles and `sidebar.label` frontmatter. Group headings and
intentional label overrides can reuse the native dictionaries:

```js
import linwoodStarlight from "@linwooddev/starlight-style";
import { createI18n } from "@linwooddev/starlight-style/translations";

const { config: i18n, getSidebarTranslatedLabel } = createI18n(
  new URL("./src/content/i18n/", import.meta.url),
);

starlight({
  ...i18n,
  plugins: [linwoodStarlight()],
  sidebar: [
    { ...getSidebarTranslatedLabel("Guides"), items: ["intro"] },
    { ...getSidebarTranslatedLabel("Nightly builds", "nightly"), slug: "nightly" },
  ],
});
```

`createI18n()` derives Starlight's locale list, native language names, lower-case
content paths, and text direction from the dictionaries. English is the root and
fallback language by default; pass `{ defaultLocale: "fr" }` as a second argument
to use another root language. Adding `de.json` enables `/de/` with native fallback
pages until content is translated. There is no separate language registry to
maintain. This helper is optional; sites can also configure Starlight themselves.

`createTranslations()` accepts either a directory URL (with a trailing slash)
or an object of dictionaries keyed by language tag. Directory loading reads
flat JSON string dictionaries at build time and ignores files starting with `_`.
`loadTranslations(directory)` is also available when the dictionaries themselves
are needed. Sidebar helpers return Starlight's native `translations` objects;
missing or empty labels fall back to the configured `label`.

The default Linwood footer uses `imprint` and `privacy_policy`, with English
defaults supplied by the plugin. The plugin's `translations` option remains
available for existing integrations; native site dictionaries take precedence.

Sidebar collapse and scroll state are preserved across full-page and Astro
ClientRouter navigation. The site can add `ClientRouter` in its Head component.
The plugin registers its route middleware automatically and supplies the
`Sidebar`, `MarkdownContent`, and `Footer` components. Override a component in
Starlight's `components` configuration when the site needs a custom version.
Wrap the shared component in that override to retain its behavior.
