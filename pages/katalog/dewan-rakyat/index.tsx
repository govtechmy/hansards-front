import Metadata from "@components/Metadata";
import CatalogueIndex from "@data-catalogue/index";
import CatalogueIndexLayout from "@data-catalogue/layout";
import { useTranslation } from "@hooks/useTranslation";
import { get } from "@lib/api";
import { AnalyticsProvider } from "@lib/contexts/analytics";
import { withi18n } from "@lib/decorators";
import { routes } from "@lib/routes";
import { Page } from "@lib/types";
import { assertFulfilled } from "@lib/utils";
import { GetStaticProps, InferGetStaticPropsType } from "next";

const CatalogueIndexPage: Page = ({
  meta,
  archive,
  parlimens,
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
          <CatalogueIndex archive={archive} parlimens={parlimens} />
        </CatalogueIndexLayout>
      </AnalyticsProvider>
    </>
  );
};

export const getStaticProps: GetStaticProps = withi18n(
  ["catalogue", "enum", "hansard"],
  async () => {
    const parlimens = [12, 13, 14, 15].map(String);
    const results = await Promise.allSettled(
      parlimens.map(term =>
        get("api/catalogue/", {
          house: "dewan-rakyat",
          term,
        })
      )
    );

    const fulfilledResults = results.filter(assertFulfilled);
    const data = fulfilledResults.map(e => e.value.data.catalogue_list);

    const archive = data.reduce((res, curr) => {
      for (const key in curr) {
        if (curr.hasOwnProperty(key)) {
          res[key] = curr[key];
        }
      }
      return res;
    }, {});

    if (Object.keys(archive).length === 0) throw new Error();

    return {
      notFound: process.env.NEXT_PUBLIC_APP_ENV === "production",
      props: {
        meta: {
          id: routes.KATALOG_DR,
        },
        archive,
        parlimens,
      },
    };
  }
);

export default CatalogueIndexPage;
