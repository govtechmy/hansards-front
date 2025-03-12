import Button from "@components/Button";
import { Sheet, SheetContent, SheetHeading } from "@components/Sheet";
import { Details } from "@components/Sidebar/details";
import { Collapse } from "@components/Sidebar/collapse";
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
  useMemo,
  useState,
} from "react";
import { isSpeech } from "@lib/utils";

interface HansardSidebarProps {
  children: (open: boolean) => ReactNode;
  onClick: (index: string) => void;
  speeches: Speeches;
}

export interface SidebarOpen {
  open: () => void;
}

const TreeState: Record<string, boolean> = Object.create(null);

const HansardSidebar = forwardRef(
  (
    { children, speeches, onClick }: HansardSidebarProps,
    ref: ForwardedRef<SidebarOpen>
  ) => {
    const { t, i18n } = useTranslation(["hansard", "common"]);
    const [selected, setSelected] = useState<string>();
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
      active: "bg-bg-hover font-medium text-foreground",
      inactive: "text-txt-black-500",
    };

    const Sidebar = () => {
      const headers = useMemo(() => {
        const recur = (
          speeches: Speeches,
          first: boolean = true,
          prev_id?: string
        ) => {
          return (
            speeches
              // .filter((s) => !isSpeech(s))
              .map((s, i) => {
                const id = prev_id ? `${prev_id}_${i}` : `${i}`;
                const open = TreeState[id] === undefined ? true : TreeState[id];
                const key = Object.keys(s)[0];
                if (isSpeech(s)) return;
                else {
                  // has 1 more level
                  if (s[key].some(s => !isSpeech(s))) {
                    return (
                      <li
                        key={id}
                        className={cn(
                          "relative mr-px text-sm",
                          !first &&
                            "border-l border-slate-400 last:border-background",
                          selected && selected.startsWith(id)
                            ? styles.active
                            : styles.inactive
                        )}
                      >
                        <Details
                          className="relative"
                          childClassName="pl-2.5"
                          key={id}
                          open={open || selected?.startsWith(id)}
                          onOpen={() => (TreeState[id] = !open)}
                          summary={
                            <>
                              <span title={key}>{key}</span>
                              {!first && (
                                <>
                                  <SidebarL className="absolute bottom-1/2 left-[-1.5px]" />
                                  {i <= speeches.length - 1 && (
                                    <div className="absolute left-[-1.25px] top-0 h-[calc(50%-17px)] w-px bg-slate-400" />
                                  )}
                                </>
                              )}
                            </>
                          }
                        >
                          {recur(s[key], false, id)}
                        </Details>
                      </li>
                    );
                  } else
                    return (
                      <button
                        key={key}
                        title={key}
                        onClick={() => {
                          setSelected(id);
                          onClick(id);
                          setMobileSidebar(false);
                        }}
                        className={cn(
                          "relative box-border w-full px-5 py-1.5 text-start text-sm font-medium hover:bg-bg-hover",
                          !first &&
                            "border-l-[1.25px] border-slate-400 last:border-transparent",
                          selected === id ? styles.active : styles.inactive
                        )}
                      >
                        <p>{key}</p>
                        {!first && (
                          <>
                            <SidebarL className="absolute bottom-1/2 left-[-1.5px]" />
                            {i <= speeches.length - 1 && (
                              <div className="absolute -left-px top-0 h-[calc(50%-17px)] w-px bg-slate-400" />
                            )}
                          </>
                        )}
                      </button>
                    );
                }
              })
          );
        };
        return recur(speeches);
      }, [TreeState]);

      return (
        <div className="sticky top-0 [mask-image:linear-gradient(to_bottom,transparent,#000_20px),linear-gradient(to_left,#000_10px,transparent_10px)]">
          <ul className="max-lg:hide-scrollbar sidebar-scrollbar h-[calc(100dvh-56px)] overflow-y-auto overflow-x-hidden pt-3 will-change-scroll lg:h-[calc(100dvh-112px)]">
            {headers ? (
              headers
            ) : (
              <li className="px-5 py-1.5 text-sm italic text-txt-black-500">
                {t("no_entries", { ns: "common" })}
              </li>
            )}
            <div
              className={
                showSidebar || mobileSidebar
                  ? "sticky bottom-0 h-6 bg-gradient-to-b from-transparent to-background"
                  : "hidden"
              }
            />
          </ul>
        </div>
      );
    };

    return (
      <div className="flex h-full w-full justify-center">
        <div className="flex h-full w-full max-w-screen-2xl">
          {/* Desktop */}
          <div
            className={cn(
              "sticky top-14 hidden h-[calc(100dvh-56px)] w-14 shrink-0 border-r border-r-border md:ml-3 lg:block",
              "transform-gpu ease-in-out [transition-property:width] motion-reduce:transition-none",
              showSidebar
                ? "w-[250px] duration-300"
                : "hide-scrollbar duration-500"
            )}
          >
            <div
              className={cn(
                "sticky top-14 z-10 flex items-baseline justify-between gap-3 whitespace-nowrap bg-background p-3 pb-0",
                showSidebar && "lg:pl-5"
              )}
            >
              <h3
                className={cn(
                  "title",
                  !showSidebar &&
                    `absolute origin-top-left -rotate-90 text-txt-black-500 ${
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
            </Collapse>
          </div>

          {/* Mobile */}
          <Sheet open={mobileSidebar} onOpenChange={setMobileSidebar}>
            <SheetContent className="pl-3 pr-0">
              <SheetHeading>
                <h3 className="title mb-1 px-5">{t("toc")}</h3>
              </SheetHeading>
              <Sidebar />
            </SheetContent>
          </Sheet>

          {/* Content */}
          {children(showSidebar)}
        </div>
      </div>
    );
  }
);

export default HansardSidebar;
