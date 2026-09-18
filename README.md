# Linwood Style

Linwood Style is a small, customizable SCSS design system used by Linwood web
projects. It provides theme tokens, typography, layout utilities, form controls,
buttons, cards, navigation, and reusable mixins without requiring a JavaScript
runtime.

[View the component showcase](https://style.linwood.dev)

## Packages

| Package | Purpose |
| --- | --- |
| [`@linwooddev/style`](packages/web) | Core SCSS styles, variables, utilities, and mixins |
| [`@linwooddev/starlight-style`](packages/starlight) | Shared Astro Starlight components and Linwood styling |
| [`docs`](packages/docs) | Source for the public component showcase |

## Use the SCSS package

Install the package with your preferred package manager:

```sh
pnpm add @linwooddev/style
```

Load the default theme from your SCSS entry point:

```scss
@use "@linwooddev/style";
```

Sass variables can be configured before the stylesheet is evaluated:

```scss
@use "@linwooddev/style" with (
  $color-primary: #7c5cff,
  $color-background: #18181b,
  $border-radius: 0.75rem,
  $enable-default-styling: true
);
```

Set `$enable-default-styling: false` when you only want the class-based API and
do not want Linwood Style to apply rules to plain HTML elements.

## Development

This is a pnpm workspace and requires Node.js 24.

```sh
pnpm install
pnpm dev       # start the showcase at http://localhost:4321
pnpm build     # build every package that has a build script
pnpm check     # run package checks and a production docs build
```

Package versions and releases are managed with Changesets. See
[CONTRIBUTING.md](CONTRIBUTING.md) before submitting a pull request.

## License

Linwood Style is available under the [MIT License](LICENSE).
