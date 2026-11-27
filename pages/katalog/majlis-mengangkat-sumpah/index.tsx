import Metadata from "@components/Metadata";
import CatalogueIndexLayout from "@data-catalogue/layout";
import CatalogueMMS from "@data-catalogue/mms";
import { useTranslation } from "@hooks/useTranslation";
import { get } from "@lib/api";
import { AnalyticsProvider } from "@lib/contexts/analytics";
import { withi18n } from "@lib/decorators";
import { routes } from "@lib/routes";
import { Page } from "@lib/types";
import { assertFulfilled, generateRange } from "@lib/utils";
import { GetStaticProps, InferGetStaticPropsType } from "next";

const CatalogueMMSPage: Page = ({
  meta,
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
      <AnalyticsProvider id={meta.id}>
        <CatalogueIndexLayout>
          <CatalogueMMS archive={archive} />
        </CatalogueIndexLayout>
      </AnalyticsProvider>
    </>
  );
};

export const getStaticProps: GetStaticProps = withi18n(
  ["catalogue", "enum", "hansard"],
  async () => {
    const parlimens = generateRange(13, 15);
    const results = await Promise.allSettled(
      parlimens.map(term =>
        get("api/catalogue/", {
          house: "majlis-mengangkat-sumpah",
          term,
        })
      )
    );

    const fulfilledResults = results.filter(assertFulfilled);
    if (
      fulfilledResults.length !== results.length ||
      fulfilledResults.length === 0
    ) {
      throw new Error(
        "Failed to fetch catalogue data for majlis-mengangkat-sumpah"
      );
    }
    const archive = Object.assign(
      {},
      ...fulfilledResults.map(e => e.value.data.catalogue_list)
    );

    return {
      revalidate: 60 * 60 * 8, // on-demand ISR; 8 hours
      props: {
        meta: {
          id: routes.KATALOG_MMS,
        },
        archive,
      },
    };
  }
);

export default CatalogueMMSPage;
