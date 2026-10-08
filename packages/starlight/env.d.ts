declare namespace App {
  type StarlightLocals = import("@astrojs/starlight").StarlightLocals;
  interface Locals extends StarlightLocals {}
}

declare namespace StarlightApp {
  type UIStrings = typeof import("./ui-strings").uiStrings.en;
  interface I18n extends UIStrings {}
}
