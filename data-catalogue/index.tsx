import { Container, Sidebar } from "@components/index";
import { useTranslation } from "@hooks/useTranslation";
import { cn } from "@lib/helpers";
import { Archive } from "@lib/types";
import { Fragment, useEffect, useMemo, useRef } from "react";
import CatalogueFolder, { FolderOpen } from "./folder";
import { ParsedUrlQuery } from "querystring";

/**
 * Catalogue Index
 * @overview Status: In-development
 */

interface CatalogueIndexProps {
  archive: Archive;
  params: ParsedUrlQuery;
}

const CatalogueIndex = ({ archive, params }: CatalogueIndexProps) => {
  const { t } = useTranslation(["catalogue", "common", "enum"]);
  const scrollRef = useRef<Record<string, HTMLElement | null>>({});
  const folderRef = useRef<Record<string, FolderOpen | null>>({});

  const classNames = {
    hr: "hidden sm:block border border-slate-200 dark:border-zinc-800 w-full h-0.5",
  };
  const PARLIMENS = Object.keys(archive).reverse();

  const scrollToPenggal = (selected: string) => {
    if (scrollRef) {
      scrollRef.current[selected]?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  };

  const data = useMemo(
    () =>
      Object.keys(archive)
        .reverse()
        .map((p) => {
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
              .map((s) => {
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
    if (params && params.archive) {
      const [parlimen, penggal, mesyuarat] = params.archive;
      const url = `${parlimen}/${penggal}/${mesyuarat}`;
      if (mesyuarat && folderRef.current) {
        folderRef.current[url]?.open(url);
      }
      if (penggal) {
        scrollToPenggal(`${parlimen}/${penggal}`);
      } else {
        scrollToPenggal(parlimen);
      }
    }
  }, []);

  return (
    <>
      <Container>
        <Sidebar
          data={data}
          onClick={(selected) => {
            scrollRef.current[selected]?.scrollIntoView({
              behavior: "smooth",
              block: "center",
            });
          }}
        >
          <div className="flex flex-col px-4.5 sm:px-8 pt-3 pb-6 lg:pb-8 w-full h-full">
            {data ? (
              PARLIMENS.map((_, index) => {
                const { id, penggal, yearRange } = data[index];
                const parlimen_id = `parlimen-${id}/`;

                return (
                  <Fragment key={id}>
                    <div className="flex flex-col">
                      <div
                        className="py-3 bg-background flex gap-3 items-center sticky top-28 z-10"
                        ref={(ref) => (scrollRef.current[parlimen_id] = ref)}
                      >
                        <h2 className="header flex flex-wrap w-fit sm:whitespace-nowrap">
                          {t("parlimen", {
                            ns: "enum",
                            count: id,
                            ordinal: true,
                          })}
                          {yearRange}
                        </h2>
                        <span className={classNames.hr} />
                      </div>

                      <div className="space-y-8 pt-3 pb-[42px]">
                        {penggal.map(({ id, mesyuarat, yearRange }) => {
                          const meetings = mesyuarat;
                          const MEETINGS = Object.keys(meetings).sort(
                            (a, b) =>
                              Date.parse(meetings[a].end_date) -
                              Date.parse(meetings[b].end_date)
                          );
                          const penggal_id = `penggal-${id}`;
                          return (
                            <div key={id} className="relative">
                              <span
                                className={cn(
                                  classNames.hr,
                                  "absolute top-3.5 left-0 -z-10 border-dashed"
                                )}
                              />
                              <h3 className="title flex flex-wrap w-fit sm:whitespace-nowrap bg-background pr-3">
                                {t("penggal_full", {
                                  ns: "enum",
                                  n: id,
                                })}
                                {yearRange}
                              </h3>

                              <div
                                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-x-6 gap-y-[54px] pt-12 pb-6"
                                ref={(ref) =>
                                  (scrollRef.current[
                                    `${parlimen_id}${penggal_id}`
                                  ] = ref)
                                }
                              >
                                {MEETINGS.map((id) => {
                                  return (
                                    <CatalogueFolder
                                      ref={(ref) =>
                                        (folderRef.current[
                                          `${parlimen_id}${penggal_id}/mesyuarat-${id}`
                                        ] = ref)
                                      }
                                      key={id}
                                      meeting={meetings[id]}
                                      meeting_id={id}
                                    />
                                  );
                                })}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </Fragment>
                );
              })
            ) : (
              <p className="text-zinc-500 p-2 pt-16 lg:p-8">
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
