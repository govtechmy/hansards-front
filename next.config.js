const { i18n } = require("./next-i18next.config");

/**
 * Plugins / Constants
 */
const analyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE ?? false,
});
const pwa = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
});

/**
 * Next Config
 * @type {import('next').NextConfig}
 * */
const nextConfig = {
  i18n,
  output: process.env.NEXT_OUTPUT,
  reactStrictMode: true,
  swcMinify: true,
  env: {
    NEXT_PUBLIC_DOWNLOAD_URL: process.env.NEXT_PUBLIC_DOWNLOAD_URL,
  },
  publicRuntimeConfig: {
    APP_NAME: "hansard.parlimen.gov.my",
    META_AUTHOR: "Parliament of Malaysia",
    META_THEME: "B49B1A",
    META_KEYWORDS: "hansard parlimen malaysia",
    META_DOMAIN: "hansard.parlimen.gov.my",
    DOWNLOAD_URL: process.env.NEXT_PUBLIC_DOWNLOAD_URL,
    META_URL: process.env.NEXT_PUBLIC_APP_URL,
    META_IMAGE: `${process.env.NEXT_PUBLIC_APP_URL}/static/images/og_{{lang}}.png`,
  },
  webpack: config => {
    config.module.rules.push({
      test: /components|hooks\/index.ts/i,
      sideEffects: false,
    });
    return config;
  },
  async redirects() {
    return [
      {
        source: "/katalog",
        destination: "/katalog/dewan-rakyat",
        permanent: true,
      },
      {
        source: "/kehadiran",
        destination: "/kehadiran/dewan-rakyat",
        permanent: true,
      },
    ];
  },
};

module.exports = () => {
  // Build-time visibility check for public envs (remove after verification)
  console.log(
    "[env-check] NEXT_PUBLIC_APP_URL:",
    process.env.NEXT_PUBLIC_APP_URL
  );
  console.log(
    "[env-check] NEXT_PUBLIC_APP_ENV:",
    process.env.NEXT_PUBLIC_APP_ENV
  );
  console.log(
    "[env-check] NEXT_PUBLIC_I18N_URL:",
    process.env.NEXT_PUBLIC_I18N_URL
  );
  console.log(
    "[env-check] NEXT_PUBLIC_DOWNLOAD_URL:",
    process.env.NEXT_PUBLIC_DOWNLOAD_URL
  );
  console.log(
    "[env-check] NEXT_PUBLIC_SEJARAH_URL:",
    process.env.NEXT_PUBLIC_SEJARAH_URL
  );
  console.log(
    "[env-check] NEXT_PUBLIC_TILESERVER_URL:",
    process.env.NEXT_PUBLIC_TILESERVER_URL
  );
  console.log(
    "[env-check] NEXT_PUBLIC_GA_TAG:",
    process.env.NEXT_PUBLIC_GA_TAG
  );
  console.log(
    "[env-check] NEXT_PUBLIC_ASSETS_URL:",
    process.env.NEXT_PUBLIC_ASSETS_URL
  );
  console.log("[env-check] API_URL:", process.env.API_URL);
  console.log("[env-check] API_AUTH_TOKEN:", process.env.API_AUTH_TOKEN);
  console.log("[env-check] REVALIDATE_TOKEN:", process.env.REVALIDATE_TOKEN);
  console.log("[env-check] AUTH_TOKEN:", process.env.AUTH_TOKEN);
  console.log(
    "[env-check] CLOUDFLARE_APP_URL:",
    process.env.CLOUDFLARE_APP_URL
  );
  console.log(
    "[env-check] CLOUDFLARE_ZONE_ID:",
    process.env.CLOUDFLARE_ZONE_ID
  );
  console.log("[env-check] GET_TOKEN:", process.env.GET_TOKEN);
  console.log("[env-check] POST_TOKEN:", process.env.POST_TOKEN);
  console.log("[env-check] GET_COUNTS:", process.env.GET_COUNTS);
  console.log("[env-check] POST_VIEW:", process.env.POST_VIEW);
  console.log("[env-check] POST_SHARE:", process.env.POST_SHARE);
  console.log("[env-check] POST_DL:", process.env.POST_DL);
  console.log(
    "[env-check] ENABLE_S3_FALLBACK:",
    process.env.ENABLE_S3_FALLBACK
  );
  console.log("[env-check] ANALYZE:", process.env.ANALYZE);
  console.log("[env-check] NEXT_OUTPUT:", process.env.NEXT_OUTPUT);
  const plugins = [pwa]; // add analyzer here later
  return plugins.reduce((acc, next) => next(acc), nextConfig);
};
