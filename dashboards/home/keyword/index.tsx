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
import { differenceInCalendarDays, parseISO } from "date-fns";
import { useTheme } from "next-themes";
import dynamic from "next/dynamic";
import { ParsedUrlQuery } from "querystring";
import { useEffect, useMemo, useRef, useState } from "react";
import KeywordFilter from "./keyword-filter";
import Excerpts, { ExcerptsProps } from "../excerpts";
import { Speaker } from "@lib/types";
import { get } from "@lib/api";

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
  speakers: Array<Speaker>;
  timeseries: Record<"date" | "freq", number[]>;
  top_speakers?: Array<Record<string, number>>;
  top_word_freq?: Record<string, number>;
}

const Keyword = ({
  count,
  excerpts,
  query,
  speakers,
  timeseries,
  top_speakers,
  top_word_freq,
}: KeywordProps) => {
  const { t } = useTranslation(["home", "demografi", "party"]);
  const ref = useRef<HTMLDivElement | null>(null);
  const { theme } = useTheme();

  const { q, dewan, tarikh_mula, tarikh_akhir } = query;
  const keyword = q ? String(q) : undefined;
  const [keywordQuery, setKeywordQuery] = useState(keyword ?? "");
  const [suggestion, setSuggestion] = useState<string>("");

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

  const getAutocomplete = async (query: string) => {
    try {
      const response = await get(
        "autocomplete",
        {
          q: query,
        },
        "api"
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching autocomplete:", error);
      return { suggestions: [], query };
    }
  };

  const barmeter_data = top_speakers
    ? top_speakers.map(s => {
        const id = Object.keys(s)[0];
        const speaker = speakers.find(
          e => String(e.new_author_id) === id
        )?.name;
        const total = s[id];

        return { x: speaker ?? "", y: total };
      })
    : [];

  useEffect(() => {
    setLoading(false);
    setRange([0, timeseries.date.length - 1]);
    if (keyword && ref && ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [timeseries]);

  useEffect(() => {
    const fetchSuggestion = async () => {
      if (keywordQuery.length > 0) {
        try {
          const result = await getAutocomplete(keywordQuery);
          if (result.suggestions && result.suggestions.length > 0) {
            setSuggestion(result.suggestions[0]);
          } else {
            setSuggestion("");
          }
        } catch (error) {
          console.error("Error fetching autocomplete:", error);
          setSuggestion("");
        }
      } else {
        setSuggestion("");
      }
    };

    const debounceTimeout = setTimeout(fetchSuggestion, 200);

    return () => clearTimeout(debounceTimeout);
  }, [keywordQuery]);

  return (
    <Container className="divide-y divide-border">
      <Section>
        {/* Search for any keywords or phrases! */}
        <h2 className="header text-center">{t("search_keywords")}</h2>

        <KeywordFilter
          onLoad={() => setLoading(true)}
          query={query}
          keywordQuery={keywordQuery}
          setKeywordQuery={setKeywordQuery}
          suggestion={suggestion}
          setSuggestion={setSuggestion}
        />

        {/* Time-series of "keyword" in Parliament */}
        <div className="relative mt-6 w-full" ref={ref}>
          <h3 className="title mb-3 block leading-7">
            {keyword &&
              t("timeseries_title", {
                keyword: keyword,
                house: t(house.replace("-", "_"), { ns: "common" }),
              })}
          </h3>
          <SliderProvider>
            {play => (
              <div className="relative">
                <Timeseries
                  className={cn(
                    !loading && chartEmpty && "opacity-10",
                    "h-[250px]"
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
                  onChange={e => setRange(e)}
                />
                {!loading && chartEmpty && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="flex items-center gap-2 rounded-md bg-border px-3 py-1.5">
                      {keyword ? (
                        <>
                          <FaceFrownIcon className="size-6" />
                          {t("placeholder.no_results", { ns: "common" })}
                        </>
                      ) : (
                        <>
                          <MagnifyingGlassIcon className="size-6" />
                          {t("start_search")}
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </SliderProvider>
        </div>
      </Section>

      {count > 0 && (
        <>
          <Excerpts count={count} excerpts={excerpts} query={query} />
          {/* Words related to {{ keyword }} */}
          {top_word_freq && (
            <section className="space-y-6 py-8 lg:space-y-8 lg:py-12">
              <h3 className="header text-center">
                {t("words_related", { keyword: `"${query.q}"` })}
              </h3>

              <BubbleCloud
                className="h-[350px] w-full sm:h-[700px]"
                data={Object.entries(top_word_freq).map(([word, freq]) => ({
                  id: word,
                  value: freq,
                }))}
              />
            </section>
          )}
          {/* "{{ keyword }}": Most spoken by */}
          {top_speakers && (
            <section className="space-y-6 py-8 lg:space-y-8 lg:py-12">
              <h3 className="header text-center">
                {t("most_spoken_by", {
                  keyword: `"${capitalize(String(query.q))}"`,
                })}
              </h3>

              <BarMeter
                className="mx-auto max-w-screen-sm"
                layout="horizontal"
                data={barmeter_data}
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
