export const locales = ["en", "ar"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale = "en" as const;

export const localePrefix = "as-needed";
export type LocalePrefix = "as-needed" | "always" | "never";

// Use the default messages format or a custom one
export type Messages = typeof import("../messages/en.json");

// Create a type for the page params
export type PageParams = {
  locale: Locale;
};
