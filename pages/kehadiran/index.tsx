import Metadata from "@components/Metadata";
import KehadiranDashboard from "@dashboards/kehadiran";
import { useTranslation } from "@hooks/useTranslation";
import { get } from "@lib/api";
import { AnalyticsProvider } from "@lib/contexts/analytics";
import { withi18n } from "@lib/decorators";
import { Page } from "@lib/types";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";

const Kehadiran: Page = ({
  meta,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { t } = useTranslation("kehadiran");

  return (
    <AnalyticsProvider meta={meta}>
      <Metadata
        title={t("hero.header")}
        description={t("hero.description")}
        keywords={""}
      />
      <KehadiranDashboard/>
    </AnalyticsProvider>
  );
};

export const getServerSideProps: GetServerSideProps = withi18n(
  "kehadiran",
  async () => {
    return {
      props: {
        meta: {
          id: "kehadiran",
          type: "dashboard",
        },
      },
    };
  }
);

export default Kehadiran;
