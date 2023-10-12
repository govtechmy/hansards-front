import { Container, Sidebar } from "@components/index";
import { useTranslation } from "@hooks/useTranslation";
import { BREAKPOINTS } from "@lib/constants";
import { WindowContext } from "@lib/contexts/window";
import { cn, toDate } from "@lib/helpers";
import { Archive } from "@lib/types";
import { FunctionComponent, useRef, useContext, useState } from "react";
import CatalogueFolder from "./folder";

/**
 * Catalogue Index
 * @overview Status: In-development
 */

interface CatalogueIndexProps {
  archive: Archive;
}

const CatalogueIndex: FunctionComponent<CatalogueIndexProps> = ({
  archive,
}) => {
  const { t, i18n } = useTranslation(["catalogue", "common"]);
  const scrollRef = useRef<Record<string, HTMLElement | null>>({});
  const { size } = useContext(WindowContext);
  const [open, setOpen] = useState<boolean>(false);

  const classNames = {
    hr: "hidden sm:block border border-slate-200 dark:border-zinc-800 w-full h-0.5",
  };
  const TERMS = Object.keys(archive).reverse();

  return (
    <>
      <Container className="min-h-screen">
        <Sidebar
          data={archive}
          onClick={(selected) =>
            scrollRef.current[selected]?.scrollIntoView({
              behavior: "smooth",
              block: size.width <= BREAKPOINTS.LG ? "start" : "center",
              inline: "end",
            })
          }
        >
          <div className="pl-8 py-8 space-y-12 w-full">
            <>
              {TERMS ? (
                TERMS.map((term) => {
                  const { start_date, end_date, ...sessions } = archive[term];
                  const SESSIONS = Object.keys(sessions).reverse();
                  const start = start_date.substring(0, 4);
                  const end = end_date.substring(0, 4);
                  const yearRange =
                    start === end ? ` (${start})` : ` (${start} - ${end})`;
                  return (
                    <section
                      key={term}
                      className="flex flex-col gap-y-6 lg:gap-y-8"
                    >
                      <div className="flex gap-3 items-center">
                        <h4 className="flex flex-wrap sm:whitespace-nowrap">
                          {t("term", {
                            ns: "enum",
                            count: term,
                          }).concat(yearRange)}
                        </h4>
                        <span className={classNames.hr}></span>
                      </div>
                      <>
                        {SESSIONS.map((session) => {
                          const { start_date, end_date, ...meetings } =
                            sessions[session];
                          const MEETINGS = Object.keys(meetings).reverse();
                          const start = start_date.substring(0, 4);
                          const end = end_date.substring(0, 4);
                          const yearRange =
                            start === end
                              ? ` (${start})`
                              : ` (${start} - ${end})`;
                          return (
                            <div
                              key={session}
                              className="flex flex-col gap-y-6 lg:gap-y-8"
                            >
                              <div className="flex gap-3 items-center">
                                <h5 className="flex flex-wrap sm:whitespace-nowrap">
                                  {t("session", {
                                    ns: "enum",
                                    n: session,
                                  }).concat(yearRange)}
                                </h5>
                                <span
                                  className={cn(classNames.hr, "border-dashed")}
                                ></span>
                              </div>
                              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-x-6 gap-y-6 lg:gap-y-12">
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
                                      ? `(${start})`
                                      : `(${start} - ${end})`;

                                  return (
                                    <div
                                      key={meeting}
                                      ref={(ref) =>
                                        (scrollRef.current[`${term}_${session}_${meeting}`] = ref)
                                      }
                                      className="flex flex-col gap-y-3 items-center"
                                    >
                                      <div className="h-20 flex items-center">
                                        <CatalogueFolder
                                          sitting_list={sitting_list}
                                        />
                                      </div>
                                      <div className="flex flex-col text-center gap-y-1">
                                        <p className="text-zinc-900 dark:text-white font-medium">
                                          {t("meeting", {
                                            ns: "enum",
                                            n: meeting,
                                          })}
                                        </p>
                                        <p className="text-slate-500 text-sm">
                                          {dateRange}
                                        </p>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          );
                        })}
                      </>
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
