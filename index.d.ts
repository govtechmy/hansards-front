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

    NEXT_PUBLIC_TINYBIRD_URL: string;
    NEXT_PUBLIC_TINYBIRD_AUTH: string;
    NEXT_PUBLIC_GET_TOKEN: string;
    NEXT_PUBLIC_POST_TOKEN: string;
    NEXT_PUBLIC_GET_COUNTS: string;
    NEXT_PUBLIC_POST_VIEW: string;
    NEXT_PUBLIC_POST_SHARE: string;
    NEXT_PUBLIC_POST_DL: string;

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
  export default function (geojson: GeoJSONObject): [number, number, number, number] {}
}
