import Metadata from "@components/Metadata";
import Parti from "@dashboards/sejarah/parti";
import SejarahLayout from "@dashboards/sejarah/layout";
import { useTranslation } from "@hooks/useTranslation";
import { get } from "@lib/api";
import { AnalyticsProvider } from "@lib/contexts/analytics";
import { withi18n } from "@lib/decorators";
import { Page } from "@lib/types";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";

const SejarahParti: Page = ({
  meta,
  dropdown,
  parti,
  last_updated,
  params,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { t } = useTranslation("sejarah");

  return (
    <AnalyticsProvider meta={meta}>
      <Metadata
        title={t("sejarah_parti")}
        description={t("parti.header")}
        keywords={""}
      />
      <SejarahLayout last_updated={last_updated}>
        <Parti dropdown={dropdown} parti={parti} params={params} />
      </SejarahLayout>
    </AnalyticsProvider>
  );
};

export const getServerSideProps: GetServerSideProps = withi18n(
  ["party", "sejarah"],
  async ({ query }) => {
    try {
      const [name, state] =
        Object.keys(query).length === 0
          ? [null, null]
          : [query.nama, query.negeri];

      const results = await Promise.allSettled([
        get(
          "/explorer",
          {
            explorer: "ELECTIONS",
            dropdown: "party_list",
          },
          process.env.NEXT_PUBLIC_SEJARAH_URL
        ),
        get(
          "/explorer",
          {
            explorer: "ELECTIONS",
            chart: "party",
            party_name: name ?? "PERIKATAN",
            state: state ?? "mys",
          },
          process.env.NEXT_PUBLIC_SEJARAH_URL
        ),
      ]).catch((e) => {
        throw new Error("Invalid party. Message: " + e);
      });

      const [dropdown, data] = results.map((e) => {
        if (e.status === "rejected") return {};
        else return e.value.data;
      });

      return {
        props: {
          meta: {
            id: "sejarah_parti",
            type: "dashboard",
          },
          params: { name, state },
          dropdown,
          parti:
            data.data.parlimen.sort(
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

export default SejarahParti;
