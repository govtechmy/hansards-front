import Excerpts, { ExcerptsProps } from "./excerpts";
import Keyword, { KeywordProps } from "./keyword";
import { Container, Section, Skeleton } from "@components/index";
import dynamic from "next/dynamic";

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
  dewan,
  excerpts,
  keyword,
  query,
  timeseries,
  top_word_freq,
  top_speakers,
}: SearchKeywordProps) => (
  <Container className="divide-y divide-slate-200 dark:divide-zinc-800">
    <Keyword dewan={dewan} keyword={keyword} timeseries={timeseries} />
    {count > 0 && (
      <>
        <Excerpts
          count={count}
          excerpts={excerpts}
          keyword={keyword}
          query={query}
        />
        {top_word_freq && (
          <Section title="Top Word Frequency">
            <BubbleCloud
              className="w-full h-[350px] sm:h-[700px]"
              data={Object.entries(top_word_freq).map(([word, freq]) => ({
                id: word,
                value: freq,
              }))}
            />
          </Section>
        )}
        {top_speakers && (
          <Section title="Top Speakers">
            <BarMeter
              layout="horizontal"
              data={top_speakers.map((s) => ({
                x: Object.keys(s)[0],
                y: Object.values(s)[0],
              }))}
              relative
              precision={0}
            />
          </Section>
        )}
      </>
    )}
  </Container>
);

export default SearchKeyword;
