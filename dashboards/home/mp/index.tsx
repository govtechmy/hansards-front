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
import { UID_TO_NAME_DR } from "@lib/uid";
import { differenceInCalendarDays, parseISO } from "date-fns";
import { ParsedUrlQuery } from "querystring";
import {
  ALL_AGES,
  ALL_ETHNICITIES,
  ALL_PARTIES,
  BOTH_SEXES,
} from "../filter-options";
import Excerpts, { ExcerptsProps } from "../excerpts";

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
  timeseries: Record<"date" | "freq", number[]>;
  top_speakers?: Array<Record<string, number>>;
  top_word_freq?: Record<string, number>;
}

const MP = ({
  count,
  excerpts,
  query,
  timeseries,
  top_speakers,
  top_word_freq,
}: MPProps) => {
  const { t } = useTranslation(["home", "demografi", "party"]);
  const ref = useRef<HTMLDivElement | null>(null);
  const { theme } = useTheme();

  const { uid, dewan, tarikh_mula, tarikh_akhir, umur, etnik, parti, jantina } =
    query;
  const hasQuery = Object.keys(query).length > 0;

  const mp = uid ? String(uid) : "";
  const house = dewan ? String(dewan) : undefined;
  const mp_name = house === "dewan-rakyat" ? UID_TO_NAME_DR : UID_TO_NAME_DR;

  const age = umur ? String(umur) : ALL_AGES;
  const ethnic = etnik ? String(etnik) : ALL_ETHNICITIES;
  const party = parti ? String(parti) : ALL_PARTIES;
  const sex = jantina ? String(jantina) : BOTH_SEXES;

  const start_date = tarikh_mula ? String(tarikh_mula) : "";
  const end_date = tarikh_akhir ? String(tarikh_akhir) : "";
  const start = start_date ? parseISO(start_date) : undefined;
  const end = end_date ? parseISO(end_date) : undefined;
  const diff = start && end ? differenceInCalendarDays(start, end) : 0;

  const [loading, setLoading] = useState<boolean>(false);
  const [ind_or_grp, setIndOrGrp] = useState<string>(mp ? "individu" : "group");
  const IS_INDIVIDU = ind_or_grp === "individu";

  const [range, setRange] = useState<number[]>([0, timeseries.date.length - 1]);
  const { coordinate } = useSlice(timeseries, range as [number, number]);
  const chartEmpty =
    coordinate.freq.length === 0 ||
    (mp && !IS_INDIVIDU) ||
    (!mp && IS_INDIVIDU);
  const dummyFreq = useMemo(
    () => Array.from({ length: 365 }, () => Math.random() * 25 + 25),
    []
  );

  useEffect(() => {
    setLoading(false);
    setRange([0, timeseries.date.length - 1]);
    if (hasQuery && ref && ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [timeseries]);

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
          onFilter={setIndOrGrp}
          uid={mp}
          dewan={house}
          party={party}
          sex={sex}
          age={age}
          ethnic={ethnic}
          start={start}
          end={end}
        />

        <div className="w-full relative mt-6" ref={ref}>
          {/* Search */}
          <h3 className="title leading-7 h-7 block mb-3">
            {hasQuery &&
              house !== undefined &&
              ((mp && IS_INDIVIDU) || (!mp && !IS_INDIVIDU))
              ? IS_INDIVIDU
                ? t("timeseries_mp", {
                  mp: mp_name[mp],
                  house: t(house.replace("-", "_"), { ns: "common" }),
                })
                : t("timeseries_mps", {
                  house: t(house.replace("-", "_"), { ns: "common" }),
                })
              : ""}
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
                        label: chartEmpty ? "" : t("total_words"),
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
                {!hasQuery || (mp && !IS_INDIVIDU) || (!mp && IS_INDIVIDU) ? (
                  <>
                    <MagnifyingGlassIcon className="h-6 w-6" />
                    {t("start_search")}
                  </>
                ) : (
                  <>
                    <FaceFrownIcon className="h-6 w-6" />
                    {t("placeholder.no_results", { ns: "common" })}
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </Section>

      {count > 0 && ((mp && IS_INDIVIDU) || (!mp && !IS_INDIVIDU)) && (
        <>
          <Excerpts count={count} excerpts={excerpts} query={query} />
          {top_word_freq && (
            <section className="py-8 lg:py-12 space-y-6 lg:space-y-8">
              {/* "{{ name }}"'s most spoken words */}
              <h3 className="header text-center">
                {t("most_spoken_words", {
                  name: IS_INDIVIDU
                    ? `${UID_TO_NAME_DR[String(query.uid)]}`
                    : "",
                })}
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
          {top_speakers && !IS_INDIVIDU && (
            <section className="py-8 lg:py-12 space-y-6 lg:space-y-8">
              <h3 className="header text-center"></h3>

              <BarMeter
                className="max-w-screen-sm mx-auto"
                layout="horizontal"
                data={top_speakers.map((s) => ({
                  x: Object.keys(s)[0],
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

export default MP;
