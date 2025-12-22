declare namespace NodeJS {
  export interface ProcessEnv {
    APP_URL: string;
    APP_ENV: string;
    NEXT_PUBLIC_APP_URL: string;
    NEXT_PUBLIC_ASSETS_URL: string;
    NEXT_PUBLIC_APP_ENV: string;
    NEXT_PUBLIC_DOWNLOAD_URL: string;
    NEXT_PUBLIC_SEJARAH_URL: string;
    API_AUTH_TOKEN: string;
    API_URL: string;
    CLOUDFLARE_APP_URL: string;
    CLOUDFLARE_ZONE_ID: string;
    ASSETS_URL: string;

    GET_TOKEN: string;
    POST_TOKEN: string;
    GET_COUNTS: string;
    POST_VIEW: string;
    POST_SHARE: string;
    POST_DL: string;

    REVALIDATE_TOKEN: string;
    AUTH_TOKEN: string;
    ANALYZE: string;

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
  export default function (width: number, height: number): any;
  export function getSerializedSvg(): any;
}

declare module "geojson-bbox" {
  export default function (
    geojson: GeoJSON.GeoJsonObject
  ): [number, number, number, number];
}

declare module "remarkable-react" {
  class RemarkableReactRenderer {
    constructor(props: any);
  }
  export default RemarkableReactRenderer;
}
