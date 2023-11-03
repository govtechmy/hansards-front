import Metadata from "@components/Metadata";
import SearchArea from "@dashboards/sejarah/search-area";
import SearchMP from "@dashboards/sejarah/search-mp";
import SejarahLayout from "@dashboards/sejarah/layout";
import { useTranslation } from "@hooks/useTranslation";
import { get } from "@lib/api";
import { AnalyticsProvider } from "@lib/contexts/analytics";
import { withi18n } from "@lib/decorators";
import { Page } from "@lib/types";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";

const Sejarah: Page = ({
  meta,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { t } = useTranslation("sejarah");

  return (
    <AnalyticsProvider meta={meta}>
      <Metadata
        title={t("hero.header")}
        description={t("hero.description")}
        keywords={""}
      />
      <SejarahLayout>
        {(tab) => (
          <>
            {
              {
                area: <SearchArea />,
                mp: <SearchMP />,
              }[tab]
            }
          </>
        )}
      </SejarahLayout>
    </AnalyticsProvider>
  );
};

export const getServerSideProps: GetServerSideProps = withi18n("sejarah", async () => {
  return {
    props: {
      meta: {
        id: "sejarah",
        type: "dashboard",
      },
    },
  };
});

export default Sejarah;
