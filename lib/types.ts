import type { Color } from "@hooks/useColor";
import type { ChartOptions, ChartTypeRegistry } from "chart.js";
import type { AnnotationPluginOptions } from "chartjs-plugin-annotation";
import type { NextPage } from "next";
import { UserConfig } from "next-i18next";
import type { AppProps } from "next/app";
import type { ReactElement, ReactNode } from "react";

export type AppPropsLayout = AppProps & {
  Component: Page;
};

export type Page = NextPage & {
  layout?: (page: ReactNode, props: Record<string, any>) => ReactElement;
  theme?: "light" | "dark";
};

export type I18nConfig = UserConfig & { autoloadNs: string[] };

export type defineConfig = (namespace: string[], autoloadNs: string[]) => I18nConfig;

// CHART INTERFACE
export type ChartCrosshairOption<T extends keyof ChartTypeRegistry> = ChartOptions<T> & {
  plugins: {
    crosshair?:
      | {
          line: {
            width?: number;
            color?: string;
            dashPattern?: [number, number];
          };
          zoom: {
            enabled: boolean;
          };
          sync: {
            enabled: boolean;
          };
        }
      | false;
    annotation?: AnnotationPluginOptions | false;
    datalabels?: any | false;
  };
};

export type TimeseriesOption = {
  period: "auto" | "month" | "year";
  periodly: "daily_7d" | "daily" | "monthly" | "yearly";
};

export type DashboardPeriod = "daily_7d" | "daily" | "monthly" | "yearly";

export type DownloadOption = {
  id: string;
  image: string | null | false | undefined;
  title: ReactNode;
  description: ReactNode;
  icon: JSX.Element;
  href: () => void;
};

export type DownloadOptions = {
  chart: DownloadOption[];
  data: DownloadOption[];
};

export interface AnalyticsEvent {
  action: string;
  category: string;
  label: string;
  value: string;
}

export type OptionType = {
  label: string;
  value: string;
};

export type Geotype = "state" | "parlimen" | "dun" | "district";

/************************ DATA CATALOGUE ************************** */
export type DCChartKeys =
  | "TABLE"
  | "TIMESERIES"
  | "CHOROPLETH"
  | "GEOCHOROPLETH"
  | "GEOPOINT"
  | "GEOJSON"
  | "BAR"
  | "HBAR"
  | "LINE"
  | "PYRAMID"
  | "HEATTABLE"
  | "SCATTER"
  | "STACKED_AREA"
  | "STACKED_BAR"
  | "INTRADAY";
export type DCPeriod = "YEARLY" | "QUARTERLY" | "MONTHLY" | "WEEKLY" | "DAILY";

type BaseFilter = {
  key: string;
  default: string;
  options: string[];
};
export type FilterDefault = BaseFilter & {
  interval: never;
};

export type FilterDate = BaseFilter & {
  interval: DCPeriod;
};

export type DCFilter = FilterDefault | FilterDate;

export type Precision = {
  default: number;
  columns?: Record<string, number>;
};

// Usage
export type DCConfig = {
  context: {
    [key: string]: OptionType;
  };
  dates: FilterDate | null;
  options: FilterDefault[] | null;
  precision: number | Precision;
  freeze?: string[];
  color?: Color;
  geojson?: Geotype | null;
  line_variables?: Record<string, any>;
  exclude_openapi: boolean;
};

/**************************MISCELLANEOUS ******************************/
export type MetaPage = Record<string, any> & {
  meta: {
    id: string;
    type: "dashboard" | "data-catalogue" | "misc";
  };
};

export type WithData<T> = { data_as_of: string; data: T };

/* Hansard */
export type Dewan = "dewan-rakyat" | "dewan-negara" | "kamar-khas";

export type Period = {
  start_date: string;
  end_date: string;
};

export type Sitting = {
  date: string;
  filename: string;
  download_count: number;
  view_count: number;
  cite_count: number;
};

export type Mesyuarat = Period & {
  sitting_list: Sitting[];
}

export type Penggal = Period & {
  [key: string]: Mesyuarat;
}

export type Parlimen = Period & {
  [key: string]: Penggal;
}

export type Archive = {
  [key in string]: Parlimen;
}

export type Speech = {
  speech: string;
  author: string;
  timestamp: number;
  is_annotation: boolean;
  index: number;
};

export type NestedSpeech = { [key: string]: Array<Speech | NestedSpeech> };

export type Speeches = Array<Speech | NestedSpeech>;