import CatalogueIndex from "@data-catalogue/index";
import CatalogueIndexLayout from "@data-catalogue/layout";
import { get } from "@lib/api";
import Metadata from "@components/Metadata";
import { withi18n } from "@lib/decorators";
import { sortAlpha } from "@lib/helpers";
import { useTranslation } from "@hooks/useTranslation";
import { Page } from "@lib/types";
import { GetStaticProps, InferGetStaticPropsType } from "next";

const CatalogueIndexPage: Page = ({
  archive,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation("catalogue");

  return (
    <>
      <Metadata
        title={t("header")}
        description={t("description")}
        keywords={""}
      />
      <CatalogueIndexLayout>
        <CatalogueIndex archive={archive} />
      </CatalogueIndexLayout>
    </>
  );
};

// const recurSort = (data: Record<string, ArchiveLevel[]> | Sitting[] ): any => {
//   if (Array.isArray(data)) return sortAlpha(data, "filename");

//   return Object.fromEntries(
//     Object.entries(data)
//       .sort(
//         (a: [string, unknown], b: [string, unknown]) => Number(b[0]) - Number(a[0])
//       )
//       .map((item: [string, Record<string, ArchiveLevel[]> | Sitting[]]) => [
//         item[0],
//         recurSort(item[1]),
//       ])
//   );
// };

export const getStaticProps: GetStaticProps = withi18n(
  ["catalogue", "enum"],
  async () => {
    try {
      const { data } = await get("api/catalogue/", {
        house: 0,
      });

      return {
        props: {
          meta: {
            id: "catalogue-index",
            type: "misc",
          },
          archive: data.catalogue_list, // collection,
        },
      };
    } catch (error) {
      console.error(error);
      return { notFound: true };
    }
  },
  {
    cache_expiry: 600, // 10 min
  }
);

export default CatalogueIndexPage;
