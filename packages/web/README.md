# `@linwooddev/style`

A lightweight, customizable SCSS design system for Linwood web projects. It
ships SCSS source and compiled CSS, with no client-side JavaScript dependency.

[Browse the live component showcase](https://style.linwood.dev)

## Installation

```sh
pnpm add @linwooddev/style
```

## Usage

```scss
@use "@linwooddev/style";
```

Customize the theme with Sass's module configuration:

```scss
@use "@linwooddev/style" with (
  $color-primary: #7c5cff,
  $color-background: #18181b,
  $color-background-text: #e4e4e7,
  $border-radius: 0.75rem
);
```

The main configuration options include colors, breakpoints, spacing, sizing,
typography, border radius, and the `$enable-default-styling` switch. See
[`scss/_vars.scss`](scss/_vars.scss) for the complete list and defaults.

### Mixins only

Reusable button, input, and typography mixins are available from the mixin
entry point:

```scss
@use "@linwooddev/style/scss/mixins.scss" as linwood;

.my-action {
  @include linwood.button-base;
}
```

### Plain CSS

Bundlers that understand a package's `style` field can load the compiled CSS
directly:

```js
import "@linwooddev/style/css/main.css";
```

## Accessibility defaults

Linwood Style keeps native control behavior and provides visible keyboard focus,
44px minimum control heights, selectable read-only fields, reduced-motion
support, and forced-colors borders. Disabled controls remain discoverable to
pointer users instead of suppressing pointer events.

Responsive `.show-*` and `.hide-*` utilities use container queries. Place them
inside a `.container` or `.container-{breakpoint}` element, or establish your
own ancestor with `container-type: inline-size`.

## Development

From the repository root, use `pnpm build` to compile the package or
`pnpm --filter @linwooddev/style watch` while editing SCSS.

This package is released under the [MIT License](../../LICENSE).
