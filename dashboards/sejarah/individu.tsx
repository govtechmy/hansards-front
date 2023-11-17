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

type Individu = {
  seat: string;
  election_name: string;
  date: string;
  party: string;
};

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
      cell: ({ getValue }) => <PartyFlag party={getValue()}></PartyFlag>,
    },
    { key: "seat", id: "seat", header: t("seat") },
    {
      key: "party",
      id: "party",
      header: t("party", { ns: "common" }),
    },
  ]);

  useEffect(() => {
    setData("loading", false);
  }, [params]);

  return (
    <Container>
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

            <p className="text-zinc-500 text-center pt-8 lg:pt-12">
              {t("individu.disclaimer")}
            </p>
          </div>
        </div>
      </Section>
    </Container>
  );
};

export default SejarahIndividu;
