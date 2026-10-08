import { defineRouteMiddleware } from "@astrojs/starlight/route-data";
import { getLinkLocalizer } from "./utils/localized-links";

export const onRequest = defineRouteMiddleware(async (context) => {
  const localize = await getLinkLocalizer(context.currentLocale);
  // Content collection types are supplied by the consuming site.
  const data = context.locals.starlightRoute.entry.data as {
    hero?: { actions?: Array<{ link: string }> };
  };
  for (const action of data.hero?.actions ?? []) {
    action.link = localize(action.link);
  }
});
