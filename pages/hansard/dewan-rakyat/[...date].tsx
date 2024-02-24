import Metadata from "@components/Metadata";
import { SearchProvider } from "@data-catalogue/hansard/search/context";
import Hansard from "@data-catalogue/hansard/hansard";
import { useTranslation } from "@hooks/useTranslation";
import { get } from "@lib/api";
import { AnalyticsProvider } from "@lib/contexts/analytics";
import { withi18n } from "@lib/decorators";
import { routes } from "@lib/routes";
import { Page } from "@lib/types";
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";

const HansardPage: Page = ({
  meta,
  cycle,
  date,
  filename,
  speeches,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation("hansard");

  return (
    <>
      <AnalyticsProvider id={meta.id}>
        <Metadata
          title={date.concat(
            ` ${t("header", { context: `${filename}`.slice(0, 2) })}`
          )}
          description={meta.id}
          keywords={""}
        />
        <SearchProvider
          value={{
            fixedHeaderHeight: 240,
          }}
        >
          <Hansard
            hansard_id={meta.id}
            cycle={cycle}
            date={date}
            filename={filename}
            speeches={speeches}
          />
        </SearchProvider>
      </AnalyticsProvider>
    </>
  );
};

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = withi18n(
  ["catalogue", "enum", "hansard"],
  async ({ params }) => {
    try {
      const date = params?.date ? params.date.toString() : null;

      const { data } = await get("api/sitting/", {
        house: "dewan-rakyat",
        date,
      });

      return {
        props: {
          meta: {
            id: `${routes.HANSARD_DR}/${date}`,
          },
          cycle: data.meta.cycle,
          date: date,
          filename: data.meta.filename,
          speeches: data.speeches,
        },
      };
    } catch (error) {
      console.error(error);
      return { notFound: true };
    }
  }
);

export default HansardPage;
