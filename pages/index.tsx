import Metadata from "@components/Metadata";
import ComingSoon from "@dashboards/home/coming-soon";
import SearchKeyword from "@dashboards/home/keyword";
import HomeLayout from "@dashboards/home/layout";
import { withi18n } from "@lib/decorators";
import { Page } from "@lib/types";
import { GetStaticProps, InferGetStaticPropsType } from "next";

/**
 * Home
 * @overview Status: Live
 */

const Home: Page = ({
  timeseries,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  return (
    <>
      <Metadata keywords="hansard.parlimen.gov.my data malaysia hansards parlimen parliament" />
      {process.env.NEXT_PUBLIC_APP_ENV === "production" ? (
        <ComingSoon />
      ) : (
        <HomeLayout>
          <SearchKeyword
            count={0}
            excerpts={[]}
            query={{}}
            speakers={[]}
            timeseries={timeseries}
          />
        </HomeLayout>
      )}
    </>
  );
};

export const getStaticProps: GetStaticProps = withi18n(
  ["demografi", "enum", "home", "kehadiran", "party"],
  async () => {
    return {
      props: {
        meta: {
          id: "/",
        },
        timeseries: {
          date: Array.from({ length: 365 }, (_, i) => i * 86400000),
          freq: [],
        },
      },
    };
  }
);

export default Home;
