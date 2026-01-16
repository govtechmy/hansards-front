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
import { useTheme } from "next-themes";
import dynamic from "next/dynamic";
import { useEffect, useMemo, useRef, useState } from "react";
import MPFilter from "./mp-filter";
import { differenceInCalendarDays, parseISO } from "date-fns";
import { ParsedUrlQuery } from "querystring";
// import { ALL_AGES, ALL_ETHNICITIES, ALL_PARTIES, BOTH_SEXES, } from "../filter-options";
import Excerpts, { ExcerptsProps } from "../excerpts";
import { Speaker } from "@lib/types";

/**
 * MP
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

export interface MPProps extends ExcerptsProps {
  query: ParsedUrlQuery;
  speakers: Array<Speaker>;
  timeseries: Record<"date" | "freq", number[]>;
  top_speakers?: Array<Record<string, number>>;
  top_word_freq?: Record<string, number>;
}

const MP = ({
  count,
  excerpts,
  query,
  speakers,
  timeseries,
  top_speakers,
  top_word_freq,
}: MPProps) => {
  const { t } = useTranslation(["home", "demografi", "party"]);
  const ref = useRef<HTMLDivElement | null>(null);
  const { resolvedTheme } = useTheme();

  const { uid, dewan, tarikh_mula, tarikh_akhir } = query;
  const hasQuery = Object.keys(query).length > 0;

  const mp = uid ? String(uid) : "";
  const house = dewan ? String(dewan) : undefined;

  const start_date = tarikh_mula ? String(tarikh_mula) : "";
  const end_date = tarikh_akhir ? String(tarikh_akhir) : "";
  const start = start_date ? parseISO(start_date) : undefined;
  const end = end_date ? parseISO(end_date) : undefined;
  const diff = start && end ? differenceInCalendarDays(start, end) : 0;

  const [loading, setLoading] = useState<boolean>(false);
  const [ind_or_grp, setIndOrGrp] = useState<string>(
    !hasQuery || mp ? "individu" : "group"
  );
  const IS_INDIVIDU = ind_or_grp === "individu";
  const defaultTimeseries = useMemo(
    () => ({
      date: Array.from({ length: 365 }, (_, i) => i * 86400000),
      freq: [],
    }),
    []
  );
  const [useDefaultDesign, setUseDefaultDesign] = useState(false);
  const activeTimeseries = useDefaultDesign ? defaultTimeseries : timeseries;
  const [range, setRange] = useState<number[]>([
    0,
    activeTimeseries.date.length > 0 ? activeTimeseries.date.length - 1 : 0,
  ]);
  const { coordinate } = useSlice(activeTimeseries, range as [number, number]);
  const chartEmpty =
    coordinate.freq.length === 0 ||
    (mp && !IS_INDIVIDU) ||
    (!mp && IS_INDIVIDU);
  const dummyFreq = Array.from({ length: 365 }, () => Math.random() * 25 + 25);
  const shouldShowLiveData =
    hasQuery && ((mp && IS_INDIVIDU) || (!mp && !IS_INDIVIDU));

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

  const handleModeChange = (mode: string) => {
    setIndOrGrp(prev => {
      if (prev !== mode) {
        setUseDefaultDesign(true);
      }
      return mode;
    });
  };

  useEffect(() => {
    setLoading(false);
    if (hasQuery && ref && ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [timeseries, hasQuery]);

  useEffect(() => {
    setRange(
      activeTimeseries.date.length > 0
        ? [0, activeTimeseries.date.length - 1]
        : [0, 0]
    );
  }, [activeTimeseries]);

  useEffect(() => {
    if (shouldShowLiveData && useDefaultDesign) {
      setUseDefaultDesign(false);
    }
  }, [shouldShowLiveData, useDefaultDesign]);

  return (
    <Container className="divide-y divide-border">
      <Section>
        {/* Search Individual / MPs */}
        <h2 className="header text-center">
          {IS_INDIVIDU ? t("search_individual_mp") : t("search_mps")}
        </h2>

        {/* Filter */}
        <MPFilter
          onLoad={() => setLoading(true)}
          ind_or_grp={ind_or_grp}
          speakers={speakers}
          onFilter={handleModeChange}
          query={query}
        />

        <div className="relative mt-6 w-full" ref={ref}>
          {/* Search */}
          <h3 className="title mb-3 block leading-7">
            {hasQuery &&
            house !== undefined &&
            ((mp && IS_INDIVIDU) || (!mp && !IS_INDIVIDU))
              ? IS_INDIVIDU
                ? t("timeseries_mp", {
                    mp:
                      speakers.find(e => String(e.new_author_id) === uid)
                        ?.name ?? "",
                    house: t(house.replace("-", "_"), { ns: "common" }),
                  })
                : t("timeseries_mps", {
                    house: t(house.replace("-", "_"), { ns: "common" }),
                  })
              : ""}
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
                        label: chartEmpty ? "" : t("total_words"),
                        backgroundColor:
                          resolvedTheme === "light"
                            ? COLOR.PRIMARY_H
                            : COLOR.SECONDARY_H,
                        borderColor:
                          resolvedTheme === "light"
                            ? COLOR.PRIMARY
                            : COLOR.SECONDARY,
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
                  data={activeTimeseries.date}
                  onChange={e => setRange(e)}
                />
                {!loading && chartEmpty && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="flex items-center gap-2 rounded-md bg-border px-3 py-1.5">
                      {!hasQuery ||
                      (mp && !IS_INDIVIDU) ||
                      (!mp && IS_INDIVIDU) ? (
                        <>
                          <MagnifyingGlassIcon className="size-6" />
                          {t("start_search")}
                        </>
                      ) : (
                        <>
                          <FaceFrownIcon className="size-6" />
                          {t("placeholder.no_results", { ns: "common" })}
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

      {count > 0 && ((mp && IS_INDIVIDU) || (!mp && !IS_INDIVIDU)) && (
        <>
          <Excerpts count={count} excerpts={excerpts} query={query} />
          {/* "{{ name }}"'s most spoken words */}
          {top_word_freq && (
            <section className="space-y-6 py-8 lg:space-y-8 lg:py-12">
              <h3 className="header text-center">
                {t("most_spoken_words", {
                  name: IS_INDIVIDU
                    ? `${
                        speakers.find(e => String(e.new_author_id) === uid)
                          ?.name ?? ""
                      }`
                    : "",
                })}
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
          {top_speakers && !IS_INDIVIDU && (
            <section className="space-y-6 py-8 lg:space-y-8 lg:py-12">
              <h3 className="header text-center"></h3>

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

export default MP;
