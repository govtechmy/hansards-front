import BarPerc from "@charts/bar-perc";
import {
  Container,
  Dropdown,
  List,
  Panel,
  PartyFlag,
  Skeleton,
  StateDropdown,
  Tabs,
} from "@components/index";
import { useData } from "@hooks/useData";
import { useFilter } from "@hooks/useFilter";
import { useTranslation } from "@hooks/useTranslation";
import { CountryAndStates } from "@lib/constants";
import { generateSchema } from "@lib/schema/election";
import { Archive, OptionType } from "@lib/types";
import dynamic from "next/dynamic";
import { useEffect } from "react";

/**
 * Sejarah Parlimen Dashboard
 * @overview Status: In-development
 */

const skeleton = () => (
  <Skeleton height="h-[400px] lg:h-[500px]" width="w-auto" />
);
const ParlimenTable = dynamic(() => import("./table"), {
  loading: skeleton,
  ssr: false,
});
const Table = dynamic(() => import("@charts/table"), {
  loading: skeleton,
  ssr: false,
});

type Party = {
  seats: {
    total: number;
    perc: number;
    won: number;
  };
  votes: {
    abs: number;
    perc: number;
  };
  party: string;
  seats_won: number;
  seats_pct: number;
  votes_pct: number;
  total_seats: number;
};

type Individu = {
  date: string;
  election_name: string;
  name: string;
  party: string;
  seat: string;
};

interface SejarahParlimenProps {
  dropdown: Archive;
  params: { election: string; state: string };
  dr_individu: Individu[];
  dr_party: Party[];
}

