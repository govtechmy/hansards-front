const requiredClientEnvs = [
  "NEXT_PUBLIC_APP_URL",
  "NEXT_PUBLIC_ASSETS_URL",
  "NEXT_PUBLIC_DOWNLOAD_URL",
  "NEXT_PUBLIC_I18N_URL",
  "NEXT_PUBLIC_APP_ENV",
  "NEXT_PUBLIC_AUTHORIZATION_TOKEN",
  "NEXT_PUBLIC_SEJARAH_URL",
] as const;

requiredClientEnvs.forEach(key => {
  if (!process.env[key]) {
    throw new Error(`[ENV ERROR] Missing client env: ${key}`);
  }
});

export const clientEnv = {
  appUrl: process.env.NEXT_PUBLIC_APP_URL!,
  assetsUrl: process.env.NEXT_PUBLIC_ASSETS_URL!,
  downloadUrl: process.env.NEXT_PUBLIC_DOWNLOAD_URL!,
  i18nUrl: process.env.NEXT_PUBLIC_I18N_URL!,
  appEnv: process.env.NEXT_PUBLIC_APP_ENV!,
  authorizationToken: process.env.NEXT_PUBLIC_AUTHORIZATION_TOKEN!,
  sejarahUrl: process.env.NEXT_PUBLIC_SEJARAH_URL!,
};
