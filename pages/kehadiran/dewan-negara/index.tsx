import Metadata from "@components/Metadata";
import KehadiranDashboard from "@dashboards/kehadiran";
import KehadiranLayout from "@dashboards/kehadiran/layout";
import { useTranslation } from "@hooks/useTranslation";
import { get } from "@lib/api";
import { AnalyticsProvider } from "@lib/contexts/analytics";
import { withi18n } from "@lib/decorators";
import { Page } from "@lib/types";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";

const Kehadiran: Page = ({
  barmeter,
  dropdown,
  individual,
  meta,
  party,
  params,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { t } = useTranslation("kehadiran");

  return (
    <AnalyticsProvider meta={meta}>
      <Metadata
        title={t("hero.header")}
        description={t("hero.description")}
        keywords={""}
      />
      <KehadiranLayout>
        <KehadiranDashboard
          barmeter={barmeter}
          dropdown={dropdown}
          individual={individual}
          party={party}
          params={params}
        />
      </KehadiranLayout>
    </AnalyticsProvider>
  );
};

export const getServerSideProps: GetServerSideProps = withi18n(
  ["kehadiran", "enum", "party"],
  async ({ query }) => {
    const { data: dropdown } = await get("api/catalogue/", {
      house: "dewan-negara",
      dropdown: true,
    });

    let [term, session, meeting] = [
      query.parlimen ? query.parlimen.toString() : null,
      query.penggal ? query.penggal.toString() : null,
      query.mesyuarat ? query.mesyuarat.toString() : null,
    ];

    const { data } = await get("api/attendance/", {
      house: "dewan-negara",
      term:
        term === "all"
          ? null
          : term ?? Object.keys(dropdown.catalogue_list).reverse()[0],
      session: session === "all" ? null : session,
      meeting: meeting === "all" ? null : meeting,
    });

    return {
      props: {
        meta: {
          id: "kehadiran-dn",
          type: "dashboard",
        },
        barmeter: data.charts,
        dropdown: dropdown.catalogue_list,
        individual: data.tab_individual,
        party: data.tab_party,
        params: { parlimen: term, penggal: session, mesyuarat: meeting },
      },
    };
  }
);

export default Kehadiran;
