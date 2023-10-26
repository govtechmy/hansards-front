import Button from "@components/Button";
import { ReactNode, useContext, useState } from "react";
import { Transition } from "@headlessui/react";
import { ChevronRightIcon } from "@heroicons/react/20/solid";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "@hooks/useTranslation";
import { SidebarL } from "@icons/index";
import { BREAKPOINTS } from "@lib/constants";
import { WindowContext } from "@lib/contexts/window";
import { cn } from "@lib/helpers";
import { Speeches } from "@lib/types";
import { Details } from "./details";
import { Collapse } from "./collapse";
import { isSpeech } from "@data-catalogue/hansard";

interface SidebarProps {
  children: ReactNode;
  speeches: Speeches;
  onClick: (index: string) => void;
}

const Sidebar = ({ children, speeches, onClick }: SidebarProps) => {
  const { t } = useTranslation(["catalogue", "common", "enum"]);
  const { size } = useContext(WindowContext);
  const [selected, setSelected] = useState<string>();
  const [showSidebar, setSidebar] = useState<boolean>(true);
  const [mobileSidebar, setMobileSidebar] = useState<boolean>(false);

  const [showToggleAnimation, setToggleAnimation] = useState(false);

  const styles = {
    base: "px-5 py-1.5 w-full text-start leading-tight",
    active:
      "bg-slate-100 font-medium dark:bg-zinc-800 text-zinc-900 dark:text-white",
    inactive: "text-zinc-500",
  };


  const Sidebar = () => {
    const recurTitle = (
      speeches: Speeches,
      first: boolean = true,
      prev_id?: string
    ): ReactNode => {
      return speeches.map((s, i) => {
        if (isSpeech(s)) {
          return;
        } else {
          const keys = Object.keys(s);
          const key = keys[0];
          const id = prev_id ? `${prev_id}_${key}` : key;
          return (
            <li
              key={key}
              title={key}
              className={cn(
                "text-sm relative",
                !first &&
                  "border-l border-slate-400 last-of-type:border-transparent",
                selected && selected.startsWith(id)
                  ? styles.active
                  : styles.inactive
              )}
            >
              {s[key].every((s) => isSpeech(s)) ? (
                <li
                  title={key}
                  onClick={() => {
                    setSelected(id);
                    onClick(id);
                  }}
                  className={cn(
                    "relative hover:bg-slate-100 dark:hover:bg-zinc-800",
                    styles.base,
                    selected === id ? styles.active : styles.inactive
                  )}
                >
                  <p className="font-medium">{key}</p>
                  {!first && (
                    <>
                      <SidebarL className="absolute -left-[1.5px] bottom-1/2" />
                      {i === speeches.length - 1 && (
                        <div className="absolute -left-[1px] top-0 h-[calc(50%-17px)] border-l border-slate-400" />
                      )}
                    </>
                  )}
                </li>
              ) : (
                <Details
                  className="relative"
                  open={selected?.startsWith(id)}
                  summary={
                    <>
                      <span className="font-medium">{key}</span>
                      {!first && (
                        <>
                          <SidebarL className="absolute -left-[1.5px] bottom-1/2" />
                          {i === speeches.length - 1 && (
                            <div className="absolute -left-[1px] top-0 h-[calc(50%-17px)] border-l border-slate-400" />
                          )}
                        </>
                      )}
                    </>
                  }
                >
                  <ul className="pl-2.5">{recurTitle(s[key], false, id)}</ul>
                </Details>
              )}
            </li>
          );
        }
      });
    };
    return (
      <Collapse isOpen={showSidebar} horizontal>
        <ul>
          {speeches ? (
            recurTitle(speeches)
          ) : (
            <p className={cn(styles.base, "text-zinc-500 text-sm italic")}>
              {t("no_entries")}
            </p>
          )}
        </ul>
      </Collapse>
    );
  };

  return (
    <>
      <div className="flex w-full">
        {/* Desktop */}
        <ul
          className={cn(
            "dark:border-r-slate-800 border-r shrink-0 w-12 max-lg:hide-scrollbar",
            "sticky top-[56px] h-[calc(100vh-56px)] overflow-y-scroll lg:sidebar-scrollbar",
            "transform-gpu [transition-property:width] ease-in-out motion-reduce:transition-none",
            showSidebar
              ? "lg:w-[250px] duration-300"
              : "hide-scrollbar duration-500"
          )}
        >
          <div
            className={cn(
              "sticky top-0 z-10 bg-white dark:bg-zinc-900 flex gap-3 max-lg:px-2 py-3 items-baseline justify-between whitespace-nowrap",
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
              {t("kandungan")}
            </h5>
            {/* Horizontal */}
            <h5 className={cn("max-lg:hidden", !showSidebar && "hidden")}>
              {t("kandungan")}
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
                  "h-4.5 w-4.5 transition-transform ease-in-out motion-reduce:transform-none",
                  showSidebar && size.width >= BREAKPOINTS.LG
                    ? "-rotate-180 duration-500"
                    : "rotate-0 duration-300"
                )}
              />
            </Button>
          </div>
          <nav className="max-lg:hidden">
            <Sidebar />
            <div
              className={
                showSidebar
                  ? "sticky bottom-0 h-6 bg-gradient-to-b from-transparent to-white dark:to-zinc-900"
                  : "hidden"
              }
            />
          </nav>
        </ul>

        {/* Mobile */}
        <div className="relative flex lg:hidden">
          <>
            <Transition
              show={mobileSidebar}
              as="nav"
              className="lg:hidden dark:border-zinc-800 shadow-floating fixed inset-0 z-30 flex h-screen w-[250px] flex-col border-r bg-white dark:bg-zinc-900 overflow-y-scroll"
              enter="transition-opacity duration-75"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity duration-150"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="flex flex-col gap-1">
                <div className="sticky top-0 flex items-center justify-between pt-2 pr-2 z-10 bg-white dark:bg-zinc-900">
                  <h5 className={styles.base}>{t("kandungan")}</h5>
                  <Button
                    variant="reset"
                    className="hover:bg-slate-100 dark:hover:bg-zinc-800 group flex h-8 w-8 items-center rounded-full"
                    onClick={() => setMobileSidebar(false)}
                  >
                    <XMarkIcon className="text-zinc-500 h-5 w-5 group-hover:text-zinc-900 dark:group-hover:text-white" />
                  </Button>
                </div>

                <Sidebar />
                <div
                  className={
                    mobileSidebar
                      ? "sticky bottom-0 h-6 bg-gradient-to-b from-transparent to-white dark:to-zinc-900"
                      : "hidden"
                  }
                ></div>
              </div>
              <div
                className="w-[calc(100%-250px)] lg:hidden fixed right-0 top-0 z-30 h-screen bg-zinc-900 bg-opacity-25"
                onClick={() => setMobileSidebar(false)}
              />
            </Transition>
          </>
        </div>

        {/* Content */}
        <>{children}</>
      </div>
    </>
  );
};

export default Sidebar;
