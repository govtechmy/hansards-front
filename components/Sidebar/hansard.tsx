import Button from "@components/Button";
import { isSpeech } from "@data-catalogue/hansard";
import { Transition } from "@headlessui/react";
import { ChevronRightIcon } from "@heroicons/react/20/solid";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "@hooks/useTranslation";
import { SidebarL } from "@icons/index";
import { cn } from "@lib/helpers";
import { Speeches } from "@lib/types";
import dynamic from "next/dynamic";
import { ReactNode, useState } from "react";
import { Details } from "./details";
import { Collapse } from "./collapse";

const MobileButton = dynamic(() => import("./mobile-button"), { ssr: false });

interface HansardSidebarProps {
  children: (button: ReactNode) => ReactNode;
  onClick: (index: string) => void;
  speeches: Speeches;
}

const HansardSidebar = ({
  children,
  speeches,
  onClick,
}: HansardSidebarProps) => {
  const { t, i18n } = useTranslation(["hansard", "common"]);
  const [showSidebar, setSidebar] = useState<boolean>(true);
  const [mobileSidebar, setMobileSidebar] = useState<boolean>(false);
  const [_, setToggleAnimation] = useState(false);

  const styles = {
    base: "px-5 py-1.5 w-full text-start leading-tight",
    active:
      "bg-slate-100 font-medium dark:bg-zinc-800 text-zinc-900 dark:text-white",
    inactive: "text-zinc-500",
  };

  const Sidebar = () => {
    const [selected, setSelected] = useState<string>();

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
                prev_id && "ml-2.5",
                "text-sm relative",
                !first &&
                  "border-l border-slate-400 last-of-type:border-transparent",
                selected && selected.startsWith(id)
                  ? styles.active
                  : styles.inactive
              )}
            >
              {s[key].every((s) => isSpeech(s)) ? (
                <div
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
                      {i <= speeches.length - 1 && (
                        <div className="absolute -left-[1px] top-0 h-[calc(50%-17px)] border-l border-slate-400" />
                      )}
                    </>
                  )}
                </div>
              ) : (
                <Details
                  className="relative"
                  key={id}
                  open={selected?.startsWith(id)}
                  summary={
                    <>
                      <span className="font-medium">{key}</span>
                      {!first && (
                        <>
                          <SidebarL className="absolute -left-[1.5px] bottom-1/2" />
                          {i <= speeches.length - 1 && (
                            <div className="absolute -left-[1px] top-0 h-[calc(50%-17px)] border-l border-slate-400" />
                          )}
                        </>
                      )}
                    </>
                  }
                >
                  <>{recurTitle(s[key], false, id)}</>
                </Details>
              )}
            </li>
          );
        }
      });
    };
    return (
      <Collapse isOpen={showSidebar} horizontal>
        <>
          {speeches ? (
            recurTitle(speeches)
          ) : (
            <p className={cn(styles.base, "text-zinc-500 text-sm italic")}>
              {t("no_entries", { ns: "common" })}
            </p>
          )}
        </>
      </Collapse>
    );
  };

  return (
    <div className="flex h-full w-full justify-center">
      <div className="flex h-full w-full max-w-screen-2xl">
        {/* Desktop */}
        <div
          className={cn(
            "dark:border-r-slate-800 border-r shrink-0 hidden lg:block",
            "sticky top-[56px] h-[calc(100vh-56px)] overflow-y-scroll",
            "transform-gpu [transition-property:width] ease-in-out motion-reduce:transition-none",
            showSidebar
              ? "w-[250px] duration-300"
              : "w-min hide-scrollbar duration-500"
          )}
        >
          <div
            className={cn(
              "sticky top-0 z-10 bg-white dark:bg-zinc-900 flex gap-3 max-lg:px-2 py-3 items-baseline justify-between whitespace-nowrap",
              showSidebar ? "lg:px-5" : "lg:px-2"
            )}
          >
            <h3
              className={cn(
                "title",
                !showSidebar &&
                  `absolute -rotate-90 origin-top-left text-zinc-500 ${
                    i18n.language === "en-GB"
                      ? "translate-y-28"
                      : "translate-y-36"
                  }`
              )}
            >
              {t("toc")}
            </h3>
            <Button
              variant="default"
              className="p-1.5 shadow-button"
              title={showSidebar ? t("hide_sidebar") : t("show_sidebar")}
              onClick={() => {
                setToggleAnimation(true);
                setSidebar(!showSidebar);
              }}
            >
              <ChevronRightIcon
                className={cn(
                  "h-4.5 w-4.5 transition-transform ease-in-out motion-reduce:transform-none",
                  showSidebar
                    ? "-rotate-180 duration-500"
                    : "rotate-0 duration-300"
                )}
              />
            </Button>
          </div>
          <nav className={showSidebar ? "max-lg:hidden" : "hidden"}>
            <Sidebar />
            <div
              className={
                showSidebar
                  ? "sticky bottom-0 h-6 bg-gradient-to-b from-transparent to-white dark:to-zinc-900"
                  : "hidden"
              }
            />
          </nav>
        </div>

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
                  <h3 className={cn("title", styles.base)}>{t("toc")}</h3>
                  <Button
                    variant="reset"
                    className="hover:bg-slate-100 dark:hover:bg-zinc-800 group flex h-8 w-8 justify-center items-center rounded-full"
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
                />
              </div>
              <div
                className="w-[calc(100%-250px)] lg:hidden fixed right-0 top-0 z-30 h-screen bg-zinc-900 bg-opacity-25"
                onClick={() => setMobileSidebar(false)}
              />
            </Transition>
          </>
        </div>

        {/* Content */}
        <>
          {children(
            <MobileButton
              mobileSidebar={mobileSidebar}
              onClick={() => {
                setToggleAnimation(true);
                setMobileSidebar(true);
              }}
            />
          )}
        </>
      </div>
    </div>
  );
};

export default HansardSidebar;
