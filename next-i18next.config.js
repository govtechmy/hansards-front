const I18NextHttpBackend = require("i18next-http-backend/cjs");
const path = require("path");

const namespaces = [
  "catalogue",
  "common",
  "demografi",
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
    },
    backend: {
      loadPath: "/locales/{{lng}}/{{ns}}.json",
      allowMultiLoading: true,
    },
    debug: false,
    ns: namespace,
    autoloadNs: autoloadNs,
    load: "currentOnly",
    preload: ["ms-MY", "en-GB"],
    serializeConfig: false,
    reloadOnPrerender: true,
    // Use HTTP backend only in the browser for dynamic loading; SSR uses FS via localePath
    use: typeof window === "undefined" ? [] : [I18NextHttpBackend],
    localePath: path.resolve("./public/locales"),
  };
};

module.exports = defineConfig(namespaces, ["common"]);
