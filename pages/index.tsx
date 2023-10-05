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

const Home: Page = ({}: InferGetServerSidePropsType<
  typeof getServerSideProps
>) => {
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
                who: <WhoSaidX />,
                what: <WhatDidXSay />,
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
      const [name, type] =
        Object.keys(query).length === 0
          ? [null, null]
          : [query.name, query.type];

      return {
        notFound: false,
        props: {
          meta: {
            id: "home",
            type: "misc",
          },
        },
      };
    } catch (error: any) {
      console.error(error.message);
      return { notFound: true };
    }
  }
);

export default Home;
