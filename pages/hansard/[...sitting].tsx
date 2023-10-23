import Hansard from "@data-catalogue/hansard";
import { get } from "@lib/api";
import Metadata from "@components/Metadata";
import { withi18n } from "@lib/decorators";
import { useTranslation } from "@hooks/useTranslation";
import { Page } from "@lib/types";
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";

const CatalogueIndexPage: Page = ({
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
      <Metadata
        title={t("hero.header")}
        description={t("hero.description")}
        keywords={""}
      />
      <Hansard
        cycle={cycle}
        date={date}
        filename={filename}
        cite_count={cite_count}
        download_count={download_count}
        view_count={view_count}
        speeches={speeches}
      />
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
            id: "hansard",
            type: "data-catalogue",
          },
          cycle: data.meta.cycle,
          date: data.meta.date,
          filename: data.meta.filename,
          cite_count: data.meta.cite_count,
          download_count: data.meta.download_count,
          view_count: data.meta.view_count,
          speeches: data.speeches,
        },
      };
    } catch (error) {
      console.error(error);
      return { notFound: true };
    }
  },
  {
    cache_expiry: 600, // 10 min
  }
);

export default CatalogueIndexPage;
