import StateDropdown from "@components/Dropdown/StateDropdown";
import ImageWithFallback from "@components/ImageWithFallback";
import PartyFlag from "@components/PartyFlag";
import Skeleton from "@components/Skeleton";
import { useData } from "@hooks/useData";
import { useFilter } from "@hooks/useFilter";
import { useTranslation } from "@hooks/useTranslation";
import { slugify } from "@lib/helpers";
import { generateSchema } from "@lib/schema/election";
import { OptionType } from "@lib/types";
import { Trans } from "next-i18next";
import dynamic from "next/dynamic";
import { useEffect } from "react";

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

type Parti = {
  seats: {
    total: number;
    perc: number;
    won: number;
  };
  votes: {
    abs: number;
    perc: number;
  };
  election_name: string;
  date: string;
  party: string;
  name: string;
};

interface SejarahPartiProps {
  dropdown: Array<string>;
  parti: any;
  params: { name: string; state: string };
}

const SejarahParti = ({ dropdown, parti, params }: SejarahPartiProps) => {
  const { t } = useTranslation(["sejarah", "party"]);

  const PARTI_OPTIONS: Array<OptionType> = dropdown.map((key) => ({
    label: t(key, { ns: "party" }),
    value: key,
  }));

  const DEFAULT_PARTI = "PERIKATAN";
  const PARTI_OPTION = PARTI_OPTIONS.find(
    (e) => e.value === (params.name ?? DEFAULT_PARTI)
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
  ]);

  useEffect(() => {
    setData("loading", false);
  }, [params]);

  return (
    <div className="flex h-full w-full justify-center">
      <div className="flex flex-col h-full w-full max-w-screen-2xl px-3 md:px-4.5 lg:px-6 xl:px-0 py-8 lg:py-12 xl:grid xl:grid-cols-12">
        <div className="xl:col-span-10 xl:col-start-2">
          <h4 className="text-center">{t("parti.header")}</h4>
          <div className="mx-auto w-full py-6 sm:w-[500px]">
            <ComboBox
              placeholder={t("cari_parti")}
              options={PARTI_OPTIONS}
              selected={
                data.parti_option
                  ? PARTI_OPTIONS.find(
                      (e) => e.value === data.parti_option.value
                    )
                  : null
              }
              icon={(value) => (
                <div className="flex h-auto max-h-8 w-8 justify-center self-center">
                  <ImageWithFallback
                    className="border-slate-200 dark:border-zinc-700 rounded border"
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
              onChange={(selected) => {
                setData("parti_option", selected);
                if (selected && data.state) {
                  setData("loading", true);
                  setFilter("nama", selected.value);
                  setFilter("negeri", data.state);
                }
              }}
            />
          </div>

          <div className="text-lg leading-9 py-6">
            <PartyFlag party={params.name ?? DEFAULT_PARTI}>
              {(party) => (
                <span>
                  <span className="font-bold">{t(party, { ns: "party" })}</span>
                  <Trans>{t("parti.title")}</Trans>
                  <StateDropdown
                    currentState={params.state ?? "mys"}
                    onChange={(selected) => {
                      setData("loading", true);
                      setData("state", selected.value);
                      if (data.parti_option) {
                        setFilter("nama", data.parti_option);
                        setFilter("negeri", selected.value);
                      }
                    }}
                    width="inline-flex ml-0.5"
                    anchor="left"
                  />
                </span>
              )}
            </PartyFlag>
          </div>

          <PartiTable
            data={parti}
            columns={parti_schema}
            isLoading={data.loading}
          />
        </div>
      </div>
    </div>
  );
};

export default SejarahParti;
