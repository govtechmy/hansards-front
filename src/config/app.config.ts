export const appConfig = {
  appName: "hansard.parlimen.gov.my",
  meta: {
    author: "Parliament of Malaysia",
    theme: "B49B1A",
    keywords: "hansard parlimen malaysia",
    domain: "hansard.parlimen.gov.my",
    url: process.env.NEXT_PUBLIC_APP_URL,
    image: `${process.env.NEXT_PUBLIC_APP_URL}/static/images/og_{{lang}}.png`,
  },
  assetsUrl: process.env.NEXT_PUBLIC_ASSETS_URL!,
  downloadUrl: process.env.NEXT_PUBLIC_DOWNLOAD_URL!,
};
