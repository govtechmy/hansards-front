const I18NextHttpBackend = require("i18next-http-backend/cjs");

const namespaces = [
  "catalogue",
  "common",
  "error",
  "home",
  "kehadiran",
  "sejarah",
];

/** @type {import('next-i18next').UserConfig} */
const defineConfig = (namespace, autoloadNs) => {
  return {
    i18n: {
      defaultLocale: "ms-MY",
      locales: ["en-GB", "ms-MY"],
      backend: {
        loadPath: `${process.env.I18N_URL}/${process.env.APP_ENV}/{{lng}}/{{ns}}.json`,
        crossDomain: true,
        allowMultiLoading: true,
      },
    },
    debug: false,
    ns: namespace,
    autoloadNs: autoloadNs,
    load: "currentOnly",
    preload: ["en-GB", "ms-MY"],
    serializeConfig: false,
    reloadOnPrerender: true,
    use: [I18NextHttpBackend],
  };
};

module.exports = defineConfig(namespaces, ["common"]);
