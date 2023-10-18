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
                who: <WhoSaidX count={count} excerpts={excerpts} keyword={keyword}/>,
                what: <WhatDidXSay count={count} excerpts={excerpts} keyword={keyword} />,
              }[tab]
            }
          </>
        )}
      </HomeLayout>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = withi18n(
  ["enum", "home"],
  async ({ query }) => {
    try {
      const keyword = query.keyword ? query.keyword : "petrol";
      const { data } = await get("api/search/", {
        q: keyword,
        house: "dewan-rakyat",
        window_size: 50,
        page: 1,
      });

      return {
        notFound: false,
        props: {
          meta: {
            id: "home",
            type: "misc",
          },
          count: data.count,
          excerpts: data.results,
          keyword: keyword,
        },
      };
    } catch (error: any) {
      console.error(error.message);
      return { notFound: true };
    }
  }
);

export default Home;
