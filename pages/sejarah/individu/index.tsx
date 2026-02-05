import Metadata from "@components/Metadata";
import Individu from "@dashboards/sejarah/individu";
import SejarahLayout from "@dashboards/sejarah/layout";
import { useTranslation } from "@hooks/useTranslation";
import { get } from "@lib/api";
import { AnalyticsProvider } from "@lib/contexts/analytics";
import { withi18n } from "@lib/decorators";
import { routes } from "@lib/routes";
import { Page } from "@lib/types";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";

const SejarahIndividu: Page = ({
  meta,
  dropdown,
  last_updated,
  params,
  parlimen,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { t } = useTranslation("sejarah");

  return (
    <AnalyticsProvider id={meta.id}>
      <Metadata
        title={t("sejarah_individu")}
        description={t("individu.header")}
        keywords={""}
      />
      <SejarahLayout last_updated={last_updated}>
        <Individu dropdown={dropdown} params={params} parlimen={parlimen} />
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
            dropdown: "candidate_list",
          },
          "sejarah"
        ),
        get(
          "/explorer",
          {
            explorer: "ELECTIONS",
            chart: "candidates",
            name: name ?? "tunku-abdul-rahman-putra-alhaj",
          },
          "sejarah"
        ),
      ]).catch(e => {
        throw new Error("Invalid candidate name. Message: " + e);
      });

      const [dropdown, data] = results.map(e => {
        if (e.status === "rejected") return {};
        else return e.value.data;
      });

      return {
        notFound: process.env.NEXT_PUBLIC_APP_ENV === "production",
        props: {
          meta: {
            id: routes.SEJARAH_INDIVIDU,
          },
          dropdown,
          last_updated: data.data_last_updated,
          params: { name },
          parlimen: {
            dewan_rakyat:
              data.data.parlimen.length > 0
                ? data.data.parlimen.sort(
                    (a: { date: string }, b: { date: string }) =>
                      Date.parse(b.date) - Date.parse(a.date)
                  )
                : data.data.dun.sort(
                    (a: { date: string }, b: { date: string }) =>
                      Date.parse(b.date) - Date.parse(a.date)
                  ),
          },
        },
      };
    } catch (e) {
      console.error(
        "Sejarah Individu getServerSideProps error:",
        JSON.stringify(e)
      );
      return { notFound: true };
    }
  }
);

export default SejarahIndividu;
