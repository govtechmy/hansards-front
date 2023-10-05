/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_APP_URL || "https://hansard.parlimen.gov.my",
  generateIndexSitemap: true,
  generateRobotsTxt: true,
  priority: 0.7,
  autoLastmod: true,
  outDir: "public",
  exclude: ["/404", "/en-GB/404", "500", "/en-GB/500"],
};
