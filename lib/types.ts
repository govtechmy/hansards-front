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

export type defineConfig = (
  namespace: string[],
  autoloadNs: string[]
) => I18nConfig;

// CHART INTERFACE
export type ChartCrosshairOption<T extends keyof ChartTypeRegistry> =
  ChartOptions<T> & {
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

export type OptionType = {
  label: string;
  value: string;
};

export type Geotype = "state" | "parlimen" | "dun" | "district";

export type Precision = {
  default: number;
  columns?: Record<string, number>;
};

/**************************MISCELLANEOUS ******************************/
export type MetaPage = Record<string, any> & {
  meta: {
    id: string;
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
};

export type Penggal = Period & {
  [key: string]: Mesyuarat;
};

export type Parlimen = Period & {
  [key: string]: Penggal;
};

export type Archive = {
  [key in string]: Parlimen;
};

export type Speech = {
  speech: string;
  author: string | null;
  author_id: number | null;
  timestamp: number;
  is_annotation: boolean;
  index: number;
  avatar: string;
};

export type NestedSpeech = { [key: string]: Array<Speech | NestedSpeech> };
export type Speeches = Array<Speech | NestedSpeech>;

export type Speaker = {
  new_author_id: number;
  name: string;
  birth_year: number;
  ethnicity: string;
  gender: string;
};

export type Heading = {
  id: string;
  level: number;
  title: string;
};
