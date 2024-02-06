import Container from "@components/Container";
import PartyFlag from "@components/PartyFlag";
import Section from "@components/Section";
import Skeleton from "@components/Skeleton";
import Tabs, { Panel } from "@components/Tabs";
import { useData } from "@hooks/useData";
import { useFilter } from "@hooks/useFilter";
import { useTranslation } from "@hooks/useTranslation";
import { slugify } from "@lib/helpers";
import { generateSchema } from "@lib/schema/election";
import { OptionType } from "@lib/types";
import dynamic from "next/dynamic";
import { useEffect, useMemo } from "react";
import {
  BaseResult,
  Individu,
  IndividuResult,
} from "./types";
import FullResults, { Result } from "./full-results";
import { useCache } from "@hooks/useCache";
import { Toast, toast } from "@components/index";
import { get } from "@lib/api";

/**
 * Sejarah Individu Dashboard
 * @overview Status: In-development
 */

const ComboBox = dynamic(() => import("@components/Combobox"), {
  ssr: false,
});
const skeleton = () => <Skeleton height="h-[300px]" width="w-auto" />;
const IndividuTable = dynamic(() => import("./table"), {
  loading: skeleton,
  ssr: false,
});
const Table = dynamic(() => import("@charts/table"), {
  loading: skeleton,
  ssr: false,
});

interface SejarahIndividuProps {
  dropdown: Array<string>;
  params: { name: string };
  parlimen: { dewan_rakyat: Individu[] };
}

const SejarahIndividu = ({
  dropdown,
  params,
  parlimen,
}: SejarahIndividuProps) => {
  const { t } = useTranslation("sejarah");
  const { cache } = useCache();

  const INDIVIDU_OPTIONS: Array<OptionType> = dropdown.map((key: string) => {
    return { label: key, value: slugify(key) };
  });

  const DEFAULT_INDIVIDU = "tunku-abdul-rahman-putra-alhaj";
  const INDIVIDU_OPTION = useMemo(() => {
    return INDIVIDU_OPTIONS.find(
      (e) => e.value === (params.name ?? DEFAULT_INDIVIDU)
    );
  }, [params]);

  const { data, setData } = useData({
    individu_option: INDIVIDU_OPTION,
    parlimen: parlimen,
    loading: false,
  });

  const { setFilter } = useFilter({
    nama: params.name,
  });

  const individu_schema = generateSchema<Individu>([
    {
      key: "election_name",
      id: "election_name",
      header: t("election"),
      cell: ({ getValue }) => <PartyFlag party={getValue()} />,
    },
    { key: "seat", id: "seat", header: t("seat") },
    {
      key: "party",
      id: "party",
      header: t("party", { ns: "common" }),
    },
    { key: "votes", id: "votes", header: t("votes_won") },
    { key: "result", id: "result", header: t("result") },
    {
      key: (item) => item,
      id: "full_result",
      header: "",
      cell: ({ row }) => (
        <FullResults
          options={parlimen.dewan_rakyat}
          currentIndex={row.index}
          onChange={(option: Individu) =>
            fetchFullResult(option.election_name, option.seat)
          }
          columns={generateSchema<BaseResult>([
            {
              key: "name",
              id: "name",
              header: t("name"),
            },
            {
              key: "party",
              id: "party",
              header: t("party", { ns: "common" }),
            },
            {
              key: "votes",
              id: "votes",
              header: t("votes_won"),
            },
          ])}
          highlighted={data.individu_option ? data.individu_option.value : ""}
        />
      ),
    },
  ]);

  const fetchFullResult = async (
    election: string,
    seat: string
  ): Promise<Result<BaseResult[]>> => {
    const identifier = `${election}_${seat}`;
    return new Promise((resolve) => {
      if (cache.has(identifier)) return resolve(cache.get(identifier));
      get(
        "/explorer",
        {
          explorer: "ELECTIONS",
          chart: "full_result",
          type: "candidates",
          election,
          seat,
        },
        "sejarah"
      )
        .then(({ data }: { data: { data: IndividuResult } }) => {
          const data2 = data.data;
          const result: Result<BaseResult[]> = {
            data: data2.data.sort((a, b) => b.votes.abs - a.votes.abs),
            votes: [
              {
                x: "majority",
                abs: data2.votes.majority,
                perc: data2.votes.majority_perc,
              },
              {
                x: "voter_turnout",
                abs: data2.votes.voter_turnout,
                perc: data2.votes.voter_turnout_perc,
              },
              {
                x: "rejected_votes",
                abs: data2.votes.votes_rejected,
                perc: data2.votes.votes_rejected_perc,
              },
            ],
          };
          cache.set(identifier, result);
          resolve(result);
        })
        .catch((e) => {
          toast.error(
            t("toast.request_failure", { ns: "common" }),
            t("toast.try_again", { ns: "common" })
          );
          console.error(e);
        });
    });
  };

  useEffect(() => {
    setData("loading", false);
  }, [params]);

  return (
    <Container>
      <Toast />
      <Section>
        <div className="xl:grid xl:grid-cols-12">
          <div className="xl:col-span-10 xl:col-start-2">
            <h2 className="header text-center">{t("individu.header")}</h2>
            <div className="mx-auto w-full py-6 sm:w-[500px]">
              <ComboBox
                placeholder={t("cari_individu")}
                options={INDIVIDU_OPTIONS}
                selected={
                  data.individu_option
                    ? INDIVIDU_OPTIONS.find(
                        (e) => e.value === data.individu_option.value
                      )
                    : null
                }
                onChange={(selected) => {
                  setData("individu_option", selected);
                  if (selected) {
                    setData("loading", true);
                    setFilter("nama", selected.value);
                  }
                }}
              />
            </div>

            <Tabs
              title={
                <h3 className="title py-6">
                  {t("individu.title")}
                  <span className="text-primary">{INDIVIDU_OPTION?.label}</span>
                </h3>
              }
              current={data.tab_idx}
              onChange={(index) => setData("tab_idx", index)}
              className="pb-6"
            >
              <Panel name={t("dewan_rakyat", { ns: "common" })}>
                {data.loading ? (
                  <Skeleton height="h-[550px]" width="w-auto" />
                ) : (
                  <IndividuTable
                    className="lg:w-full mx-auto"
                    data={parlimen.dewan_rakyat}
                    columns={individu_schema}
                    isLoading={data.loading}
                  />
                )}
              </Panel>
              <Panel name={t("dewan_negara", { ns: "common" })}>
                {data.loading ? (
                  <Skeleton height="h-[300px]" width="w-auto" />
                ) : (
                  <Table
                    className="text-sm lg:w-full mx-auto"
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
                        start_date: "1965-11-19",
                        end_date: "1969-11-19",
                        method: "Appointed by DUN",
                        state: "Kedah",
                      },
                      {
                        start_date: "1955-11-19",
                        end_date: "1959-11-19",
                        method: "Appointed by DUN",
                        state: "Kedah",
                      },
                    ]}
                  />
                )}
              </Panel>
            </Tabs>
          </div>
        </div>
      </Section>
    </Container>
  );
};

export default SejarahIndividu;
