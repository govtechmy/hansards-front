import Metadata from "@components/Metadata";
import HomeLayout from "@dashboards/home/layout";
import SearchMP from "@dashboards/home/mp";
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
  query,
  speakers,
  timeseries,
  top_speakers,
  top_word_freq,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <>
      <Metadata keywords="hansards.parlimen.gov.my data malaysia hansards parlimen parliament" />
      <HomeLayout>
        <SearchMP
          count={count}
          excerpts={excerpts}
          query={query}
          speakers={speakers}
          timeseries={timeseries}
          top_speakers={top_speakers}
          top_word_freq={top_word_freq}
        />
      </HomeLayout>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = withi18n(
  ["demografi", "enum", "home", "kehadiran", "party"],
  async ({ query, locale }) => {
    try {
      const { data: speakers } = await get("api/author/");

      if (Object.keys(query).length === 0)
        return {
          notFound: process.env.NEXT_PUBLIC_APP_ENV === "production",
          props: {
            meta: {
              id: "home",
            },
            count: 0,
            excerpts: null,
            query: query ?? null,
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
        uid,
        dewan,
        tarikh_mula,
        tarikh_akhir,
        umur,
        etnik,
        parti,
        gender,
      } = query;

      const results = await Promise.allSettled([
        get("api/search/", {
          uid: uid,
          house: dewan,
          window_size: 150,
          page: 1,
          start_date: tarikh_mula,
          end_date: tarikh_akhir,
          age_group: umur,
          ethnicity: etnik,
          party: parti,
          sex: gender,
        }),
        get("api/search-plot/", {
          uid: uid,
          house: dewan,
          start_date: tarikh_mula,
          end_date: tarikh_akhir,
          age_group: umur,
          ethnicity: etnik,
          party: parti,
          sex: gender,
        }),
      ]);

      const [excerpt, data] = results.map(e => {
        if (e.status === "rejected") return {};
        else return e.value.data;
      });

      return {
        notFound: process.env.NEXT_PUBLIC_APP_ENV === "production",
        props: {
          meta: {
            id: "/cari-mp",
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
    } catch (error) {
      console.error("API error in cari-mp:", JSON.stringify(error));
      return {
        redirect: {
          destination: locale === "en-GB" ? "/en-GB/500" : "/500",
          permanent: false,
        },
      };
    }
  }
);

export default CariMP;
