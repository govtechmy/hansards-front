import Hansard from "@data-catalogue/hansard";
import { get } from "@lib/api";
import Metadata from "@components/Metadata";
import { withi18n } from "@lib/decorators";
import { useTranslation } from "@hooks/useTranslation";
import { Page } from "@lib/types";
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";

const CatalogueIndexPage: Page = ({
  date,
  filename,
  cite_count,
  download_count,
  view_count,
  speeches,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation("catalogue");

  return (
    <>
      <Metadata
        title={t("hero.header")}
        description={t("hero.description")}
        keywords={""}
      />
      <Hansard
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
  ["catalogue", "enum"],
  async ({ params }) => {
    try {
      const date = params?.date ? params.date[0] : "2023-03-21";

      const { data } = await get("api/sitting/", {
        house: "dewan-negara",
        date,
      });

      return {
        props: {
          meta: {
            id: "hansard",
            type: "data-catalogue",
          },
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
