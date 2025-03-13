import { Container, Sidebar } from "@components/index";
import { useTranslation } from "@hooks/useTranslation";
import { Archive } from "@lib/types";
import { Fragment, useEffect, useMemo, useRef } from "react";
import { FolderOpen } from "./folder";
import Penggal from "./penggal";
import { useRouter } from "next/router";

/**
 * Catalogue Index
 * @overview Status: In-development
 */

interface CatalogueIndexProps {
  archive: Archive;
  parlimens: string[];
}

const CatalogueIndex = ({ archive, parlimens }: CatalogueIndexProps) => {
  const { t } = useTranslation(["catalogue", "common", "enum"]);
  const folderRef = useRef<Record<string, FolderOpen | null>>({});
  const router = useRouter();

  const classNames = {
    hr: "hidden sm:block border border-slate-200 dark:border-zinc-800 w-full h-0.5",
  };

  const data = useMemo(
    () =>
      Object.keys(archive)
        .reverse()
        .map(p => {
          const { start_date, end_date, ...sessions } = archive[p];
          const start = start_date.substring(0, 4);
          const end = end_date.substring(0, 4);
          const yearRange =
            start === end ? ` (${start})` : ` (${start} - ${end})`;

          return {
            id: p,
            yearRange,
            penggal: Object.keys(sessions)
              .reverse()
              .map(s => {
                const { start_date, end_date, ...mesyuarat } = sessions[s];

                const start = start_date.substring(0, 4);
                const end = end_date.substring(0, 4);
                const yearRange =
                  start === end ? ` (${start})` : ` (${start} - ${end})`;

                return {
                  id: s,
                  yearRange,
                  mesyuarat,
                };
              }),
          };
        }),
    []
  );

  useEffect(() => {
    const hash = document.location.hash;
    const regex = /(parlimen|penggal|mesyuarat)-\d+/g;
    const levels = hash.match(regex);

    if (levels && levels.length === 3) {
      const [parlimen, penggal, mesyuarat] = levels;
      const url = `${parlimen}-${penggal}-${mesyuarat}`;
      if (mesyuarat && folderRef.current) {
        folderRef.current[url]?.open(url);
      }
    }
  }, []);

  return (
    <>
      <Container>
        <Sidebar data={data} onClick={selected => router.push("#" + selected)}>
          <div className="flex h-full w-full flex-col pb-6 pl-4.5 pt-3 sm:pl-8 lg:pb-8">
            {data ? (
              parlimens.map((_, index) => {
                const { id, penggal, yearRange } = data[index];
                const parlimen_id = `parlimen-${id}`;

                return (
                  <Fragment key={id}>
                    <div className="flex flex-col">
                      <div className="sticky top-28 z-10 flex items-center gap-3 bg-background py-3">
                        <h2
                          className="header flex w-fit scroll-mt-40 flex-wrap sm:whitespace-nowrap"
                          id={parlimen_id}
                        >
                          {t("parlimen", {
                            ns: "enum",
                            count: Number(id),
                            ordinal: true,
                          })}
                          {yearRange}
                        </h2>
                        <span className={classNames.hr} />
                      </div>

                      <div className="space-y-8 pb-[42px] pt-3">
                        {penggal.map(penggal => (
                          <Penggal
                            penggal_id={`${parlimen_id}-penggal-${penggal.id}`}
                            {...penggal}
                          />
                        ))}
                      </div>
                    </div>
                  </Fragment>
                );
              })
            ) : (
              <p className="p-2 pt-16 text-zinc-500 lg:p-8">
                {t("no_entries", { ns: "common" })}.
              </p>
            )}
          </div>
        </Sidebar>
      </Container>
    </>
  );
};

export default CatalogueIndex;
