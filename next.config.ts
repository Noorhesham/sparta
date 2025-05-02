import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

// Use the main i18n configuration file
const withNextIntl = createNextIntlPlugin("./i18n.ts");

const nextConfig: NextConfig = {
  typescript: { ignoreBuildErrors: true },
  images: { unoptimized: true },
};

export default withNextIntl(nextConfig);
