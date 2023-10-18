import CatalogueIndex from "@data-catalogue/index";
import CatalogueIndexLayout from "@data-catalogue/layout";
import Metadata from "@components/Metadata";
import { useTranslation } from "@hooks/useTranslation";
import { get } from "@lib/api";
import { withi18n } from "@lib/decorators";
import { Page } from "@lib/types";
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";

const CatalogueIndexPage: Page = ({
  archive,
  params,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation("catalogue");

  return (
    <>
      <Metadata
        title={t("hero.header")}
        description={t("hero.description")}
        keywords={""}
      />
      <CatalogueIndexLayout>
        <CatalogueIndex archive={archive} params={params} />
      </CatalogueIndexLayout>
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
      const { data } = await get("api/catalogue/", {
        house: "dewan-rakyat",
      });

      return {
        props: {
          meta: {
            id: "catalogue-index",
            type: "misc",
          },
          archive: data.catalogue_list,
          params: params,
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
