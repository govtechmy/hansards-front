import Hansard from "@data-catalogue/hansard";
import { get } from "@lib/api";
import Metadata from "@components/Metadata";
import { withi18n } from "@lib/decorators";
import { useTranslation } from "@hooks/useTranslation";
import { Page } from "@lib/types";
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";
import { AnalyticsProvider } from "@lib/contexts/analytics";
import { WindowProvider } from "@lib/contexts/window";
import { SearchProvider } from "@data-catalogue/context";

const CatalogueIndexPage: Page = ({
  meta,
  cycle,
  date,
  filename,
  cite_count,
  download_count,
  view_count,
  speeches,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation("hansard");

  return (
    <>
      <AnalyticsProvider meta={meta}>
        <Metadata
          title={t("hero.header")}
          description={t("hero.description")}
          keywords={""}
        />
        <SearchProvider
          value={{
            fixedHeaderHeight: 240,
          }}
        >
          {/* <WindowProvider> */}
            <Hansard
              cycle={cycle}
              date={date}
              filename={filename}
              cite_count={cite_count}
              download_count={download_count}
              view_count={view_count}
              speeches={speeches}
            />
          {/* </WindowProvider> */}
        </SearchProvider>
      </AnalyticsProvider>
    </>
  );
};

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = withi18n(
  ["catalogue", "enum", "hansard"],
  async ({ params }) => {
    try {
      const [house, date] = params?.sitting
        ? (params.sitting as string[])
        : ["dewan-rakyat", "2023-03-21"];

      const { data } = await get("api/sitting/", {
        house,
        date,
      });

      const { data: count } = await get(
        "/pipes/get_counts.json",
        {
          hansard_id: `${house}/${date}`,
          token: process.env.NEXT_PUBLIC_TINYBIRD_AUTH.concat(
            process.env.NEXT_PUBLIC_GET_COUNTS
          ),
        },
        "tinybird"
      );

      return {
        props: {
          meta: {
            id: `${house}/${date}`,
            type: "data-catalogue",
          },
          cycle: data.meta.cycle,
          date: data.meta.date,
          filename: data.meta.filename,
          cite_count: data.meta.cite_count,
          download_count: data.meta.download_count,
          view_count:
            count.data.length > 0
              ? count.data.find((e: any) => e.type === "view").view_count
              : 0,
          speeches: data.speeches,
        },
      };
    } catch (error) {
      console.error(error);
      return { notFound: true };
    }
  }
);

export default CatalogueIndexPage;
