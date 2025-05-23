import { getRequestConfig } from "next-intl/server";
import { locales, defaultLocale } from "./index";

export default getRequestConfig(async ({ locale }) => {
  // Validate that the incoming locale is valid
  if (!locale || !locales.includes(locale as any)) {
    locale = defaultLocale;
  }

  try {
    return {
      messages: (await import(`../messages/${locale}.json`)).default,
      locale: locale,
    };
  } catch (error) {
    console.error(`Error loading messages for locale ${locale}`, error);
    return {
      messages: {},
      locale: defaultLocale,
    };
  }
});
