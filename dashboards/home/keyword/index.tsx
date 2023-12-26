import { Section, Skeleton, Slider } from "@components/index";
import {
  FaceFrownIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { useData } from "@hooks/useData";
import { useSlice } from "@hooks/useSlice";
import { useTranslation } from "@hooks/useTranslation";
import { COLOR } from "@lib/constants";
import { SliderProvider } from "@lib/contexts/slider";
import { cn } from "@lib/helpers";
import { useTheme } from "next-themes";
import dynamic from "next/dynamic";
import { useEffect, useMemo, useRef } from "react";
import KeywordFilter, { KeywordFilterProps } from "./keyword-filter";

/**
 * Keyword
 * @overview Status: In-development
 */

const Timeseries = dynamic(() => import("@charts/timeseries"), {
  loading: () => <Skeleton height="h-[400px]" width="w-auto" />,
  ssr: false,
});

export interface KeywordProps extends Omit<KeywordFilterProps, "onLoad"> {
  timeseries: Record<"date" | "freq", number[]>;
}

const Keyword = ({ dewan, keyword, timeseries }: KeywordProps) => {
  const { t } = useTranslation(["home", "demografi", "party"]);
  const ref = useRef<HTMLDivElement | null>(null);
  const { theme } = useTheme();

  const { data, setData } = useData({
    loading: false,
    minmax: [0, 1],
  });
  const { coordinate } = useSlice(timeseries, data.minmax);

  const isEmpty = coordinate.freq.length === 0 || !keyword;
  const dummyFreq = useMemo(
    () => Array.from({ length: 365 }, () => Math.random() * 25 + 25),
    []
  );

  useEffect(() => {
    setData("loading", false);
    if (keyword && ref && ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [timeseries]);

  return (
    <>
      <Section>
        {/* Search for any keywords or phrases! */}
        <h2 className="header text-center">{t("search_keywords")}</h2>

        <KeywordFilter
          dewan={dewan}
          keyword={keyword}
          onLoad={() => setData("loading", true)}
        />

        <div className="w-full relative mt-6" ref={ref}>
          {/* Time-series of "keyword” in Parliament */}
          <h3 className="title h-7 block mb-3">
            {keyword &&
              t("timeseries_title", {
                keyword: keyword,
              })}
          </h3>
          <SliderProvider>
            {(play) => (
              <>
                <Timeseries
                  className={cn(
                    !data.loading && isEmpty && "opacity-10",
                    "h-[400px]"
                  )}
                  isLoading={data.loading}
                  enableAnimation={!play}
                  interval="day"
                  data={{
                    labels: coordinate.date,
                    datasets: [
                      {
                        type: "bar",
                        data: isEmpty ? dummyFreq : coordinate.freq,
                        label: keyword,
                        backgroundColor:
                          theme === "light"
                            ? COLOR.PRIMARY_H
                            : COLOR.SECONDARY_H,
                        borderColor:
                          theme === "light" ? COLOR.PRIMARY : COLOR.SECONDARY,
                        borderWidth: 1.5,
                      },
                    ],
                  }}
                />
                <Slider
                  className={cn(isEmpty && "opacity-10", "pt-8")}
                  type="range"
                  period="day"
                  value={data.minmax}
                  data={timeseries.date}
                  onChange={(e) => setData("minmax", e)}
                />
              </>
            )}
          </SliderProvider>
          {!data.loading && isEmpty && (
            <div className="absolute inset-0 z-10 flex items-center justify-center">
              <div className="bg-slate-200 dark:bg-zinc-800 flex items-center gap-2 rounded-md px-3 py-1.5">
                {coordinate.freq.length === 0 && (
                  <>
                    <FaceFrownIcon className="h-6 w-6" />
                    {t("placeholder.no_results")}
                  </>
                )}
                {!keyword && (
                  <>
                    <MagnifyingGlassIcon className="h-6 w-6" />
                    {t("start_searching")}
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </Section>
    </>
  );
};

export default Keyword;
