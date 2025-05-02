import { notFound } from "next/navigation";
import { getRequestConfig } from "next-intl/server";

// Define supported locales
export const locales = ["en", "ar"];
export const defaultLocale = "en";

export default getRequestConfig(async ({ locale }) => {
  // Ensure locale is a string
  const localeString = locale || defaultLocale;

  // Validate that the incoming locale is valid
  if (!locales.includes(localeString)) {
    notFound();
  }

  // Load messages for the requested locale
  let messages;
  try {
    messages = (await import(`./messages/${localeString}.json`)).default;
  } catch (error) {
    console.error(`Error loading messages for locale ${localeString}`, error);
    notFound();
  }

  return {
    messages,
    // The configured locale
    locale: localeString,
  };
});
