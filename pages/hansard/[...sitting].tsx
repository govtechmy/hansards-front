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
  speeches,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation("hansard");

  return (
    <>
      <AnalyticsProvider meta={meta}>
        <Metadata
          title={t("header").concat(" - " + date)}
          description={meta.id}
          keywords={""}
        />
        <SearchProvider
          value={{
            fixedHeaderHeight: 240,
          }}
        >
          {/* <WindowProvider> */}
          <Hansard
            id={meta.id}
            cycle={cycle}
            date={date}
            filename={filename}
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

      return {
        props: {
          meta: {
            id: `${house}/${date}`,
            type: "data-catalogue",
          },
          cycle: data.meta.cycle,
          date: date,
          filename: data.meta.filename,
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
