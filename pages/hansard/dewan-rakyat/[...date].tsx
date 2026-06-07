import Metadata from "@components/Metadata";
import { SearchProvider } from "@data-catalogue/hansard/search/context";
import Hansard from "@data-catalogue/hansard/hansard";
import { useTranslation } from "@hooks/useTranslation";
import { get } from "@lib/api";
import { AnalyticsProvider } from "@lib/contexts/analytics";
import { withi18n } from "@lib/decorators";
import { routes } from "@lib/routes";
import { Page } from "@lib/types";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";

const HansardPage: Page = ({
  meta,
  cycle,
  date,
  filename,
  speeches,
  is_final,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { t } = useTranslation("hansard");

  const DEWAN_LABELS: Record<string, string> = {
    "dewan-rakyat": t("enum:dewan-rakyat"),
    "dewan-negara": t("enum:dewan-negara"),
    "kamar-khas": t("enum:kamar-khas"),
  };

  const heroHeader = t("enum:header");
  const houseKey = meta.id.match(
    /\/(dewan-rakyat|dewan-negara|kamar-khas)(?:\/|$)/
  )?.[1];
  const dewanLabel = houseKey ? DEWAN_LABELS[houseKey] : "";
  const title = `${heroHeader}`;
  const description = `${dewanLabel ?? ""}, ${date ?? ""}`;

  const pageTitle = title;
  const ogUrl = `${process.env.NEXT_PUBLIC_APP_URL}${meta.id}`;
  const ogDescription = description;

  return (
    <>
      <AnalyticsProvider id={meta.id}>
        <Metadata
          title={pageTitle}
          description={meta.id}
          keywords={""}
          ogUrl={ogUrl}
          ogTitle={pageTitle}
          ogDescription={ogDescription}
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
            is_final={is_final}
          />
        </SearchProvider>
      </AnalyticsProvider>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = withi18n(
  ["catalogue", "demografi", "enum", "hansard"],
  async ({ params }) => {
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
        is_final: data.meta.is_final,
      },
    };
  }
);

export default HansardPage;
