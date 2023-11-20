import Metadata from "@components/Metadata";
import HomeLayout from "@dashboards/home/layout";
import WhoSaidX from "@dashboards/home/who-said-x";
import WhatDidXSay from "@dashboards/home/what-did-x-say";
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
  keyword,
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
        {(tab) => (
          <>
            {
              {
                who: (
                  <WhoSaidX
                    count={count}
                    excerpts={excerpts}
                    keyword={keyword}
                    timeseries={timeseries}
                    top_word_freq={top_word_freq}
                  />
                ),
                what: (
                  <WhatDidXSay
                    count={count}
                    excerpts={excerpts}
                    keyword={keyword}
                  />
                ),
              }[tab]
            }
          </>
        )}
      </HomeLayout>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = withi18n(
  ["enum", "home", "kehadiran", "party"],
  async ({ query }) => {
    try {
      const { q, ...dates } = query;
      const { data: excerpt } = await get("api/search/", {
        q: q ?? "petrol",
        house: "dewan-rakyat",
        window_size: 30,
        page: 1,
        ...dates
      });

      const { data } = await get("api/search-plot/", {
        q: q ?? "petrol",
        house: "dewan-rakyat",
        window_size: 50,
        ...dates
      });

      return {
        notFound: false,
        props: {
          meta: {
            id: "home",
            type: "misc",
          },
          count: excerpt.count,
          excerpts: excerpt.results,
          keyword: q,
          timeseries: data.chart_data,
          top_word_freq: data.top_word_freq,
        },
      };
    } catch (error: any) {
      console.error(error.message);
      return { notFound: true };
    }
  }
);

export default Home;
