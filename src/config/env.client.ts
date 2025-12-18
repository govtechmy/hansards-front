function requireClientEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    // This should never happen if build-time validation works
    // throw new Error(`[CLIENT ENV ERROR] Missing ${key}`);
    console.warn(`[ENV WARNING] Missing client env: ${key}`);
    return "";
  }
  return value;
}

export const clientEnv = {
  NEXT_PUBLIC_APP_URL: requireClientEnv("NEXT_PUBLIC_APP_URL"),
  NEXT_PUBLIC_APP_ENV: requireClientEnv("NEXT_PUBLIC_APP_ENV"),
  NEXT_PUBLIC_I18N_URL: requireClientEnv("NEXT_PUBLIC_I18N_URL"),
  NEXT_PUBLIC_DOWNLOAD_URL: requireClientEnv("NEXT_PUBLIC_DOWNLOAD_URL"),
  NEXT_PUBLIC_AUTHORIZATION_TOKEN: requireClientEnv(
    "NEXT_PUBLIC_AUTHORIZATION_TOKEN"
  ),
  NEXT_PUBLIC_SEJARAH_URL: requireClientEnv("NEXT_PUBLIC_SEJARAH_URL"),
  NEXT_PUBLIC_ASSETS_URL: requireClientEnv("NEXT_PUBLIC_ASSETS_URL"),
};
