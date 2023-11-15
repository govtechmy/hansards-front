const I18NextHttpBackend = require("i18next-http-backend/cjs");

const namespaces = [
  "catalogue",
  "common",
  "election",
  "enum",
  "error",
  "hansard",
  "home",
  "kehadiran",
  "party",
  "sejarah",
];

/** @type {import('next-i18next').UserConfig} */
const defineConfig = (namespace, autoloadNs) => {
  return {
    i18n: {
      defaultLocale: "ms-MY",
      locales: ["ms-MY", "en-GB"],
      backend: {
        loadPath: `${process.env.NEXT_PUBLIC_I18N_URL}/${
          process.env.NEXT_PUBLIC_APP_ENV === "production"
            ? "production"
            : "staging"
        }/{{lng}}/{{ns}}.json`,
        crossDomain: true,
        allowMultiLoading: true,
      },
    },
    debug: false,
    ns: namespace,
    autoloadNs: autoloadNs,
    load: "currentOnly",
    preload: ["ms-MY", "en-GB"],
    serializeConfig: false,
    reloadOnPrerender: true,
    use: [I18NextHttpBackend],
  };
};

module.exports = defineConfig(namespaces, ["common"]);
