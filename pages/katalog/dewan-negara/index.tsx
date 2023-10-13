import CatalogueIndex from "@data-catalogue/index";
import CatalogueIndexLayout from "@data-catalogue/layout";
import { get } from "@lib/api";
import Metadata from "@components/Metadata";
import { withi18n } from "@lib/decorators";
import { useTranslation } from "@hooks/useTranslation";
import { Page } from "@lib/types";
import { GetStaticProps, InferGetStaticPropsType } from "next";

const CatalogueIndexPage: Page = ({
  archive,
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
        <CatalogueIndex archive={archive} />
      </CatalogueIndexLayout>
    </>
  );
};

export const getStaticProps: GetStaticProps = withi18n(
  ["catalogue", "enum"],
  async () => {
    try {
      const { data } = await get("api/catalogue/", {
        house: 1,
      });

      return {
        props: {
          meta: {
            id: "catalogue-index",
            type: "misc",
          },
          archive: data.catalogue_list,
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