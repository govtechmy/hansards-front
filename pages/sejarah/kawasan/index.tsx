import Metadata from "@components/Metadata";
import Kawasan from "@dashboards/sejarah/kawasan";
import SejarahLayout from "@dashboards/sejarah/layout";
import { useTranslation } from "@hooks/useTranslation";
import { get } from "@lib/api";
import { AnalyticsProvider } from "@lib/contexts/analytics";
import { withi18n } from "@lib/decorators";
import { Page } from "@lib/types";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";

const SejarahKawasan: Page = ({
  meta,
  dropdown,
  kawasan,
  last_updated,
  params,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { t } = useTranslation("sejarah");

  return (
    <AnalyticsProvider meta={meta}>
      <Metadata
        title={t("sejarah_kawasan")}
        description={t("kawasan.header")}
        keywords={""}
      />
      <SejarahLayout last_updated={last_updated}>
        <Kawasan dropdown={dropdown} kawasan={kawasan} params={params} />
      </SejarahLayout>
    </AnalyticsProvider>
  );
};

export const getServerSideProps: GetServerSideProps = withi18n(
  ["election", "party", "sejarah"],
  async ({ query }) => {
    try {
      const name = Object.keys(query).length === 0 ? null : query.nama;
      const results = await Promise.allSettled([
        get(
          "/explorer",
          {
            explorer: "ELECTIONS",
            dropdown: "seats_list",
          },
          "sejarah"
        ),
        get(
          "/explorer",
          {
            explorer: "ELECTIONS",
            chart: "seats",
            seat_name: name ?? "padang-besar-perlis",
            type: "parlimen",
          },
          "sejarah"
        ),
      ]).catch((e) => {
        throw new Error("Invalid seat name. Message: " + e);
      });

      const [dropdown, data] = results.map((e) => {
        if (e.status === "rejected") return {};
        else return e.value.data;
      });

      return {
        props: {
          meta: {
            id: "sejarah_kawasan",
            type: "dashboard",
          },
          params: { name },
          dropdown,
          kawasan:
            data.data.sort(
              (a: { date: string }, b: { date: string }) =>
                Number(new Date(b.date)) - Number(new Date(a.date))
            ) ?? [],
        },
      };
    } catch (error: any) {
      console.error(error.message);
      return { notFound: true };
    }
  }
);

export default SejarahKawasan;
