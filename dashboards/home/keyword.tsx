import {
  Button,
  Card,
  Dropdown,
  Input,
  PartyFlag,
  Section,
  Skeleton,
  Slider,
  Spinner,
  StateDropdown,
} from "@components/index";
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/20/solid";
import { useData } from "@hooks/useData";
import { useFilter } from "@hooks/useFilter";
import { useSlice } from "@hooks/useSlice";
import { useTranslation } from "@hooks/useTranslation";
import { COLOR } from "@lib/constants";
import { SliderProvider } from "@lib/contexts/slider";
import { cn } from "@lib/helpers";
import { OptionType } from "@lib/types";
import { useTheme } from "next-themes";
import dynamic from "next/dynamic";
import { useRef } from "react";

/**
 * Keyword
 * @overview Status: In-development
 */

const Timeseries = dynamic(() => import("@charts/timeseries"), {
  loading: () => <Skeleton height="h-[400px]" width="w-auto" />,
  ssr: false,
});

export interface KeywordProps {
  keyword: string;
  timeseries: Record<"date" | "freq", number[]>;
}

const Keyword = ({ keyword, timeseries }: KeywordProps) => {
  const { t } = useTranslation(["home", "kehadiran", "party"]);
  const ref = useRef<HTMLDivElement | null>(null);
  const { theme } = useTheme();

  const PARTY_OPTIONS: OptionType[] = [
    { label: t("all_parties"), value: "all_parties" },
  ].concat(
    ["BEBAS", "BN", "DAP", "PAS", "PH", "PN", "WARISAN"].map((key: string) => ({
      label: t(key, { ns: "party" }),
      value: key,
    }))
  );

  const AGE_OPTIONS: OptionType[] = [
    { label: t("all_ages"), value: "all_ages" },
  ].concat(
    ["18-29", "30-39", "40-49", "50-59", "60-69", "70+"].map((key: string) => ({
      label: t(key),
      value: key,
    }))
  );

  const SEX_OPTIONS: OptionType[] = [
    { label: t("both_sexes"), value: "both_sexes" },
  ].concat(
    ["m", "f"].map((key: string) => ({
      label: t(key, { ns: "kehadiran" }),
      value: key,
    }))
  );

  const ETNIK_OPTIONS: OptionType[] = [
    { label: t("all_ethnicities"), value: "all_ethnicities" },
  ].concat(
    ["malay", "chinese", "indian", "bumi_sbh", "bumi_swk", "other"].map(
      (key: string) => ({
        label: t(key, { ns: "kehadiran" }),
        value: key,
      })
    )
  );

  const { data, setData } = useData({
    query: keyword ?? "",
    start_date: "",
    end_date: "",
    state: "mys",
    age: "all_ages",
    etnik: "all_ethnicities",
    party: "all_parties",
    sex: "both_sexes",
    loading: false,
    minmax: [0, 1],
    valid_query: false,
    valid_start: false,
    valid_end: false,
  });

  const { setFilter } = useFilter({
    q: keyword,
    house: "",
    start_date: "",
    end_date: "",
  });

  const handleSearch = (keyword: string) => {
    setFilter("q", keyword);
    setFilter("start_date", data.start_date);
    setFilter("end_date", data.end_date);
    if (ref && ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  };

  const { coordinate } = useSlice(timeseries, data.minmax);

  const className = {
    label: "text-zinc-500 text-xs uppercase pb-1",
    input:
      "bg-white dark:bg-zinc-900 active:bg-slate-100 active:dark:bg-zinc-800 border border-slate-200 dark:border-zinc-800 hover:dark:bg-zinc-800/50 rounded-md outline-none shadow-button",
  };

  return (
    <>
      <Section>
        <h2 className="header text-center pb-8">{t("search_keywords")}</h2>
        <div className="flex flex-col gap-6 rounded-xl sm:flex-row lg:gap-8">
          <Card className="bg-slate-50 dark:bg-zinc-950 shadow-button h-max w-full space-y-6 p-6 sm:w-[400px] shrink-0">
            <p className="font-medium">{t("form_title")}</p>
            <div>
              <p className={className.label}>{t("keywords")}</p>
              <Input
                icon={
                  <MagnifyingGlassIcon className="text-zinc-500 h-4.5 w-4.5 self-center" />
                }
                className={cn(className.input, "pl-10 pr-4.5 py-3 text-base")}
                placeholder={t("search_keyword")}
                required
                autoFocus
                type="text"
                value={data.query}
                validation={data.empty_query}
                onChange={(value) => setData("query", value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSearch(data.query);
                }}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className={className.label}>{t("start_date")}</p>
                <input
                  type="date"
                  className={cn(
                    className.input,
                    "relative w-full pl-8 py-1.5 pr-3 select-none",
                    "text-zinc-900 dark:text-white text-left text-sm",
                    "focus:ring-2 ring-blue-600 dark:ring-primary-dark",
                    data.valid_start && "ring-danger dark:ring-danger ring-1"
                  )}
                  value={data.start_date}
                  onChange={(selected) =>
                    setData("start_date", selected.target.value)
                  }
                  min={"1955-01-01"}
                  max={new Date().toISOString().slice(0, 10)}
                />
              </div>
              <div>
                <p className={className.label}>{t("end_date")}</p>
                <input
                  type="date"
                  className={cn(
                    className.input,
                    "relative w-full pl-8 py-1.5 pr-3 select-none",
                    "text-zinc-900 dark:text-white text-left text-sm",
                    "focus:ring-2 ring-blue-600 dark:ring-primary-dark",
                    data.valid_end && "ring-danger dark:ring-danger ring-1"
                  )}
                  value={data.end_date}
                  onChange={(selected) =>
                    setData("end_date", selected.target.value)
                  }
                  min={"1955-01-01"}
                  max={new Date().toISOString().slice(0, 10)}
                />
              </div>
              <div>
                <p className={className.label}>{t("party")}</p>
                <Dropdown
                  enableFlag
                  flag={(party) => (
                    <PartyFlag party={party} children={() => true} />
                  )}
                  options={PARTY_OPTIONS}
                  anchor="left"
                  width="w-full"
                  selected={PARTY_OPTIONS.find((e) => e.value === data.party)}
                  onChange={(e) => setData("party", e.value)}
                />
              </div>
              <div>
                <p className={className.label}>{t("sex")}</p>
                <Dropdown
                  options={SEX_OPTIONS}
                  anchor="left"
                  width="w-full"
                  selected={SEX_OPTIONS.find((e) => e.value === data.sex)}
                  onChange={(e) => setData("sex", e.value)}
                />
              </div>
              <div>
                <p className={className.label}>{t("age_group")}</p>
                <Dropdown
                  options={AGE_OPTIONS}
                  anchor="left"
                  width="w-full"
                  selected={AGE_OPTIONS.find((e) => e.value === data.age)}
                  onChange={(e) => setData("age", e.value)}
                />
              </div>
              <div>
                <p className={className.label}>{t("ethnicity")}</p>
                <Dropdown
                  options={ETNIK_OPTIONS}
                  anchor="left"
                  width="w-full"
                  selected={ETNIK_OPTIONS.find((e) => e.value === data.etnik)}
                  onChange={(e) => setData("etnik", e.value)}
                />
              </div>
              <div className="col-span-2">
                <p className={className.label}>{t("state")}</p>
                <StateDropdown
                  currentState={data.state}
                  onChange={(selected) => setData("state", selected.value)}
                  anchor="left"
                  width="w-full"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button
                variant="ghost"
                className="w-fit h-[42px] justify-center"
                onClick={() => {
                  setData("age", "");
                  setData("start_date", "");
                  setData("end_date", "");
                  setData("etnik", "");
                  setData("party", "");
                  setData("query", "");
                  setData("sex", "");
                }}
              >
                <XMarkIcon className="h-4.5 w-4.5" />
                {t("clear_all", { ns: "common" })}
              </Button>
              <Button
                variant="primary"
                className="w-[120px] h-[42px] justify-center"
                onClick={() => handleSearch(data.query)}
              >
                {t("placeholder.search", { ns: "common" })}
              </Button>
            </div>
          </Card>
          <div className="w-full" ref={ref}>
            {data.loading ? (
              <div className="shadow-button border-outline dark:border-washed-dark flex h-full min-h-[60px] w-full items-center justify-center rounded-xl border">
                <Spinner loading={data.loading} />
              </div>
            ) : (
              <>
                <SliderProvider>
                  {(play) => (
                    <>
                      <Timeseries
                        title={t("timeseries_title", { keyword: keyword })}
                        className="h-[400px]"
                        isLoading={data.loading}
                        enableAnimation={!play}
                        interval="day"
                        data={{
                          labels: coordinate.date,
                          datasets: [
                            {
                              type: "bar",
                              data: coordinate.freq,
                              label: keyword,
                              backgroundColor:
                                theme === "light"
                                  ? COLOR.PRIMARY_H
                                  : COLOR.SECONDARY_H,
                              borderColor:
                                theme === "light"
                                  ? COLOR.PRIMARY
                                  : COLOR.SECONDARY,
                              borderWidth: 1.5,
                            },
                          ],
                        }}
                      />
                      <Slider
                        type="range"
                        period="day"
                        value={data.minmax}
                        data={timeseries.date}
                        onChange={(e) => setData("minmax", e)}
                      />
                    </>
                  )}
                </SliderProvider>
              </>
            )}
          </div>
        </div>
      </Section>
    </>
  );
};

export default Keyword;