const SejarahParlimen = ({
  dropdown,
  dr_individu,
  dr_party,
  params,
}: SejarahParlimenProps) => {
  const { t } = useTranslation(["sejarah", "enum", "party"]);

  const { data, setData } = useData({
    parlimen: "",
    state: "",
    tab_idx: 0,
    loading: false,
  });

  const sejarahPerc = (value: Party) => (
    <div className="flex items-center gap-2 md:flex-col md:items-start lg:flex-row lg:items-center">
      <div>
        <BarPerc hidden value={value.total_seats} />
      </div>
      {/* <p className="whitespace-nowrap">{`${value.total_attended} / ${
        value.total_seats
      } ${
        value.attendance_pct !== null
          ? ` (${numFormat(value.attendance_pct, "compact", 1)}%)`
          : " (—)"
      }`}</p> */}
    </div>
  );

  const { setFilter } = useFilter({
    ke: params.election,
    negeri: params.state,
  });

  const PARLIMEN_OPTIONS: Array<OptionType> = Object.keys(dropdown)
    .reverse()
    .map((parlimen) => {
      const { start_date, end_date } = dropdown[parlimen];
      const start = start_date.substring(0, 4);
      const end = end_date.substring(0, 4);
      const yearRange = start === end ? ` (${start})` : ` (${start} - ${end})`;
      return {
        label: t("parlimen", { count: parlimen, ns: "enum" }).concat(yearRange),
        value: parlimen,
      };
    });

  const individu_schema = generateSchema<Individu>([
    { key: "seat", id: "seat", header: t("seat") },
    {
      key: "party",
      id: "party",
      header: t("party", { ns: "common" }),
    },
    { key: "name", id: "name", header: t("name") },
  ]);

  const party_schema = generateSchema<Party>([
    {
      key: "party",
      id: "party",
      header: t("party", { ns: "common" }),
    },
    {
      key: "seats_won",
      id: "seats_won",
      header: t("seats_won"),
      cell: ({ row }) => sejarahPerc(row.original),
    },
    {
      key: "seats_pct",
      id: "%_seats",
      header: t("%_seats"),
      cell: ({ row }) => sejarahPerc(row.original),
    },
    {
      key: "votes_pct",
      id: "%_votes",
      header: t("%_votes"),
      cell: ({ row }) => sejarahPerc(row.original),
    },
  ]);

  useEffect(() => {
    setData("parlimen", params.election ?? "15");
    setData("state", params.state ?? "mys");
    setData("loading", false);
  }, [params]);

  return (
    <>
      <Container className="xl:px-0 py-8 lg:py-12 xl:grid xl:grid-cols-12">
        <div className="xl:col-span-10 xl:col-start-2">
          <h2 className="header text-center pb-6">{t("parlimen.header")}</h2>

          <div className="pb-6 lg:pb-8 items-center gap-2 flex flex-col sm:flex-row mx-auto w-fit">
            <Dropdown
              placeholder={t("pilih_parlimen")}
              options={PARLIMEN_OPTIONS}
              selected={PARLIMEN_OPTIONS.find((e) => e.value === data.parlimen)}
              onChange={(selected) => {
                setData("loading", true);
                setData("parlimen", selected.value);
                if (data.state) {
                  setFilter("ke", selected.value);
                  setFilter("negeri", data.state);
                }
              }}
            />
            <StateDropdown
              currentState={data.state}
              onChange={(selected) => {
                setData("loading", true);
                setData("state", selected.value);
                if (data.parlimen) {
                  setFilter("ke", data.parlimen);
                  setFilter("negeri", selected.value);
                }
              }}
              anchor="left"
              width="w-full"
            />
          </div>

          <div className="flex flex-col lg:flex-row justify-between">
            <h3 className="title pt-6 pb-3">
              {
                PARLIMEN_OPTIONS.find(
                  (e) => e.value === (params.election ?? "15")
                )?.label
              }
              {": "}
              {CountryAndStates[params.state ?? "mys"]}
            </h3>

            <List
              options={[
                t("dewan_rakyat", { ns: "common" }).concat(
                  ` (${t("party", { ns: "common" })})`
                ),
                t("dewan_rakyat", { ns: "common" }).concat(
                  ` (${t("individu", { ns: "common" })})`
                ),
                t("dewan_negara", { ns: "common" }),
              ]}
              current={data.tab_idx}
              onChange={(index) => setData("tab_idx", index)}
            />
          </div>
          <Tabs hidden current={data.tab_idx} className="pt-6">
            <Panel
              name={t("dewan_rakyat", { ns: "common" }).concat(
                ` (${t("party", { ns: "common" })})`
              )}
            >
              {data.loading ? (
                <Skeleton height="h-[400px]" width="w-auto" />
              ) : (
                <ParlimenTable
                  data={dr_party.filter((e) => e.seats.won > 0)}
                  columns={generateSchema<Party>([
                    {
                      key: "party",
                      id: "party",
                      header: t("party", { ns: "common" }),
                    },
                    {
                      key: "seats",
                      id: "seats",
                      header: t("seats_won"),
                    },
                    {
                      key: "votes",
                      id: "votes",
                      header: t("votes_won"),
                    },
                  ])}
                  isLoading={data.loading}
                />
              )}
            </Panel>
            <Panel
              name={t("dewan_rakyat", { ns: "common" }).concat(
                ` (${t("individu", { ns: "common" })})`
              )}
            >
              {data.loading ? (
                <Skeleton height="h-[550px]" width="w-auto" />
              ) : (
                <Table
                  className="text-sm"
                  data={dr_individu}
                  config={[
                    { accessorKey: "seat", id: "seat", header: t("seat") },
                    {
                      accessorKey: "party",
                      id: "party",
                      header: t("party", { ns: "common" }),
                      cell: ({ getValue }) => <PartyFlag party={getValue()} />,
                    },
                    { accessorKey: "name", id: "name", header: t("name") },
                  ]}
                  enablePagination={10}
                />
              )}
            </Panel>
            <Panel name={t("dewan_negara", { ns: "common" })}>
              {data.loading ? (
                <Skeleton height="h-[300px]" width="w-auto" />
              ) : (
                <Table
                  className="text-sm w-full mx-auto"
                  config={[
                    {
                      accessorKey: "start_date",
                      id: "start_date",
                      header: t("start_date"),
                    },
                    {
                      accessorKey: "end_date",
                      id: "end_date",
                      header: t("end_date"),
                    },
                    {
                      accessorKey: "method",
                      id: "method",
                      header: t("method"),
                    },
                    {
                      accessorKey: "state",
                      id: "state",
                      header: t("state"),
                    },
                  ]}
                  data={[
                    {
                      start_date: "2015-11-19",
                      end_date: "2019-11-19",
                      method: "Appointed by DUN",
                      state: "Perlis",
                    },
                    {
                      start_date: "2015-11-19",
                      end_date: "2019-11-19",
                      method: "Appointed by DUN",
                      state: "Perlis",
                    },
                  ]}
                />
              )}
            </Panel>
          </Tabs>
        </div>
      </Container>
    </>
  );
};

export default SejarahParlimen;
