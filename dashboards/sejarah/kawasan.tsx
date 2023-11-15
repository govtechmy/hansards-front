import Skeleton from "@components/Skeleton";
import { useData } from "@hooks/useData";
import { useFilter } from "@hooks/useFilter";
import { useTranslation } from "@hooks/useTranslation";
import { slugify } from "@lib/helpers";
import { generateSchema } from "@lib/schema/election";
import { OptionType } from "@lib/types";
import dynamic from "next/dynamic";
import { useEffect, useMemo } from "react";

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

type Kawasan = {
  seat: string;
  election_name: string;
  date: string;
  party: string;
  name: string;
};

interface SejarahKawasanProps {
  dropdown: Array<{ seat_name: string; type: string }>;
  kawasan: Kawasan[];
  params: { name: string };
}

const SejarahKawasan = ({ dropdown, kawasan, params }: SejarahKawasanProps) => {
  const { t } = useTranslation("sejarah");

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
  ]);

  useEffect(() => {
    setData("loading", false);
  }, [params]);

  return (
    <div className="flex h-full w-full justify-center">
      <div className="flex flex-col h-full w-full max-w-screen-2xl px-3 md:px-4.5 lg:px-6 xl:px-0 py-8 lg:py-12 xl:grid xl:grid-cols-12">
        <div className="xl:col-span-10 xl:col-start-2">
          <h4 className="text-center">{t("kawasan.header")}</h4>
          <div className="mx-auto w-full py-6 sm:w-[500px]">
            <ComboBox
              placeholder={t("cari_kawasan")}
              options={KAWASAN_OPTIONS}
              selected={
                data.kawasan_option
                  ? KAWASAN_OPTIONS.find(
                      (e) => e.value === data.kawasan_option.value
                    )
                  : null
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

          <h5 className="py-6">
            {t("kawasan.title")}
            <span className="text-primary">{KAWASAN_OPTION?.label}</span>
          </h5>

          <KawasanTable
            data={kawasan}
            columns={kawasan_schema}
            isLoading={data.loading}
          />

          <p className="text-zinc-500 text-center pt-8 lg:pt-12">
            {t("kawasan.disclaimer")}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SejarahKawasan;
