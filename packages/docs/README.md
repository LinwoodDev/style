# Linwood Style showcase

This Astro site powers [style.linwood.dev](https://style.linwood.dev). It is a
visual reference for the components and utilities provided by
[`@linwooddev/style`](../web).

The single-page reference covers installation, typography, buttons, cards,
forms, responsive layout helpers, Sass configuration, and runtime color tokens.

## Develop locally

Run these commands from the repository root:

```sh
pnpm install
pnpm dev
```

The site is then available at <http://localhost:4321>.

## Validate and build

```sh
pnpm check
```

The production output is written to `packages/docs/dist/`. Deployment is
handled by the repository's `deploy.yml` GitHub Actions workflow after changes
reach the `main` branch.
