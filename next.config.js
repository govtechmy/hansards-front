const { i18n } = require("./next-i18next.config");

/**
 * Plugins / Constants
 */
const analyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});
const pwa = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
  buildExcludes: [/dynamic-css-manifest\.json$/],
});

/**
 * Next Config
 * @type {import('next').NextConfig}
 * */
const nextConfig = {
  i18n,
  reactStrictMode: true,

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

module.exports = analyzer(pwa(nextConfig));
