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
