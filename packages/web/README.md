# Linwood Style Web

This is the web package for Linwood Style. It is a pure (S)CSS package that can be used to style web pages.

Click [here](https://style.linwood.dev) to see a preview of the style.

## Installation

```bash
npm install @linwooddev/style
```

## Usage

```scss
@use '@linwooddev/style';
```

Use `@use with` to customize the style.

```scss
@use '@linwooddev/style' with (
  $primary-color: red
);
```

Click [here](https://github.com/LinwoodDev/style/blob/main/packages/web/scss/_vars.scss) to see all the variables that can be customized.
