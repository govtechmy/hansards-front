import Metadata from "@components/Metadata";
import CatalogueIndex from "@data-catalogue/index";
import CatalogueIndexLayout from "@data-catalogue/layout";
import { useTranslation } from "@hooks/useTranslation";
import { get } from "@lib/api";
import { AnalyticsProvider } from "@lib/contexts/analytics";
import { withi18n } from "@lib/decorators";
import { routes } from "@lib/routes";
import { Page } from "@lib/types";
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";

const CatalogueIndexPage: Page = ({
  meta,
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
      <AnalyticsProvider id={meta.id}>
        <CatalogueIndexLayout>
          <CatalogueIndex archive={archive} params={params} />
        </CatalogueIndexLayout>
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
      const { data } = await get("api/catalogue/", {
        house: "kamar-khas",
      });

      return {
        notFound: process.env.NEXT_PUBLIC_APP_ENV === "production",
        props: {
          meta: {
            id: routes.KATALOG_KK,
          },
          archive: data.catalogue_list,
          params: params,
        },
      };
    } catch (error) {
      console.error(error);
      return { notFound: true };
    }
  }
);

export default CatalogueIndexPage;
