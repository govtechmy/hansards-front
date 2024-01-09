import Metadata from "@components/Metadata";
import HomeLayout from "@dashboards/home/layout";
import SearchKeyword from "@dashboards/home/search-keyword";
import SearchMP from "@dashboards/home/search-mp";
import { get } from "@lib/api";
import { withi18n } from "@lib/decorators";
import { Page } from "@lib/types";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";

/**
 * Home
 * @overview Status: Live
 */

const Home: Page = ({
  count,
  excerpts,
  query,
  timeseries,
  top_word_freq,
  top_speakers,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <>
      <Metadata
        keywords={
          "hansards.parlimen.gov.my data malaysia hansards parlimen parliament"
        }
      />
      <HomeLayout>
        <SearchKeyword
          count={count}
          excerpts={excerpts}
          query={query}
          timeseries={timeseries}
          top_word_freq={top_word_freq}
          top_speakers={top_speakers}
        />
      </HomeLayout>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = withi18n(
  ["demografi", "enum", "home", "kehadiran", "party"],
  async ({ query }) => {
    try {
      const { q, dewan, ...dates } = query;

      if (!q)
        return {
          props: {
            meta: {
              id: "home",
              type: "misc",
            },
            count: 0,
            excerpts: null,
            query: query ?? null,
            timeseries: {
              date: Array.from({ length: 365 }, (_, i) => i * 86400000),
              freq: [],
            },
            top_word_freq: null,
            top_speakers: null,
          },
        };

      const results = await Promise.allSettled([
        get("api/search/", {
          q: q,
          house: dewan,
          window_size: 30,
          page: 1,
          ...dates,
        }),
        get("api/search-plot/", {
          q: q,
          house: dewan,
          ...dates,
        }),
      ]);

      const [excerpt, data] = results.map((e) => {
        if (e.status === "rejected") return {};
        else return e.value.data;
      });

      return {
        props: {
          meta: {
            id: "home",
            type: "misc",
          },
          count: excerpt.count,
          excerpts: excerpt.results,
          query,
          timeseries: data.chart_data,
          top_word_freq: data.top_word_freq,
          top_speakers: data.top_speakers,
        },
      };
    } catch (error: any) {
      console.error(error.message);
      return { notFound: true };
    }
  }
);

export default Home;
