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
  timeseries,
  takwim,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <>
      <Metadata keywords="hansard.parlimen.gov.my data malaysia hansards parlimen parliament" />
      {process.env.NEXT_PUBLIC_APP_ENV === "production" ? (
        <ComingSoon />
      ) : (
        <HomeLayout>
          <SearchKeyword
            count={0}
            dewan_counts={{}}
            excerpts={[]}
            query={{}}
            speakers={[]}
            timeseries={timeseries}
            takwim={takwim}
          />
        </HomeLayout>
      )}
    </>
  );
};

export const getServerSideProps: GetServerSideProps = withi18n(
  ["demografi", "enum", "home", "kehadiran", "party"],
  async () => {
    const takwimResult = await get(
      `api/sitting/list?house=dewan-rakyat&house=dewan-negara&house=kamar-khas`
    ).catch(() => null);

    return {
      props: {
        meta: {
          id: "/",
        },
        timeseries: {
          date: Array.from({ length: 365 }, (_, i) => i * 86400000),
          freq: [],
        },
        takwim: takwimResult?.data ?? null,
      },
    };
  }
);

export default Home;
