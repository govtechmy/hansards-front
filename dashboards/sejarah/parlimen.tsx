import { Container, Dropdown, PartyFlag, Skeleton } from "@components/index";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/Tabs";
import { Individu, Parti } from "@dashboards/sejarah/types";
import { useData } from "@hooks/useData";
import { useFilter } from "@hooks/useFilter";
import { useTranslation } from "@hooks/useTranslation";
import { CountryAndStates } from "@lib/constants";
import { cn } from "@lib/helpers";
import { statesOptions } from "@lib/options";
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

interface SejarahParlimenProps {
  dropdown: Archive;
  params: { election: string; state: string };
  dr_individu: Individu[];
  dr_party: Parti[];
}

const SejarahParlimen = ({
  dropdown,
  dr_individu,
  dr_party,
  params,
}: SejarahParlimenProps) => {
  const { t } = useTranslation(["sejarah", "enum", "party"]);

  const { data, setData } = useData({
    loading: false,
    parlimen: "",
    state: "",
    tab: "dr_parti",
    // tab_idx: 0,
  });

  const { setFilter } = useFilter({
    ke: params.election,
    negeri: params.state,
  });

  const PARLIMEN_OPTIONS: Array<OptionType> = Object.keys(dropdown)
    .reverse()
    .map(parlimen => {
      const { start_date, end_date } = dropdown[parlimen];
      const start = start_date.substring(0, 4);
      const end = end_date.substring(0, 4);
      const yearRange = start === end ? ` (${start})` : ` (${start} - ${end})`;
      return {
        label: t("parlimen", { count: parlimen, ns: "enum" }).concat(yearRange),
        value: parlimen,
      };
    });

  useEffect(() => {
    setData("parlimen", params.election ?? "15");
    setData("state", params.state ?? "mys");
    setData("loading", false);
  }, [params]);

  return (
    <>
      <Container className="py-8 lg:py-12 xl:grid xl:grid-cols-12 xl:px-0">
        <div className="xl:col-span-10 xl:col-start-2">
          <h2 className="header pb-6 text-center">{t("parlimen.header")}</h2>

          <div className="mx-auto flex w-fit flex-col items-center gap-2 pb-6 sm:flex-row lg:pb-8">
            <Dropdown
              onChange={selected => {
                setData("loading", true);
                setData("state", selected.value);
                if (data.parlimen) {
                  setFilter("ke", data.parlimen);
                  setFilter("negeri", selected.value);
                }
              }}
              selected={statesOptions.find(state => state.value === data.state)}
              options={statesOptions}
              enableFlag
              anchor="left"
              width="w-full"
            />
            <Dropdown
              placeholder={t("pilih_parlimen")}
              options={PARLIMEN_OPTIONS}
              selected={PARLIMEN_OPTIONS.find(e => e.value === data.parlimen)}
              onChange={selected => {
                setData("loading", true);
                setData("parlimen", selected.value);
                if (data.state) {
                  setFilter("ke", selected.value);
                  setFilter("negeri", data.state);
                }
              }}
            />
          </div>

          <Tabs
            // defaultValue="dr_parti"
            value={data.tab}
            onValueChange={tab => setData("tab", tab)}
          >
            <TabsList className="flex flex-col justify-between lg:flex-row">
              <h3 className="title py-6">
                {CountryAndStates[params.state ?? "mys"]}
                {": "}
                {
                  PARLIMEN_OPTIONS.find(
                    e => e.value === (params.election ?? "15")
                  )?.label
                }
              </h3>
              <div>
                <TabsTrigger
                  value="dr_parti"
                  className={cn(
                    data.tab === "dr_parti"
                      ? "text-foreground"
                      : "text-zinc-500"
                  )}
                >
                  {`${t("common:dewan_rakyat")} (${t("common:party")})`}
                </TabsTrigger>
                <TabsTrigger
                  value="dr_individu"
                  className={cn(
                    data.tab === "dr_individu"
                      ? "text-foreground"
                      : "text-zinc-500"
                  )}
                >
                  {`${t("common:dewan_rakyat")} (${t("common:individu")})`}
                </TabsTrigger>
                <TabsTrigger
                  value="dewan_negara"
                  className={cn(
                    data.tab === "dewan_negara"
                      ? "text-foreground"
                      : "text-zinc-500"
                  )}
                >
                  {t("common:dewan_negara")}
                </TabsTrigger>
              </div>
            </TabsList>
            <TabsContent value="dr_parti">
              {data.loading ? (
                <Skeleton height="h-[400px]" width="w-auto" />
              ) : (
                <ParlimenTable
                  data={dr_party.filter(e => e.seats.won > 0)}
                  columns={generateSchema<Parti>([
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
            </TabsContent>
            <TabsContent value="dr_individu">
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
            </TabsContent>
            <TabsContent value="dewan_negara">
              {data.loading ? (
                <Skeleton height="h-[300px]" width="w-auto" />
              ) : (
                <Table
                  className="mx-auto w-full text-sm"
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
            </TabsContent>
          </Tabs>
        </div>
      </Container>
    </>
  );
};

export default SejarahParlimen;
