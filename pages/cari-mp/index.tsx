import Metadata from "@components/Metadata";
import HomeLayout from "@dashboards/home/layout";
import SearchMP from "@dashboards/home/search-mp";
import { get } from "@lib/api";
import { withi18n } from "@lib/decorators";
import { Page } from "@lib/types";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";

/**
 * Cari MP
 * @overview Status: Live
 */

const CariMP: Page = ({
  count,
  excerpts,
  individu_list,
  query,
  timeseries,
  top_word_freq,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <>
      <Metadata
        keywords={
          "hansards.parlimen.gov.my data malaysia hansards parlimen parliament"
        }
      />
      <HomeLayout>
        <SearchMP
          count={count}
          excerpts={excerpts}
          individu_list={individu_list}
          query={query}
          timeseries={timeseries}
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

      const { data: individu_list } = await get(
        "/explorer",
        {
          explorer: "ELECTIONS",
          dropdown: "candidate_list",
        },
        process.env.NEXT_PUBLIC_SEJARAH_URL
      ).catch((e) => {
        throw new Error("Invalid candidate name. Message: " + e);
      });

      if (!q)
        return {
          props: {
            meta: {
              id: "home",
              type: "misc",
            },
            count: 0,
            excerpts: null,
            individu_list,
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
          count: excerpt.count ?? 0,
          excerpts: excerpt.results ?? null,
          individu_list,
          query: query ?? null,
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

export default CariMP;
