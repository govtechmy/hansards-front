import { Container, Section, Skeleton, Slider } from "@components/index";
import {
  FaceFrownIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { useSlice } from "@hooks/useSlice";
import { useTranslation } from "@hooks/useTranslation";
import { COLOR } from "@lib/constants";
import { SliderProvider } from "@lib/contexts/slider";
import { cn } from "@lib/helpers";
import { capitalize } from "@lib/utils";
import { UID_TO_NAME_DR } from "@lib/uid";
import { differenceInCalendarDays, parseISO } from "date-fns";
import { useTheme } from "next-themes";
import dynamic from "next/dynamic";
import { ParsedUrlQuery } from "querystring";
import { useEffect, useMemo, useRef, useState } from "react";
import KeywordFilter from "./keyword-filter";
import Excerpts, { ExcerptsProps } from "../excerpts";

/**
 * Keyword
 * @overview Status: In-development
 */

const BarMeter = dynamic(() => import("@charts/bar-meter"), {
  loading: () => <Skeleton height="h-[350px]" />,
  ssr: false,
});
const BubbleCloud = dynamic(() => import("@charts/bubble-cloud"), {
  loading: () => <Skeleton height="h-[350px] sm:h-[700px]" />,
  ssr: false,
});
const Timeseries = dynamic(() => import("@charts/timeseries"), {
  loading: () => <Skeleton height="h-[400px]" width="w-auto" />,
  ssr: false,
});

export interface KeywordProps extends ExcerptsProps {
  query: ParsedUrlQuery;
  timeseries: Record<"date" | "freq", number[]>;
  top_speakers?: Array<Record<string, number>>;
  top_word_freq?: Record<string, number>;
}

const Keyword = ({ count, excerpts, query, timeseries, top_speakers, top_word_freq }: KeywordProps) => {
  const { t } = useTranslation(["home", "demografi", "party"]);
  const ref = useRef<HTMLDivElement | null>(null);
  const { theme } = useTheme();

  const { q, dewan, tarikh_mula, tarikh_akhir } = query;
  const keyword = q ? String(q) : undefined;
  const house = dewan ? String(dewan) : "";
  const start =
    tarikh_mula !== undefined && !Array.isArray(tarikh_mula)
      ? parseISO(tarikh_mula)
      : undefined;
  const end =
    tarikh_akhir !== undefined && !Array.isArray(tarikh_akhir)
      ? parseISO(tarikh_akhir)
      : undefined;
  const diff = start && end ? differenceInCalendarDays(start, end) : 0;

  const [loading, setLoading] = useState<boolean>(false);
  const [range, setRange] = useState<number[]>([0, timeseries.date.length - 1]);
  const { coordinate } = useSlice(timeseries, range as [number, number]);

  const chartEmpty = coordinate.freq.length === 0;
  const dummyFreq = useMemo(
    () => Array.from({ length: 365 }, () => Math.random() * 25 + 25),
    []
  );

  useEffect(() => {
    setLoading(false);
    setRange([0, timeseries.date.length - 1]);
    if (keyword && ref && ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [timeseries]);

  return (
    <Container className="divide-y divide-border">
      <Section>
        {/* Search for any keywords or phrases! */}
        <h2 className="header text-center">{t("search_keywords")}</h2>

        <KeywordFilter onLoad={() => setLoading(true)} query={query} />

        <div className="w-full relative mt-6" ref={ref}>
          {/* Time-series of "keyword” in Parliament */}
          <h3 className="title leading-7 block mb-3">
            {keyword &&
              t("timeseries_title", {
                keyword: keyword,
                house: t(house.replace("-", "_"), { ns: "common" })
              })}
          </h3>
          <SliderProvider>
            {(play) => (
              <>
                <Timeseries
                  className={cn(
                    !loading && chartEmpty && "opacity-10",
                    "h-[300px]"
                  )}
                  isLoading={loading}
                  enableAnimation={!play}
                  interval={diff > 1095 ? "month" : "day"}
                  data={{
                    labels: coordinate.date,
                    datasets: [
                      {
                        type: "bar",
                        data: chartEmpty ? dummyFreq : coordinate.freq,
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
                  className={cn(chartEmpty && "opacity-10", "pt-8")}
                  type="range"
                  period={diff > 1095 ? "month" : "day"}
                  value={range}
                  data={timeseries.date}
                  onChange={(e) => setRange(e)}
                />
              </>
            )}
          </SliderProvider>
          {!loading && chartEmpty && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-border flex items-center gap-2 rounded-md px-3 py-1.5">
                {keyword ? (
                  <>
                    <FaceFrownIcon className="h-6 w-6" />
                    {t("placeholder.no_results", { ns: "common" })}
                  </>
                ) : (
                  <>
                    <MagnifyingGlassIcon className="h-6 w-6" />
                    {t("start_search")}
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </Section>

      {count > 0 && (
        <>
          <Excerpts count={count} excerpts={excerpts} query={query} />
          {top_word_freq && (
            <section className="py-8 lg:py-12 space-y-6 lg:space-y-8">
              {/* Words related to {{ keyword }} */}
              <h3 className="header text-center">
                {t("words_related", { keyword: `"${query.q}"` })}
              </h3>

              <BubbleCloud
                className="w-full h-[350px] sm:h-[900px]"
                data={Object.entries(top_word_freq).map(([word, freq]) => ({
                  id: word,
                  value: freq,
                }))}
              />
            </section>
          )}
          {top_speakers && (
            <section className="py-8 lg:py-12 space-y-6 lg:space-y-8">
              {/* "{{ keyword }}": Most spoken by */}
              <h3 className="header text-center">
                {t("most_spoken_by", {
                  keyword: `"${capitalize(String(query.q))}"`,
                })}
              </h3>

              <BarMeter
                className="max-w-screen-sm mx-auto"
                layout="horizontal"
                data={top_speakers.map((s) => ({
                  x: UID_TO_NAME_DR[Object.keys(s)[0]] ?? Object.keys(s)[0],
                  y: Object.values(s)[0],
                }))}
                relative
                precision={0}
              />
            </section>
          )}
        </>
      )}
    </Container>
  );
};

export default Keyword;
