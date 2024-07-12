import {
  Container,
  Dropdown,
  ImageWithFallback,
  Skeleton,
  toast,
} from "@components/index";
import { useCache } from "@hooks/useCache";
import { useData } from "@hooks/useData";
import { useFilter } from "@hooks/useFilter";
import { useTranslation } from "@hooks/useTranslation";
import { get } from "@lib/api";
import { PARTIES, statesOptions } from "@lib/options";
import { generateSchema } from "@lib/schema/election";
import { OptionType } from "@lib/types";
import { Trans } from "next-i18next";
import dynamic from "next/dynamic";
import { useEffect } from "react";
import FullResults, { Result } from "./full-results";
import { Parti, PartiResult } from "./types";

/**
 * Sejarah Parti Dashboard
 * @overview Status: In-development
 */

const ComboBox = dynamic(() => import("@components/Combobox"), {
  ssr: false,
});
const PartiTable = dynamic(() => import("./table"), {
  loading: () => <Skeleton height="h-[400px]" width="w-auto" />,
  ssr: false,
});

interface SejarahPartiProps {
  dropdown: Array<string>;
  parti: any;
  params: { name: string; state: string };
}

const SejarahParti = ({ parti, params }: SejarahPartiProps) => {
  const { t } = useTranslation(["sejarah", "party"]);
  const { cache } = useCache();

  const PARTI_OPTIONS: Array<OptionType> = PARTIES.map(key => ({
    label: t(key, { ns: "party" }),
    value: key,
  }));

  const DEFAULT_PARTI = "PERIKATAN";
  const PARTI_OPTION = PARTI_OPTIONS.find(
    e => e.value === (params.name ?? DEFAULT_PARTI)
  );

  const { data, setData } = useData({
    parti_option: PARTI_OPTION,
    state: "mys",
    loading: false,
  });

  const { setFilter } = useFilter({
    nama: params.name,
    negeri: params.state,
  });

  const parti_schema = generateSchema<Parti>([
    {
      key: "election_name",
      id: "election_name",
      header: t("election"),
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
    {
      key: item => item,
      id: "full_result",
      header: "",
      cell: ({ row }) => (
        <FullResults
          options={parti}
          currentIndex={row.index}
          onChange={(option: Parti) =>
            fetchFullResult(option.election_name, option.state)
          }
          columns={generateSchema<PartiResult[number]>([
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
          highlighted={
            data.parti_option ? data.parti_option.value : "PERIKATAN"
          }
        />
      ),
    },
  ]);

  const fetchFullResult = async (
    election: string,
    state: string
  ): Promise<Result<PartiResult>> => {
    const identifier = `${election}_${state}`;
    return new Promise(resolve => {
      if (cache.has(identifier)) return resolve(cache.get(identifier));
      get(
        "/explorer",
        {
          explorer: "ELECTIONS",
          chart: "full_result",
          type: "party",
          election,
          state,
        },
        "sejarah"
      )
        .then(({ data }: { data: { data: PartiResult } }) => {
          const result: Result<PartiResult> = {
            data: data.data.sort(
              (a: PartiResult[number], b: PartiResult[number]) => {
                if (a.seats.won === b.seats.won) {
                  return b.votes.abs - a.votes.abs;
                } else {
                  return b.seats.won - a.seats.won;
                }
              }
            ),
          };
          cache.set(identifier, result);
          resolve(result);
        })
        .catch(e => {
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
    <>
      <Container className="py-8 lg:py-12 xl:grid xl:grid-cols-12 xl:px-0">
        <div className="xl:col-span-10 xl:col-start-2">
          <h2 className="header text-center">{t("parti.header")}</h2>
          <div className="mx-auto w-full py-6 sm:w-[500px]">
            <ComboBox
              placeholder={t("cari_parti")}
              options={PARTI_OPTIONS}
              selected={PARTI_OPTIONS.find(e =>
                data.parti_option
                  ? e.value === data.parti_option.value
                  : undefined
              )}
              icon={value => (
                <div className="flex h-auto max-h-8 w-8 justify-center self-center">
                  <ImageWithFallback
                    className="rounded border border-slate-200 dark:border-zinc-700"
                    src={`/static/images/parties/${value}.png`}
                    width={28}
                    height={18}
                    alt={value}
                    style={{
                      width: "auto",
                      maxWidth: "28px",
                      height: "auto",
                      maxHeight: "28px",
                    }}
                  />
                </div>
              )}
              onChange={selected => {
                setData("parti_option", selected);
                if (selected && data.state) {
                  setData("loading", true);
                  setFilter("nama", selected.value);
                  setFilter("negeri", data.state);
                }
              }}
            />
          </div>

          <div className="py-6 text-lg leading-9">
            <ImageWithFallback
              className="mr-2 inline-block rounded border border-slate-200 dark:border-zinc-800"
              src={`/static/images/parties/${params.name ?? DEFAULT_PARTI}.png`}
              width={32}
              height={18}
              alt={t(params.name ?? DEFAULT_PARTI)}
              inline
            />
            <span className="font-bold">
              {t(params.name ?? DEFAULT_PARTI, { ns: "party" })}
            </span>
            <Trans>{t("parti.title")}</Trans>
            <Dropdown
              onChange={selected => {
                setData("loading", true);
                setData("state", selected.value);
                if (data.parti_option) {
                  setFilter("nama", data.parti_option);
                  setFilter("negeri", selected.value);
                }
              }}
              selected={statesOptions.find(
                state => state.value === (params.state ?? "mys")
              )}
              options={statesOptions}
              enableFlag
              anchor="left"
              width="inline-flex ml-0.5"
            />
          </div>

          <PartiTable
            data={parti}
            columns={parti_schema}
            isLoading={data.loading}
          />
        </div>
      </Container>
    </>
  );
};

export default SejarahParti;
