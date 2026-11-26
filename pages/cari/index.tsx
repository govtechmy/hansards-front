import Metadata from "@components/Metadata";
import ComingSoon from "@dashboards/home/coming-soon";
import SearchKeyword from "@dashboards/home/keyword";
import HomeLayout from "@dashboards/home/layout";
import { get } from "@lib/api";
import { withi18n } from "@lib/decorators";
import { buildRelatedSearch, suggestableQuery } from "@lib/related-search";
import { Page } from "@lib/types";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { NextResponse } from "next/server";

/**
 * Home
 * @overview Status: Live
 */

const Home: Page = ({
  count,
  dewan_counts,
  excerpts,
  query,
  speakers,
  timeseries,
  top_word_freq,
  top_speakers,
  takwim,
  relatedSearch,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <>
      <Metadata keywords="hansard.parlimen.gov.my data malaysia hansards parlimen parliament" />
      <HomeLayout>
        <SearchKeyword
          count={count}
          dewan_counts={dewan_counts}
          excerpts={excerpts}
          query={query}
          speakers={speakers}
          timeseries={timeseries}
          top_word_freq={top_word_freq}
          top_speakers={top_speakers}
          takwim={takwim}
          relatedSearch={relatedSearch}
        />
      </HomeLayout>
    </>
  );
};

/**
 * Had masa panggilan `api/search/suggestion` .
 */
const SUGGESTION_TIMEOUT_MS = 1500;

export const getServerSideProps: GetServerSideProps = withi18n(
  ["demografi", "enum", "home", "kehadiran", "party"],
  async ({ query }) => {
    if (Object.keys(query).length === 0)
      return {
        redirect: {
          destination: "/",
          permanent: false,
        },
      };

    const {
      q,
      page,
      page_size,
      dewan,
      tarikh_mula,
      tarikh_akhir,
      graf_mula,
      graf_akhir,
      umur,
      etnik,
      parti,
      jantina,
      tepat,
    } = query;

    /**
     * Tempoh bar graf yang diklik pengguna (tugasan E). Ia menyempitkan
     * **senarai dokumen sahaja**, jadi ia digunakan hanya pada `api/search/`
     * di bawah dan bukan pada `api/search-plot/` atau `api/search/counter`.
     *
     * Kalau ia disuap ke graf juga, graf akan membina semula dirinya kepada
     * tempoh yang baru diklik, dan reka bentuk Naincie menunjukkan graf serta
     * baris penapis kekal tidak berubah.
     */
    const listStartDate = graf_mula ?? tarikh_mula;
    const listEndDate = graf_akhir ?? tarikh_akhir;
    // "Search exactly what I typed".
    // Only `tepat=1` counts: `0`, empty, `true` or a repeated `?tepat=1&tepat=1`
    // do not.
    const exactSearch = tepat === "1";

    //Carian dicadangkan
    const typed = suggestableQuery(q, exactSearch);
    const suggestion = typed
      ? await get("api/search/suggestion", { q: typed }, "api", {
          timeout: SUGGESTION_TIMEOUT_MS,
        })
          .then(res => res.data?.did_you_mean)
          .catch(() => null)
      : null;
    const relatedSearch = buildRelatedSearch(q, suggestion, exactSearch);
    const searchQ = relatedSearch?.corrected ?? q;

    const results = await Promise.allSettled([
      get("api/search/", {
        q: searchQ,
        house: dewan,
        window_size: 100,
        page: page ?? 1,
        page_size: page_size ?? 10,
        start_date: listStartDate,
        end_date: listEndDate,
        age_group: umur,
        ethnicity: etnik,
        party: parti,
        sex: jantina,
      }),
      get("api/search-plot/", {
        q: searchQ,
        house: dewan,
        start_date: tarikh_mula,
        end_date: tarikh_akhir,
        age_group: umur,
        ethnicity: etnik,
        party: parti,
        sex: jantina,
      }),
      get("api/author/"),
      get("api/search/counter", {
        q: searchQ,
        start_date: tarikh_mula,
        end_date: tarikh_akhir,
        age_group: umur,
        ethnicity: etnik,
        party: parti,
        sex: jantina,
      }),
      get(
        `api/sitting/list?house=dewan-rakyat&house=dewan-negara&house=kamar-khas`
      ),
    ]);

    const [excerpt, data, speakers, counter, takwim] = results.map(e => {
      if (e.status === "rejected") return {};
      else return e.value.data;
    });

    // Carian gagal (Requirement 9, peraturan 7): jangan paparkan chip walaupun
    // cadangan berjaya, kerana tiada hasil untuk kata dibetulkan itu.
    const shownRelatedSearch =
      results[0].status === "rejected" ? null : relatedSearch;

    const rawHouseCounts =
      counter && typeof counter === "object" && counter.house_counts
        ? counter.house_counts
        : {};

    const dewan_counts: Record<string, number> = {};
    for (const [k, v] of Object.entries(rawHouseCounts)) {
      const key = k.replace(/_/g, "-");
      if (key !== "semua" && typeof v === "number" && isFinite(v)) {
        dewan_counts[key] = v;
      }
    }

    dewan_counts["semua"] = Object.values(dewan_counts).reduce<number>(
      (sum, v) => sum + v,
      0
    );

    return {
      props: {
        meta: {
          id: "/cari",
        },
        count: excerpt.count ?? 0,
        dewan_counts,
        excerpts: excerpt.results ?? null,
        query: query ?? null,
        speakers,
        timeseries: data.chart_data ?? {
          date: Array.from({ length: 365 }, (_, i) => i * 86400000),
          freq: [],
        },
        top_word_freq: data.top_word_freq ?? null,
        top_speakers: data.top_speakers ?? null,
        takwim: Array.isArray(takwim) ? takwim : null,
        relatedSearch: shownRelatedSearch,
      },
    };
  }
);

export default Home;
