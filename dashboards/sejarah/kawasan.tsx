import Container from "@components/Container";
import Skeleton from "@components/Skeleton";
import { toast } from "@components/Toast";
import { useCache } from "@hooks/useCache";
import { useData } from "@hooks/useData";
import { useFilter } from "@hooks/useFilter";
import { useTranslation } from "@hooks/useTranslation";
import { get } from "@lib/api";
import { slugify } from "@lib/helpers";
import { generateSchema } from "@lib/schema/election";
import { OptionType } from "@lib/types";
import dynamic from "next/dynamic";
import { useEffect, useMemo } from "react";
import FullResults, { Result } from "./full-results";
import { BaseResult, Kawasan, KawasanResult } from "./types";

/**
 * Sejarah Kawasan Dashboard
 * @overview Status: In-development
 */

const ComboBox = dynamic(() => import("@components/Combobox"), {
  ssr: false,
});
const KawasanTable = dynamic(() => import("./table"), {
  loading: () => <Skeleton height="h-[400px] lg:h-[500px]" width="w-auto" />,
  ssr: false,
});

interface SejarahKawasanProps {
  dropdown: Array<{ seat_name: string; type: string }>;
  kawasan: Kawasan[];
  params: { name: string };
}

const SejarahKawasan = ({ dropdown, kawasan, params }: SejarahKawasanProps) => {
  const { t } = useTranslation("sejarah");
  const { cache } = useCache();

  const KAWASAN_OPTIONS: Array<OptionType> = dropdown
    .filter((e) => e.type !== "dun")
    .map((key) => ({
      label: key.seat_name,
      value: slugify(key.seat_name),
    }));

  const DEFAULT_KAWASAN = "padang-besar-perlis";
  const KAWASAN_OPTION = useMemo(() => {
    return KAWASAN_OPTIONS.find(
      (e) => e.value === (params.name ?? DEFAULT_KAWASAN)
    );
  }, [params]);

  const { data, setData } = useData({
    kawasan_option: KAWASAN_OPTION,
    kawasan_name: KAWASAN_OPTION?.label,
    loading: false,
  });

  const { setFilter } = useFilter({
    nama: params.name,
  });

  const kawasan_schema = generateSchema<Kawasan>([
    {
      key: "election_name",
      id: "election_name",
      header: t("election"),
    },
    { key: "seat", id: "seat", header: t("seat") },
    {
      key: "party",
      id: "party",
      header: t("party", { ns: "common" }),
    },
    { key: "name", id: "name", header: t("name") },
    { key: "majority", id: "majority", header: t("majority") },
    {
      key: (item) => item,
      id: "full_result",
      header: "",
      cell: ({ row, getValue }) => {
        return (
          <FullResults
            options={kawasan}
            currentIndex={row.index}
            onChange={(option: Kawasan) =>
              fetchFullResult(option.election_name, option.seat)
            }
            columns={generateSchema<BaseResult>([
              { key: "name", id: "name", header: t("name") },
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
          />
        );
      },
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
        .then(({ data }: { data: { data: KawasanResult } }) => {
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
    <>
      <Container className="xl:px-0 py-8 lg:py-12 xl:grid xl:grid-cols-12">
        <div className="xl:col-span-10 xl:col-start-2">
          <h2 className="header text-center">{t("kawasan.header")}</h2>
          <div className="mx-auto w-full py-6 sm:w-[500px]">
            <ComboBox
              placeholder={t("cari_kawasan")}
              options={KAWASAN_OPTIONS}
              selected={
                KAWASAN_OPTIONS.find(
                  (e) =>
                    data.kawasan_option
                      ? e.value === data.kawasan_option.value
                      : undefined
                )
              }
              onChange={(selected) => {
                setData("kawasan_option", selected);
                if (selected) {
                  setData("loading", true);
                  setFilter("nama", selected.value);
                }
              }}
            />
          </div>

          <h3 className="title py-6">
            {t("kawasan.title")}
            <span className="text-primary">{KAWASAN_OPTION?.label}</span>
          </h3>

          <KawasanTable
            data={kawasan}
            columns={kawasan_schema}
            isLoading={data.loading}
          />
        </div>
      </Container>
    </>
  );
};

export default SejarahKawasan;
