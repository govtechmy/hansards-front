import Metadata from "@components/Metadata";
import Parlimen from "@dashboards/sejarah/parlimen";
import SejarahLayout from "@dashboards/sejarah/layout";
import { useTranslation } from "@hooks/useTranslation";
import { get } from "@lib/api";
import { AnalyticsProvider } from "@lib/contexts/analytics";
import { withi18n } from "@lib/decorators";
import { Page } from "@lib/types";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { CountryAndStates } from "@lib/constants";
import { routes } from "@lib/routes";

const SejarahParlimen: Page = ({
  meta,
  dropdown,
  last_updated,
  params,
  dr_individu,
  dr_party,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { t } = useTranslation("sejarah");

  return (
    <AnalyticsProvider>
      <Metadata
        title={t("sejarah_parlimen")}
        description={t("parlimen.header")}
        keywords={""}
      />
      <SejarahLayout last_updated={last_updated}>
        <Parlimen
          dropdown={dropdown}
          params={params}
          dr_individu={dr_individu}
          dr_party={dr_party}
        />
      </SejarahLayout>
    </AnalyticsProvider>
  );
};

export const getServerSideProps: GetServerSideProps = withi18n(
  ["enum", "party", "sejarah"],
  async ({ query }) => {
    try {
      let [election_num, state] =
        Object.keys(query).length === 0
          ? [null, null]
          : [query.ke?.toString(), query.negeri?.toString()];

      const election =
        election_num && state
          ? ["mys", "kul", "lbn", "pjy"].includes(state) === false
            ? `${CountryAndStates[state]} SE-${election_num.padStart(2, "0")}`
            : `GE-${election_num.padStart(2, "0")}`
          : election_num;

      const results = await Promise.allSettled([
        get("api/catalogue/", {
          house: "dewan-rakyat",
          dropdown: true,
        }),
        get(
          "/explorer",
          {
            explorer: "ELECTIONS",
            chart: "overall_seat",
            election: election ?? "GE-15",
            state: state ?? "mys",
          },
          "sejarah"
        ),
        get(
          "/explorer",
          {
            explorer: "ELECTIONS",
            chart: "full_result",
            type: "party",
            election: election ?? "GE-15",
            state: state ?? "mys",
          },
          "sejarah"
        ),
      ]).catch((e) => {
        throw new Error("Invalid parliament term/state. Message: " + e);
      });

      const [dropdown, seats, table] = results.map((e) => {
        if (e.status === "rejected") return {};
        else return e.value.data;
      });

      return {
        props: {
          meta: {
            id: routes.SEJARAH_PARLIMEN,
          },
          dropdown: dropdown.catalogue_list,
          last_updated: seats.data_last_updated,
          params: { election: election_num, state },
          dr_party: table.data.sort(
            (
              a: { seats: { won: number }; votes: { perc: number } },
              b: { seats: { won: number }; votes: { perc: number } }
            ) => {
              if (a.seats.won === b.seats.won) {
                return b.votes.perc - a.votes.perc;
              } else {
                return b.seats.won - a.seats.won;
              }
            }
          ),
          dr_individu: seats.data,
        },
      };
    } catch (error: any) {
      console.error(error.message);
      return { notFound: true };
    }
  }
);

export default SejarahParlimen;
