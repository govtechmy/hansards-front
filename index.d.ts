declare namespace NodeJS {
  export interface ProcessEnv {
    APP_URL: string;
    APP_ENV: string;
    NEXT_PUBLIC_APP_URL: string;
    NEXT_PUBLIC_APP_ENV: string;
    NEXT_PUBLIC_API_URL: string;
    NEXT_PUBLIC_I18N_URL: string;
    NEXT_PUBLIC_DOWNLOAD_URL: string;
    NEXT_PUBLIC_SEJARAH_URL: string;
    NEXT_PUBLIC_AUTHORIZATION_TOKEN: string;

    TINYBIRD_API: string;
    GET_TOKEN: string;
    POST_TOKEN: string;
    GET_COUNTS: string;
    POST_VIEW: string;
    POST_SHARE: string;
    POST_DL: string;

    REVALIDATE_TOKEN: string;
    AUTH_TOKEN: string;
    ANALYZE: boolean;

    NEXT_PUBLIC_TILESERVER_URL: string;
    NEXT_PUBLIC_GA_TAG: string;
  }
}

declare module "chartjs-plugin-crosshair" {
  export const CrosshairPlugin: any;
  export const Interpolate: any;

  export interface InteractionModeMap {
    interpolate: Function;
  }
}

// canvas2svg mock typings
declare module "canvas2svg" {
  export default (width: number, height: number) => any;
  getSerializedSvg();
}

declare module "geojson-bbox" {
  export default function (
    geojson: GeoJSONObject
  ): [number, number, number, number] {}
}

declare module "remarkable-react" {
  export default any;
}
