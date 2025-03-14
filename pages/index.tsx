import Metadata from "@components/Metadata";
import ComingSoon from "@dashboards/home/coming-soon";
import SearchKeyword from "@dashboards/home/keyword";
import HomeLayout from "@dashboards/home/layout";
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
  speakers,
  timeseries,
  top_word_freq,
  top_speakers,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <>
      <Metadata keywords="hansards.parlimen.gov.my data malaysia hansards parlimen parliament" />
      {process.env.NEXT_PUBLIC_APP_ENV === "production" ? (
        <ComingSoon />
      ) : (
        <HomeLayout>
          <SearchKeyword
            count={count}
            excerpts={excerpts}
            query={query}
            speakers={speakers}
            timeseries={timeseries}
            top_word_freq={top_word_freq}
            top_speakers={top_speakers}
          />
        </HomeLayout>
      )}
    </>
  );
};

export const getServerSideProps: GetServerSideProps = withi18n(
  ["demografi", "enum", "home", "kehadiran", "party"],
  async ({ query }) => {
    try {
      const { data: speakers } = await get("api/author/");

      if (Object.keys(query).length === 0)
        return {
          props: {
            meta: {
              id: "/",
            },
            count: 0,
            excerpts: null,
            query,
            speakers,
            timeseries: {
              date: Array.from({ length: 365 }, (_, i) => i * 86400000),
              freq: [],
            },
            top_word_freq: null,
            top_speakers: null,
          },
        };

      const {
        q,
        page,
        page_size,
        dewan,
        tarikh_mula,
        tarikh_akhir,
        umur,
        etnik,
        parti,
        jantina,
      } = query;

      const results = await Promise.allSettled([
        get("api/search/", {
          q: q,
          house: dewan,
          window_size: 100,
          page: page ?? 1,
          page_size: page_size ?? 10,
          start_date: tarikh_mula,
          end_date: tarikh_akhir,
          age_group: umur,
          ethnicity: etnik,
          party: parti,
          sex: jantina,
        }),
        get("api/search-plot/", {
          q: q,
          house: dewan,
          start_date: tarikh_mula,
          end_date: tarikh_akhir,
          age_group: umur,
          ethnicity: etnik,
          party: parti,
          sex: jantina,
        }),
      ]);

      const [excerpt, data] = results.map(e => {
        if (e.status === "rejected") return {};
        else return e.value.data;
      });

      return {
        props: {
          meta: {
            id: "/",
          },
          count: excerpt.count ?? 0,
          excerpts: excerpt.results ?? null,
          query: query ?? null,
          speakers,
          timeseries: data.chart_data ?? {
            date: Array.from({ length: 365 }, (_, i) => i * 86400000),
            freq: [],
          },
          top_word_freq: data.top_word_freq ?? null,
          top_speakers: data.top_speakers ?? null,
        },
      };
    } catch (error: any) {
      console.error(error.message);
      return { notFound: true };
    }
  }
);

export default Home;
