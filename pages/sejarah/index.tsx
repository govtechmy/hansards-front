import Metadata from "@components/Metadata";
import SejarahDashboard from "@dashboards/sejarah";
import { useTranslation } from "@hooks/useTranslation";
import { get } from "@lib/api";
import { AnalyticsProvider } from "@lib/contexts/analytics";
import { withi18n } from "@lib/decorators";
import { Page } from "@lib/types";
import { GetStaticProps, InferGetStaticPropsType } from "next";

const Sejarah: Page = ({
  meta,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation("sejarah");

  return (
    <AnalyticsProvider meta={meta}>
      <Metadata
        title={t("hero.header")}
        description={t("hero.description")}
        keywords={""}
      />
      <SejarahDashboard/>
    </AnalyticsProvider>
  );
};

export const getStaticProps: GetStaticProps = withi18n(
  "sejarah",
  async () => {
    return {
      props: {
        meta: {
          id: "sejarah",
          type: "dashboard",
        },
      },
    };
  }
);

export default Sejarah;
