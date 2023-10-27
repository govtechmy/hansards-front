import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { parseCookies } from "./helpers";

type BaseURL = "api" | "app" | string;

/**
 * Base URL builder.
 * @param base "api" | "app"
 * @param {Record<string, string>} headers Additional headers
 * @returns Base of URL
 *
 * @example "api"   -> "https://[NEXT_PUBLIC_API_URL]/"
 * @example "app" -> "https://[NEXT_PUBLIC_APP_URL]/"
 */
const instance = (base: BaseURL, headers: Record<string, string> = {}) => {
  const urls: Record<BaseURL, string> = {
    api: process.env.NEXT_PUBLIC_API_URL,
    app: process.env.NEXT_PUBLIC_APP_URL,
    tinybird: process.env.NEXT_PUBLIC_TINYBIRD_URL,
  };
  const BROWSER_RUNTIME = typeof window === "object";

  const authorization = !BROWSER_RUNTIME
    ? process.env.NEXT_PUBLIC_AUTHORIZATION_TOKEN
    : parseCookies(document.cookie).rolling_token;

  const config: AxiosRequestConfig = {
    baseURL: urls[base] || base,
    headers: {
      Authorization: `Bearer ${authorization}`,
      ...headers,
    },
  };
  return axios.create(config);
};

/**
 * Universal GET helper function.
 * @param {string} route Endpoint URL
 * @param {Record<string, string>} params Queries
 * @param {"api" | "app"} base api | local
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
 * @param {"api" | "app"} base api | local
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
