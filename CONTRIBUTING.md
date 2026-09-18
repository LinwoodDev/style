# Contributing

Thank you for helping improve Linwood Style.

## Set up the workspace

You need Node.js 24 and the pnpm version declared in `package.json`.

```sh
pnpm install
pnpm dev
```

The development command starts the component showcase at
<http://localhost:4321>. Core styles live in `packages/web/scss`; update the
showcase in `packages/docs` when a visual component or utility changes.

## Before opening a pull request

Run the repository checks:

```sh
pnpm check
```

Keep changes focused, describe any user-visible behavior, and include before
and after screenshots for visual updates.

If a change affects a published package, add a Changeset:

```sh
pnpm changeset
```

Choose the smallest appropriate semantic version bump and explain the change
from a package user's perspective. The private `docs` package and the currently
ignored Starlight package do not require release notes.

## Reporting security issues

Do not open a public issue for a suspected vulnerability. Follow the private
reporting guidance in [SECURITY.md](SECURITY.md).
