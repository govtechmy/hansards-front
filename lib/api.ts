import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { clientEnv } from "src/config/env.client";
import { serverEnv } from "src/config/env.server";

type BaseURL = "api" | "app" | "api_backend" | string;

/**
 * Base URL builder.
 * @param base "api" | "app"
 * @param {Record<string, string>} headers Additional headers
 * @returns Base of URL
 *
 * @example "api" -> "https://[API_URL]/"
 * @example "api_backend" -> "http://localhost:8000/"
 * @example "app" -> "https://[NEXT_PUBLIC_APP_URL]/"
 */
const instance = (base: BaseURL, headers: Record<string, string> = {}) => {
  const urls: Record<BaseURL, string> = {
    api: serverEnv.API_URL,
    api_backend: serverEnv.API_URL,
    app: clientEnv.NEXT_PUBLIC_APP_URL,
    sejarah: clientEnv.NEXT_PUBLIC_SEJARAH_URL,
  };
  const BROWSER_RUNTIME = typeof window === "object";

  const authToken = serverEnv.API_AUTH_TOKEN;
  const config: AxiosRequestConfig = {
    baseURL: urls[base] || base,
    headers: {
      Authorization: !BROWSER_RUNTIME ? `Bearer ${authToken}` : null,
      ...headers,
    },
  };
  return axios.create(config);
};

/**
 * Universal GET helper function.
 * @param {string} route Endpoint URL
 * @param {Record<string, string>} params Queries
 * @param {"api" | "app"} base api | app
 * @returns {Promise<AxiosResponse>} Promised response
 */
export const get = (
  route: string,
  params?: Record<string, any>,
  base: BaseURL = "api"
): Promise<AxiosResponse> => {
  return new Promise((resolve, reject) => {
    instance(base)
      .get(route, { params })
      .then((response: AxiosResponse) => resolve(response))
      .catch(err => reject(err));
  });
};

/**
 * Universal POST helper function.
 * @param route Endpoint route
 * @param payload Body payload
 * @param {"api" | "app"} base api | app
 * @param {Record<string, string>} headers Additional headers
 * @returns {Promise<AxiosResponse>} Promised response
 */
export const post = (
  route: string,
  payload?: any,
  base: BaseURL = "api",
  headers: Record<string, string> = {}
): Promise<AxiosResponse> => {
  return new Promise((resolve, reject) => {
    instance(base, headers)
      .post(route, payload)
      .then((response: AxiosResponse) => resolve(response))
      .catch(err => reject(err));
  });
};
