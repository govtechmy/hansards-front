import dynamic from "next/dynamic";
import Excerpts, { ExcerptsProps } from "./excerpts";
import MP, { MPProps } from "./mp";
import Container from "@components/Container";
import Skeleton from "@components/Skeleton";
import { useTranslation } from "@hooks/useTranslation";
import { UID_TO_NAME_DR } from "@lib/uid";

/**
 * Search MP Dashboard
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

interface SearchMPProps extends ExcerptsProps, MPProps {
  top_speakers?: Array<Record<string, number>>;
  top_word_freq?: Record<string, number>;
}

const SearchMP = ({
  count,
  excerpts,
  query,
  timeseries,
  top_speakers,
  top_word_freq,
}: SearchMPProps) => {
  const { t } = useTranslation("home");

  return (
    <Container className="divide-y divide-border">
      <MP
        query={query}
        timeseries={timeseries}
      />
      {count > 0 && (
        <>
          <Excerpts count={count} excerpts={excerpts} query={query} />
          {top_word_freq && (
            <section className="py-8 lg:py-12 space-y-6 lg:space-y-8">
              {/* "{{ name }}"'s most spoken words */}
              <h3 className="header text-center">
                {t("most_spoken_words", {
                  name: `${UID_TO_NAME_DR[String(query.uid)]}`,
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
          {top_speakers && (
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

export default SearchMP;
