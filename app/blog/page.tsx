import { redirect } from "next/navigation";

// This will catch all requests to /blog and redirect to the default locale
export default function BlogRootCatchAll() {
  // You can change 'en' to your default locale
  const defaultLocale = "en";

  // Redirect to the proper locale-based URL
  redirect(`/${defaultLocale}/blog`);
}
