import { useTranslation } from "next-i18next";
import Excerpts, { ExcerptsProps } from "./excerpts";
import Keyword, { KeywordProps } from "./keyword";
import { Container, Skeleton } from "@components/index";
import dynamic from "next/dynamic";
import { capitalize } from "@lib/utils";

/**
 * Search Keyword Dashboard
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

interface SearchKeywordProps extends ExcerptsProps, KeywordProps {
  top_word_freq?: Record<string, number>;
  top_speakers?: Array<Record<string, number>>;
}

const SearchKeyword = ({
  count,
  excerpts,
  query,
  timeseries,
  top_word_freq,
  top_speakers,
}: SearchKeywordProps) => {
  const { t } = useTranslation("home");

  return (
    <Container className="divide-y divide-border">
      <Keyword query={query} timeseries={timeseries} />
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

export default SearchKeyword;
