import {
  ComponentProps,
  FunctionComponent,
  ReactNode,
  useContext,
  useState,
} from "react";
import { Transition } from "@headlessui/react";
import Button from "@components/Button";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "@hooks/useTranslation";
import { cn } from "@lib/helpers";
import { ChevronRightIcon } from "@heroicons/react/20/solid";
import { Archive } from "@lib/types";
import { Details } from "./details";
import { Collapse } from "./collapse";
import { WindowContext } from "@lib/contexts/window";
import { BREAKPOINTS } from "@lib/constants";

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
  const { size } = useContext(WindowContext);
  const [selected, setSelected] = useState<string>();
  const [showSidebar, setSidebar] = useState<boolean>(true);
  const [mobileSidebar, setMobileSidebar] = useState<boolean>(false);

  const [showToggleAnimation, setToggleAnimation] = useState(false);

  const styles = {
    base: "px-4 lg:px-5 py-1.5 w-full text-start leading-tight",
    active:
      "bg-slate-100 font-medium dark:bg-zinc-800 text-zinc-900 dark:text-white",
    inactive: "text-zinc-500",
  };

  const TERMS = Object.keys(data).reverse();

  const Sidebar = () => (
    <Collapse isOpen={showSidebar} horizontal>
      <ul>
        {TERMS ? (
          TERMS.map((term) => {
            const { start_date, end_date, ...sessions } = data[term];
            const SESSIONS = Object.keys(sessions).reverse();
            const start = start_date.substring(0, 4);
            const end = end_date.substring(0, 4);
            const yearRange =
              start === end ? `(${start})` : `(${start} - ${end})`;
            return (
              <li
                key={term}
                title={t("term_full", { ns: "enum", n: term })}
                className={cn(
                  "text-sm",
                  selected && selected.startsWith(`${term}_`)
                    ? styles.active
                    : styles.inactive
                )}
              >
                <Details
                  summary={
                    <p className="flex flex-col">
                      <span className="font-medium">
                        {t("term_full", { ns: "enum", n: term })}
                      </span>
                      <span className="font-base">{yearRange}</span>
                    </p>
                  }
                >
                  <ul className="pl-2.5">
                    {SESSIONS.map((session, i) => {
                      const { start_date, end_date } = sessions[session];
                      const start = start_date.substring(0, 4);
                      const end = end_date.substring(0, 4);
                      const yearRange =
                        start === end ? `(${start})` : `(${start} - ${end})`;
                      const id = `${term}_${session}`;

                      return (
                        <li
                          title={t("session_full", {
                            ns: "enum",
                            n: session,
                          }).concat(yearRange)}
                          onClick={() => {
                            setSelected(id);
                            onClick(id);
                          }}
                          className={cn(
                            "relative",
                            styles.base,
                            selected === id ? styles.active : styles.inactive
                          )}
                        >
                          <p className="font-medium whitespace-nowrap">
                            {t("session_full", {
                              ns: "enum",
                              n: session,
                            })}
                          </p>
                          <p className="font-base">{yearRange}</p>

                          <SidebarL className="absolute -left-0.5 top-0" />
                          {i < SESSIONS.length - 1 && (
                            <SidebarT className="absolute -left-0.5 top-0" />
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </Details>
              </li>
            );
          })
        ) : (
          <p className={cn(styles.base, "text-zinc-500 text-sm italic")}>
            {t("no_entries")}
          </p>
        )}
      </ul>
    </Collapse>
  );

  return (
    <>
      <div className="flex w-full">
        {/* Desktop */}
        <div
          className={cn(
            "dark:border-r-slate-800 border-r shrink-0 w-12",
            "sticky top-[113px] h-[calc(100vh-113px)] sm:top-14 sm:h-[calc(100vh-56px)] overflow-y-scroll",
            "transform-gpu [transition-property:width] ease-in-out motion-reduce:transition-none",
            showSidebar ? "lg:w-[250px] duration-300" : "duration-500"
          )}
        >
          <div
            className={cn(
              "flex gap-3 max-lg:px-2 py-3 items-baseline justify-between whitespace-nowrap",
              showSidebar ? "lg:px-5" : "lg:px-2"
            )}
          >
            {/* Vertical */}
            <h5
              className={cn(
                "absolute translate-y-20 -translate-x-9 -rotate-90",
                showSidebar && "lg:hidden"
              )}
            >
              {t("full_archive")}
            </h5>
            {/* Horizontal */}
            <h5 className={cn("max-lg:hidden", !showSidebar && "hidden")}>
              {t("full_archive")}
            </h5>
            <Button
              variant="default"
              className="p-1.5 shadow-button"
              title={showSidebar ? t("hide_sidebar") : t("show_sidebar")}
              onClick={() => {
                setToggleAnimation(true);
                if (size.width < BREAKPOINTS.LG) {
                  setMobileSidebar(true);
                } else {
                  setSidebar(!showSidebar);
                }
              }}
            >
              <ChevronRightIcon
                className={cn(
                  "h-4.5 w-4.5 transition-transform ease-in-out",
                  showSidebar
                    ? "-rotate-180 duration-500"
                    : "rotate-0 duration-300"
                )}
              />
            </Button>
          </div>
          <aside className="max-lg:hidden block">
            <Sidebar />
            <div
              className={
                showSidebar
                  ? "sticky bottom-0 h-6 bg-gradient-to-b from-transparent to-white dark:to-zinc-900"
                  : "hidden"
              }
            ></div>
          </aside>
        </div>

        {/* Mobile */}
        <div className="relative block lg:hidden">
          <>
            <Transition
              show={mobileSidebar}
              as="aside"
              className="lg:hidden dark:border-zinc-800 shadow-floating fixed left-0 top-14 z-30 flex h-[calc(100vh-56px)] w-[250px] flex-col border-r bg-white dark:bg-zinc-900  overflow-y-scroll"
              enter="transition-opacity duration-75"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity duration-150"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <ul className="flex flex-col gap-1 pt-2 pr-2">
                <li className="flex items-baseline justify-between">
                  <h5 className={styles.base}>{t("full_archive")}</h5>
                  <Button
                    className="hover:bg-slate-100 dark:hover:bg-zinc-800 group absolute right-2 top-2 flex h-8 w-8 items-center rounded-full"
                    onClick={() => setMobileSidebar(false)}
                  >
                    <XMarkIcon className="text-zinc-500 absolute right-1.5 h-5 w-5 group-hover:text-zinc-900 dark:group-hover:text-white" />
                  </Button>
                </li>

                <Sidebar />
              </ul>
            </Transition>
          </>
        </div>

        {/* Content */}
        <>{children}</>
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
