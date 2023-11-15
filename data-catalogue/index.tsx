import { Container, Sidebar } from "@components/index";
import { useTranslation } from "@hooks/useTranslation";
import { cn, toDate } from "@lib/helpers";
import { Archive } from "@lib/types";
import { FunctionComponent, useEffect, useRef } from "react";
import CatalogueFolder from "./folder";
import { ParsedUrlQuery } from "querystring";
import { WindowProvider } from "@lib/contexts/window";

/**
 * Catalogue Index
 * @overview Status: In-development
 */

interface CatalogueIndexProps {
  archive: Archive;
  params?: ParsedUrlQuery;
}

const CatalogueIndex: FunctionComponent<CatalogueIndexProps> = ({
  archive,
  params,
}) => {
  const { t, i18n } = useTranslation(["catalogue", "common", "enum"]);
  const scrollRef = useRef<Record<string, HTMLElement | null>>({});

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

  useEffect(() => {
    if (params && params.archive) {
      const [parlimen, penggal, mesyuarat] = params.archive;
      if (penggal) {
        scrollToPenggal(`${parlimen}/${penggal}`);
      } else {
        scrollToPenggal(parlimen);
      }
    }
  }, []);

  return (
    <>
      <Container className="min-h-screen">
        <Sidebar
          data={archive}
          onClick={(selected) => {
            scrollRef.current[selected]?.scrollIntoView({
              behavior: "smooth",
              block: "center",
            });
          }}
        >
          <div className="flex flex-col pl-6 sm:pl-8 pt-3 pb-6 lg:pb-8 gap-y-[42px] w-full">
            <>
              {PARLIMENS ? (
                PARLIMENS.map((num) => {
                  const { start_date, end_date, ...sessions } = archive[num];
                  const SESSIONS = Object.keys(sessions).reverse();
                  const start = start_date.substring(0, 4);
                  const end = end_date.substring(0, 4);
                  const yearRange =
                    start === end ? ` (${start})` : ` (${start} - ${end})`;
                  const parlimen = `parlimen-${num}`;
                  return (
                    <section key={num}>
                      <div
                        className="sticky top-[113px] z-10 py-3 bg-white dark:bg-zinc-900 flex gap-3 items-center"
                        ref={(ref) => (scrollRef.current[parlimen] = ref)}
                      >
                        <h4 className="flex flex-wrap sm:whitespace-nowrap">
                          {t("parlimen_full", {
                            ns: "enum",
                            n: num,
                          }).concat(yearRange)}
                        </h4>
                        <span className={classNames.hr}></span>
                      </div>
                      <div className="flex flex-col gap-y-8 pt-3">
                        {SESSIONS.map((session) => {
                          const { start_date, end_date, ...meetings } =
                            sessions[session];

                          const MEETINGS = Object.keys(meetings).sort(
                            (a, b) =>
                              Date.parse(meetings[a].end_date) -
                              Date.parse(meetings[b].end_date)
                          );
                          const start = start_date.substring(0, 4);
                          const end = end_date.substring(0, 4);
                          const yearRange =
                            start === end
                              ? ` (${start})`
                              : ` (${start} - ${end})`;
                          const parlimen_penggal = `${parlimen}/penggal-${session}`;
                          return (
                            <div
                              key={session}
                              className="flex flex-col gap-y-6"
                            >
                              <div className="flex gap-3 items-center">
                                <h5 className="flex flex-wrap sm:whitespace-nowrap">
                                  {t("penggal_full", {
                                    ns: "enum",
                                    n: session,
                                  }).concat(yearRange)}
                                </h5>
                                <span
                                  className={cn(classNames.hr, "border-dashed")}
                                ></span>
                              </div>
                              <div
                                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-x-6 gap-y-[54px] py-6"
                                ref={(ref) =>
                                  (scrollRef.current[parlimen_penggal] = ref)
                                }
                              >
                                {MEETINGS.map((meeting) => {
                                  const { start_date, end_date, sitting_list } =
                                    meetings[meeting];

                                  function getShortDate(date: string) {
                                    return toDate(
                                      date,
                                      "dd MMM",
                                      i18n.language
                                    );
                                  }
                                  const start = getShortDate(start_date);
                                  const end = getShortDate(end_date);
                                  const dateRange =
                                    start === end
                                      ? `${start}`
                                      : `${start} - ${end}`;

                                  return (
                                    <WindowProvider>
                                      <CatalogueFolder
                                        key={meeting}
                                        dateRange={dateRange}
                                        meeting={meeting}
                                        sitting_list={sitting_list}
                                      />
                                    </WindowProvider>
                                  );
                                })}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </section>
                  );
                })
              ) : (
                <p className="text-zinc-500 p-2 pt-16 lg:p-8">
                  {t("no_entries", { ns: "common" })}.
                </p>
              )}
            </>
          </div>
        </Sidebar>
      </Container>
    </>
  );
};

export default CatalogueIndex;
