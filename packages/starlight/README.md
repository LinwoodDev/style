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

Pass existing UI dictionaries keyed by BCP-47 language tag to the plugin:

```js
import english from "./src/translations/en.json";
import french from "./src/translations/fr.json";
import linwoodStarlight from "@linwooddev/starlight-style";
import { createTranslations } from "@linwooddev/starlight-style/translations";

const translations = { en: english, fr: french };
const { getSidebarTranslatedLabel } = createTranslations(translations);

starlight({
  plugins: [linwoodStarlight({ translations })],
  sidebar: [
    { ...getSidebarTranslatedLabel("Guides"), items: ["intro"] },
    { ...getSidebarTranslatedLabel("Nightly builds", "nightly"), link: "/nightly/" },
  ],
});
```

The dictionaries are injected with Starlight's `i18n:setup` hook and are available
through `Astro.locals.t()`, with Starlight's normal translation fallback.
The default Linwood footer uses `imprint` and `privacy_policy` from these
dictionaries, with English defaults supplied by the plugin.

Sidebar collapse and scroll state are preserved across full-page and Astro
ClientRouter navigation. The site can add `ClientRouter` in its Head component.
The plugin registers its route middleware automatically and supplies the
`Sidebar`, `MarkdownContent`, and `Footer` components. Override a component in
Starlight's `components` configuration when the site needs a custom version.
Wrap the shared component in that override to retain its behavior.
