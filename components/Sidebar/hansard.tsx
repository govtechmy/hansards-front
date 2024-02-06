import Button from "@components/Button";
import { Sheet, SheetContent, SheetHeader } from "@components/Sheet";
import { isSpeech } from "@data-catalogue/hansard";
import { ChevronRightIcon } from "@heroicons/react/20/solid";
import { useTranslation } from "@hooks/useTranslation";
import { SidebarL } from "@icons/index";
import { cn } from "@lib/helpers";
import { Speeches } from "@lib/types";
import {
  ForwardedRef,
  forwardRef,
  ReactNode,
  useImperativeHandle,
  useState,
} from "react";
import { Details } from "./details";
import { Collapse } from "./collapse";

interface HansardSidebarProps {
  children: ReactNode;
  onClick: (index: string) => void;
  speeches: Speeches;
}

export interface SidebarOpen {
  open: () => void;
}

const HansardSidebar = forwardRef(
  (
    { children, speeches, onClick }: HansardSidebarProps,
    ref: ForwardedRef<SidebarOpen>
  ) => {
    const { t, i18n } = useTranslation(["hansard", "common"]);
    const [showSidebar, setSidebar] = useState<boolean>(true);
    const [mobileSidebar, setMobileSidebar] = useState<boolean>(false);

    useImperativeHandle(
      ref,
      () => {
        return {
          open: () => setMobileSidebar(true),
        };
      },
      []
    );

    const styles = {
      base: "px-5 py-1.5 w-full text-start leading-tight",
      active: "bg-slate-100 font-medium dark:bg-zinc-800 text-foreground",
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
                key={id}
                className={cn(
                  "text-sm relative",
                  prev_id && "ml-2.5",
                  !first &&
                    "border-l border-slate-400 last-of-type:border-transparent",
                  selected && selected.startsWith(id)
                    ? styles.active
                    : styles.inactive
                )}
              >
                {s[key].every((s) => isSpeech(s)) ? (
                  <button
                    title={key}
                    onClick={() => {
                      setSelected(id);
                      onClick(id);
                      setMobileSidebar(false);
                    }}
                    className={cn(
                      "relative hover:bg-slate-100 dark:hover:bg-zinc-800",
                      styles.base,
                      selected === id ? styles.active : styles.inactive
                    )}
                  >
                    <p className="font-medium cursor-pointer">{key}</p>
                    {!first && (
                      <>
                        <SidebarL className="absolute -left-[1.5px] bottom-1/2" />
                        {i <= speeches.length - 1 && (
                          <div className="absolute -left-[1px] top-0 h-[calc(50%-17px)] border-l border-slate-400" />
                        )}
                      </>
                    )}
                  </button>
                ) : (
                  <Details
                    className="relative"
                    key={id}
                    open={selected?.startsWith(id)}
                    summary={
                      <>
                        <span title={key} className="font-medium">
                          {key}
                        </span>
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
                    {recurTitle(s[key], false, id)}
                  </Details>
                )}
              </li>
            );
          }
        });
      };
      return (
        <ul>
          {speeches ? (
            recurTitle(speeches)
          ) : (
            <li className={cn(styles.base, "text-zinc-500 text-sm italic")}>
              {t("no_entries", { ns: "common" })}
            </li>
          )}
        </ul>
      );
    };

    return (
      <div className="flex h-full w-full justify-center">
        <div className="flex h-full w-full max-w-screen-2xl">
          {/* Desktop */}
          <div
            className={cn(
              "relative border-r border-r-border shrink-0 w-16 hidden lg:block pl-4",
              "sticky top-14 h-[calc(100dvh-56px)] overflow-y-auto sidebar-scrollbar",
              "transform-gpu [transition-property:width] ease-in-out motion-reduce:transition-none",
              showSidebar
                ? "w-[300px] duration-300"
                : "hide-scrollbar duration-500"
            )}
          >
            <div
              className={cn(
                "sticky top-0 z-10 bg-background flex gap-3 max-lg:px-2 py-3 items-baseline justify-between whitespace-nowrap",
                showSidebar ? "lg:pl-5 lg:pr-2" : "lg:px-2"
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
                variant="outline"
                className="p-1.5 shadow-button"
                title={showSidebar ? t("hide_sidebar") : t("show_sidebar")}
                onClick={() => setSidebar(!showSidebar)}
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
            <Collapse isOpen={showSidebar} horizontal>
              <Sidebar />
              <div
                className={
                  showSidebar
                    ? "sticky bottom-0 h-6 bg-gradient-to-b from-transparent to-background"
                    : "hidden"
                }
              />
            </Collapse>
          </div>

          {/* Mobile */}
          <Sheet open={mobileSidebar} onOpenChange={setMobileSidebar}>
            <SheetContent className="pl-3 pr-0">
              <SheetHeader>
                <h3 className="title px-5 mb-1">{t("toc")}</h3>
              </SheetHeader>
              <Sidebar />
              <div className="sticky bottom-0 h-6 bg-gradient-to-b from-transparent to-background" />
            </SheetContent>
          </Sheet>

          {/* Content */}
          {children}
        </div>
      </div>
    );
  }
);

export default HansardSidebar;
