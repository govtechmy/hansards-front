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
  const plugins = [pwa]; // add analyzer here later
  return plugins.reduce((acc, next) => next(acc), nextConfig);
};
