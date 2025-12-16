const requiredServerEnvs = [
  "API_URL",
  "REVALIDATE_TOKEN",
  "AUTH_TOKEN",
  "TINYBIRD_API",
  "POST_TOKEN",
  "GET_TOKEN",
  "GET_COUNTS",
  "POST_VIEW",
  "POST_SHARE",
  "POST_DL",
  "API_AUTH_TOKEN",
] as const;

requiredServerEnvs.forEach(key => {
  if (!process.env[key]) {
    throw new Error(`[ENV ERROR] Missing server env: ${key}`);
  }
});

export const serverEnv = {
  apiUrl: process.env.API_URL!,
  revalidateToken: process.env.REVALIDATE_TOKEN!,
  authToken: process.env.AUTH_TOKEN!,
  tinybirdApi: process.env.TINYBIRD_API!,
  postToken: process.env.POST_TOKEN!,
  getToken: process.env.GET_TOKEN!,
  getCounts: process.env.GET_COUNTS!,
  postView: process.env.POST_VIEW!,
  postShare: process.env.POST_SHARE!,
  postDownload: process.env.POST_DL!,
  apiAuthToken: process.env.API_AUTH_TOKEN!,
};
