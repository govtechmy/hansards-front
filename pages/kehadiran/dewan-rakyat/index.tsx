import Metadata from "@components/Metadata";
import KehadiranDashboard from "@dashboards/kehadiran";
import KehadiranLayout from "@dashboards/kehadiran/layout";
import { useTranslation } from "@hooks/useTranslation";
import { get } from "@lib/api";
import { AnalyticsProvider } from "@lib/contexts/analytics";
import { withi18n } from "@lib/decorators";
import { routes } from "@lib/routes";
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
    <AnalyticsProvider id={meta.id}>
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
  ["kehadiran", "enum", "demografi", "party"],
  async ({ query }) => {
    const { data: dropdown } = await get("api/catalogue/", {
      house: "dewan-rakyat",
      dropdown: true,
    });

    let [term, session, meeting] = [
      query.parlimen ? query.parlimen.toString() : null,
      query.penggal ? query.penggal.toString() : null,
      query.mesyuarat ? query.mesyuarat.toString() : null,
    ];

    const { data } = await get("api/attendance/", {
      house: "dewan-rakyat",
      term:
        term === "all"
          ? null
          : term ?? Object.keys(dropdown.catalogue_list).reverse()[0],
      session: session === "all" ? null : session,
      meeting: meeting === "all" ? null : meeting,
    });

    return {
      notFound: process.env.NEXT_PUBLIC_APP_ENV === "production",
      props: {
        meta: {
          id: routes.KEHADIRAN_DR,
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
