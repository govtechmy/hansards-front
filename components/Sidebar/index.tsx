import { Details } from "./details";
import { Collapse } from "./collapse";
import Button from "@components/Button";
import { Transition } from "@headlessui/react";
import { ChevronRightIcon } from "@heroicons/react/20/solid";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "@hooks/useTranslation";
import { SidebarL } from "@icons/index";
import { WindowContext } from "@lib/contexts/window";
import { BREAKPOINTS } from "@lib/constants";
import { cn } from "@lib/helpers";
import { Mesyuarat } from "@lib/types";
import { FunctionComponent, ReactNode, useContext, useState } from "react";

interface SidebarProps {
  children: ReactNode;
  data: Array<{
    id: string;
    yearRange: string;
    penggal: Array<{
      id: string;
      yearRange: string;
      mesyuarat: {
        [key: string]: Mesyuarat;
      };
    }>;
  }>;
  onClick: (index: string) => void;
}

const Sidebar: FunctionComponent<SidebarProps> = ({
  children,
  data,
  onClick,
}) => {
  const { t } = useTranslation(["catalogue", "enum"]);
  const { size } = useContext(WindowContext);
  const [selected, setSelected] = useState<string>();
  const [showSidebar, setSidebar] = useState<boolean>(true);
  const [mobileSidebar, setMobileSidebar] = useState<boolean>(false);
  const [_, setToggleAnimation] = useState(false);

  const styles = {
    base: "px-5 py-1.5 w-full text-start leading-tight",
    active:
      "bg-slate-100 font-medium dark:bg-zinc-800 text-zinc-900 dark:text-white",
    inactive: "text-zinc-500",
  };

  const Sidebar = () => (
    <Collapse isOpen={showSidebar} horizontal>
      {data ? (
        data.map(({ id, penggal, yearRange }) => {
          const parlimen_id = `parlimen-${id}/`;
          const parlimen_full = t("parlimen_full", {
            ns: "enum",
            n: id,
          });
          return (
            <li
              key={id}
              title={`${parlimen_full}${yearRange}`}
              className={cn(
                "text-sm",
                selected && selected.startsWith(parlimen_id)
                  ? styles.active
                  : styles.inactive
              )}
            >
              <Details
                open={selected?.startsWith(parlimen_id)}
                summary={
                  <span className="flex flex-col">
                    <span className="font-medium">{parlimen_full}</span>
                    {yearRange}
                  </span>
                }
              >
                <>
                  {penggal.map(({ id, yearRange }, i) => {
                    const parlimen_penggal = `${parlimen_id}penggal-${id}`;
                    const penggal_full = t("penggal_full", {
                      ns: "enum",
                      n: id,
                    });
                    return (
                      <li
                        key={parlimen_penggal}
                        title={`${penggal_full}${yearRange}`}
                        onClick={() => {
                          setSelected(parlimen_penggal);
                          onClick(parlimen_penggal);
                          if (size.width < BREAKPOINTS.LG) {
                            setMobileSidebar(false);
                          }
                        }}
                        className={cn(
                          "relative hover:bg-slate-100 dark:hover:bg-zinc-800 ml-2.5",
                          "border-l border-slate-400 last-of-type:border-transparent",
                          styles.base,
                          selected === id ? styles.active : styles.inactive
                        )}
                      >
                        <p className="font-medium whitespace-nowrap">
                          {penggal_full}
                        </p>
                        {yearRange}
                        <SidebarL className="absolute -left-[1.5px] bottom-1/2" />
                        {i === penggal.length - 1 && (
                          <div className="absolute -left-[1px] top-0 h-[calc(50%-17px)] border-l border-slate-400" />
                        )}
                      </li>
                    );
                  })}
                </>
              </Details>
            </li>
          );
        })
      ) : (
        <p className={cn(styles.base, "text-zinc-500 text-sm italic")}>
          {t("no_entries")}
        </p>
      )}
    </Collapse>
  );

  return (
    <>
      <div className="flex w-full">
        {/* Desktop */}
        <div
          className={cn(
            "dark:border-r-slate-800 border-r shrink-0 w-11 max-lg:hide-scrollbar",
            "sticky top-[113px] h-[calc(100vh-113px)] overflow-y-auto",
            "transform-gpu [transition-property:width] ease-in-out motion-reduce:transition-none",
            showSidebar
              ? "lg:w-[250px] duration-300"
              : "hide-scrollbar duration-500"
          )}
        >
          <div
            className={cn(
              "sticky top-0 z-10 bg-white dark:bg-zinc-900 flex gap-3 px-0 py-3 items-baseline justify-between whitespace-nowrap",
              showSidebar && "lg:px-5"
            )}
          >
            <h4
              className={cn(
                "title max-lg:absolute max-lg:-rotate-90 origin-top-left max-lg:translate-y-[150px]",
                !showSidebar &&
                  "absolute -rotate-90 origin-top-left translate-y-[150px] text-zinc-500"
              )}
            >
              {t("full_archive")}
            </h4>
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
          {size.width > BREAKPOINTS.LG && (
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
          )}
        </div>

        {/* Mobile */}
        {size.width <= BREAKPOINTS.LG && (
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
              <div className="flex flex-col gap-1 pb-3">
                <div className="sticky top-0 flex items-center justify-between pt-2 pr-3 z-10 bg-white dark:bg-zinc-900">
                  <h3 className={cn("title", styles.base)}>
                    {t("full_archive")}
                  </h3>
                  <XMarkIcon
                    onClick={() => setMobileSidebar(false)}
                    className="text-zinc-500 h-5 w-5"
                  />
                </div>

                <Sidebar />
              </div>
              <div
                className="w-[calc(100%-250px)] lg:hidden fixed right-0 top-0 z-30 h-screen bg-zinc-900 bg-opacity-25"
                onClick={() => setMobileSidebar(false)}
              />
            </Transition>
          </>
        )}

        {/* Content */}
        <>{children}</>
      </div>
    </>
  );
};

export default Sidebar;
