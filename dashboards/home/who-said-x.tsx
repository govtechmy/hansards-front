import Excerpts, { ExcerptsProps } from "./excerpts";
import Keyword, { KeywordProps } from "./keyword";
import { Container, Section, Skeleton } from "@components/index";
import dynamic from "next/dynamic";

/**
 * Who Said X Dashboard
 * @overview Status: In-development
 */

const BubbleCloud = dynamic(() => import("@charts/bubble-cloud"), {
  loading: () => <Skeleton height="h-[350px] sm:h-[90dvh]"/>,
  ssr: false,
});

interface WhoSaidXProps extends ExcerptsProps, KeywordProps {
  top_word_freq: Record<string, number>;
}

const WhoSaidX = ({
  count,
  excerpts,
  keyword,
  timeseries,
  top_word_freq,
}: WhoSaidXProps) => (
  <Container className="min-h-screen">
    <Keyword keyword={keyword} timeseries={timeseries} />
    <Excerpts count={count} excerpts={excerpts} keyword={keyword} />
    <Section>
      <BubbleCloud
        className="w-full h-[350px] sm:h-[90dvh]"
        data={Object.entries(top_word_freq).map(([word, freq]) => ({
          id: word,
          value: freq,
        }))}
      />
    </Section>
  </Container>
);

export default WhoSaidX;
