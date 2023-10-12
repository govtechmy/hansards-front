import { ComponentProps, FunctionComponent, ReactNode, useState } from "react";
import { Transition } from "@headlessui/react";
import Button from "@components/Button";
import { Bars3BottomLeftIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "@hooks/useTranslation";
import { cn } from "@lib/helpers";
import { ChevronRightIcon } from "@heroicons/react/20/solid";
import { Archive } from "@lib/types";
import { Details } from "./details";
import { Collapse } from "./collapse";

interface SidebarProps {
  children: ReactNode;
  data: Archive;
  onClick: (index: string) => void;
}

const Sidebar: FunctionComponent<SidebarProps> = ({
  children,
  data,
  onClick,
}) => {
  const { t } = useTranslation(["catalogue", "common", "enum"]);
  const [selected, setSelected] = useState<string>();
  const [show, setShow] = useState<boolean>(false);
  const styles = {
    base: "px-4 lg:px-5 py-1.5 w-full rounded-none text-start leading-tight",
    active:
      "text-sm bg-slate-100 text-zinc-900 font-medium dark:bg-zinc-800 dark:text-white",
    default: "text-sm text-zinc-500",
  };

  const TERMS = Object.keys(data).reverse();
  const [showSidebar, setSidebar] = useState(true);
  const [showToggleAnimation, setToggleAnimation] = useState(false);

  return (
    <>
      <div className="flex w-full">
        {/* Desktop */}
        <div
          className={cn(
            "sticky z-10",
            "translate-y-8 transition-transform ease-in-out",
            showSidebar
              ? "translate-x-28 lg:translate-x-48 duration-300"
              : "flex-wrap justify-center duration-500"
          )}
          data-toggle-animation={
            showToggleAnimation ? (showSidebar ? "show" : "hide") : "off"
          }
        >
          <Button
            variant="default"
            className="p-1.5 shadow-button"
            title={showSidebar ? "Hide sidebar" : "Show sidebar"}
            onClick={() => {
              setSidebar(!showSidebar);
              setToggleAnimation(true);
            }}
          >
            <ChevronRightIcon className="h-4.5 w-4.5" />
          </Button>
        </div>
        <Collapse isOpen={showSidebar} horizontal>
          <aside className="dark:border-r-slate-800 border-r w-full block z-10">
            <ul className="sticky top-14 flex h-[90vh] w-full flex-col pt-8">
              <li className="flex px-5 justify-between">
                <h5>{t("full_archive")}</h5>
              </li>
              {TERMS ? (
                TERMS.map((term) => {
                  const { start_date, end_date, ...sessions } = data[term];
                  const SESSIONS = Object.keys(sessions).reverse();
                  const start = start_date.substring(0, 4);
                  const end = end_date.substring(0, 4);
                  const yearRange =
                    start === end ? ` (${start})` : ` (${start} - ${end})`;
                  return (
                    <li
                      key={term}
                      title={t("term", { ns: "enum", count: term })}
                    >
                      <Details
                        summary={t("term", { ns: "enum", count: term }).concat(
                          yearRange
                        )}
                      >
                        <ul>
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
                              <li
                                title={t("session", {
                                  ns: "enum",
                                  n: session,
                                }).concat(yearRange)}
                              >
                                <Details
                                  summary={t("session", {
                                    ns: "enum",
                                    n: session,
                                  }).concat(yearRange)}
                                  className="pl-2.5"
                                >
                                  <ul className="pl-2.5">
                                    {MEETINGS.map((meeting, i) => {
                                      const { start_date, end_date } =
                                        meetings[meeting];
                                      return (
                                        <>
                                          <li
                                            title={t("meeting", {
                                              ns: "enum",
                                              n: term,
                                            }).concat(
                                              ` (${start_date} - ${end_date})`
                                            )}
                                            className={cn(
                                              styles.base,
                                              "relative"
                                              // selected === term ? styles.active : styles.default
                                            )}
                                            onClick={() => {
                                              const id = `${term}_${session}_${meeting}`;
                                              setSelected(id);
                                              onClick(id);
                                            }}
                                          >
                                            {t("meeting", {
                                              ns: "enum",
                                              n: meeting,
                                            }).concat(
                                              ` (${start_date} - ${end_date})`
                                            )}
                                            <SidebarL className="absolute -left-1 top-0" />
                                            {i < MEETINGS.length - 1 && (
                                              <SidebarT className="absolute -left-1 top-0" />
                                            )}
                                          </li>
                                        </>
                                      );
                                    })}
                                  </ul>
                                </Details>
                              </li>
                            );
                          })}
                        </ul>
                      </Details>

                      {/* <details
                      // className={cn(
                      //   styles.base,
                      //   selected === term ? styles.active : styles.default
                      // )}
                      className="my-4 rounded border border-gray-200 bg-white p-2 shadow-sm first:mt-0 dark:border-neutral-800 dark:bg-neutral-900"
                      onClick={() => {
                        setSelected(term);
                        // onSelect(`${term}: ${subcategory[0]}`);
                      }}
                    >
                      <summary
                        className={cn(
                          "flex cursor-pointer list-none items-center p-1 transition-colors hover:bg-gray-100 dark:hover:bg-neutral-800",
                          "before:mr-1 before:inline-block before:transition-transform before:content-[''] dark:before:invert",
                          "rtl:before:rotate-180 [[data-expanded]>&]:before:rotate-90"
                        )}
                      >
                        {t("term", { ns: "enum", count: term }).concat(
                          ` (${data[term as TermNum].start_date.substring(
                            0,
                            4
                          )} - ${data[term as TermNum].end_date.substring(
                            0,
                            4
                          )})`
                        )}
                      </summary>
                      <details
                        className={cn(
                          styles.base,
                          selected === term ? styles.active : styles.default
                        )}
                        onClick={() => {
                          setSelected(term);
                          // onSelect(`${term}: ${subcategory[0]}`);
                        }}
                      >
                        <summary>
                          {t("term", { ns: "enum", count: term }).concat(
                            ` (${data[term as TermNum].start_date.substring(
                              0,
                              4
                            )} - ${data[term as TermNum].end_date.substring(
                              0,
                              4
                            )})`
                          )}
                        </summary>
                      </details>
                    </details> */}
                      {/* <Button
                    className={cn(
                      styles.base,
                      selected === term ? styles.active : styles.default
                    )}
                    onClick={() => {
                      setSelected(term);
                      // onSelect(`${term}: ${subcategory[0]}`);
                    }}
                  >
                    {t("term", { ns: "enum", count: term }).concat(
                      ` (${data[term as TermNum].start_date.substring(
                        0,
                        4
                      )} - ${data[term as TermNum].end_date.substring(0, 4)})`
                    )}
                  </Button> */}
                      {/* <ul className="ml-5 space-y-1">
                    {subcategory.length &&
                      subcategory.map((title) => (
                        <li key={title} title={title}>
                          <Button
                            className={cn(
                              styles.base,
                              selected === title
                                ? styles.active
                                : styles.default
                            )}
                            onClick={() => {
                              setSelected(title);
                              onSelect(`${category}: ${title}`);
                            }}
                          >
                            {title}
                          </Button>
                          <div className="relative">
                            <SidebarL className="absolute" />
                            <SidebarT className="absolute" />
                          </div>
                        </li>
                      ))}
                  </ul> */}
                    </li>
                  );
                })
              ) : (
                <p className={cn(styles.base, "text-zinc-500 text-sm italic")}>
                  {t("no_entries")}
                </p>
              )}
            </ul>
          </aside>
        </Collapse>

        {/* Mobile */}
        {/* <div className="relative w-full">
          <>
            <div className="absolute top-[72px] block lg:hidden">
              <Button
                className="btn-default sticky top-36 z-10"
                icon={<Bars3BottomLeftIcon className="h-4 w-4" />}
                onClick={() => setShow(true)}
              >
                {t("category")}
              </Button>
            </div>
            <Transition
              show={show}
              as="div"
              className="dark:border-zinc-800 shadow-floating fixed left-0 top-14 z-30 flex h-screen w-2/3 flex-col border border-r bg-white dark:bg-zinc-900 sm:w-1/3"
              enter="transition-opacity duration-75"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity duration-150"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <ul className="flex flex-col gap-1 overflow-auto pt-2">
                <li className="flex items-baseline justify-between">
                  <h5 className={styles.base}>{t("category")}</h5>

                  <Button
                    className="hover:bg-slate-100 dark:hover:bg-zinc-800 group absolute right-2 top-2 flex h-8 w-8 items-center rounded-full"
                    onClick={() => setShow(false)}
                  >
                    <XMarkIcon className="text-zinc-500 absolute right-1.5 h-5 w-5 group-hover:text-zinc-900 dark:group-hover:text-white" />
                  </Button>
                </li> */}

        {/* {terms.length > 0 ? (
                  terms.map(([category, subcategory]) => (
                    <li key={`${category}: ${subcategory[0]}`} title={category}>
                      <Button
                        className={cn(
                          styles.base,
                          selected === category ? styles.active : styles.default
                        )}
                        onClick={() => {
                          setSelected(category);
                          onSelect(`${category}: ${subcategory[0]}`);
                        }}
                      >
                        {category}
                      </Button>
                      <ul className="ml-4">
                        {subcategory.length &&
                          subcategory.map((title) => (
                            <li key={title}>
                              <Button
                                className={cn(
                                  styles.base,
                                  selected === title
                                    ? styles.active
                                    : styles.default
                                )}
                                onClick={() => {
                                  setSelected(title);
                                  onSelect(`${category}: ${title}`);
                                }}
                              >
                                {title}
                              </Button>
                            </li>
                          ))}
                              </ul>
                    </li>
                  ))
                ) : (
                  <p
                    className={cn(styles.base, "text-zinc-500 text-sm italic")}
                  >
                    {t("no_entries")}
                  </p>
                )}*/}
        {/* </ul>
            </Transition>
          </> */}
        {/* Content */}
        {children}
      </div>
    </>
  );
};

const SidebarL = (props: ComponentProps<"svg">) => {
  return (
    <svg
      width="15"
      height="27"
      viewBox="0 0 15 27"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M1 0V14C1 20.6274 6.37258 26 13 26H15" stroke="#94A3B8" />
    </svg>
  );
};

const SidebarT = (props: ComponentProps<"svg">) => {
  return (
    <svg
      width="2"
      height="52"
      viewBox="0 0 2 52"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M1 0V52" stroke="#94A3B8" />
    </svg>
  );
};
export default Sidebar;
