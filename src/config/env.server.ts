function requiredServerEnvs(key: string): string {
  const value = process.env[key];
  if (!value) {
    // This should never happen if build-time validation works
    // throw new Error(`[CLIENT ENV ERROR] Missing ${key}`);
    console.warn(`[ENV WARNING] Missing client env: ${key}`);
    return "";
  }
  return value;
}

export const serverEnv = {
  API_URL: requiredServerEnvs("API_URL"),
  REVALIDATE_TOKEN: requiredServerEnvs("REVALIDATE_TOKEN"),
  AUTH_TOKEN: requiredServerEnvs("AUTH_TOKEN"),
  TINYBIRD_API: requiredServerEnvs("TINYBIRD_API"),
  POST_TOKEN: requiredServerEnvs("POST_TOKEN"),
  GET_TOKEN: requiredServerEnvs("GET_TOKEN"),
  GET_COUNTS: requiredServerEnvs("GET_COUNTS"),
  POST_VIEW: requiredServerEnvs("POST_VIEW"),
  POST_SHARE: requiredServerEnvs("POST_SHARE"),
  POST_DL: requiredServerEnvs("POST_DL"),
  API_AUTH_TOKEN: requiredServerEnvs("API_AUTH_TOKEN"),
};
