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
            const open = TreeState[id] === undefined ? false : TreeState[id];

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
                      "relative hover:bg-bg-hover box-border px-5 py-1.5 w-full text-start",
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
                    open={open || selected?.startsWith(id)}
                    onOpen={() => (TreeState[id] = !open)}
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
        <div className="sticky top-0 [mask-image:linear-gradient(to_bottom,transparent,#000_20px),linear-gradient(to_left,#000_10px,transparent_10px)]">
          <ul className="h-[calc(100dvh-56px)] lg:h-[calc(100dvh-112px)] max-lg:hide-scrollbar overflow-y-auto overflow-x-hidden sidebar-scrollbar pt-1.5">
            {speeches ? (
              recurTitle(speeches)
            ) : (
              <li className="px-5 py-1.5 text-zinc-500 text-sm italic">
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
              "border-r border-r-border shrink-0 w-14 hidden lg:block md:ml-4.5 lg:ml-6 sticky top-14 h-[calc(100dvh-56px)]",
              "transform-gpu [transition-property:width] ease-in-out motion-reduce:transition-none",
              showSidebar
                ? "w-[250px] duration-300"
                : "hide-scrollbar duration-500"
            )}
          >
            <div
              className={cn(
                "sticky top-14 z-10 bg-background flex gap-3 p-3 pb-1.5 items-baseline justify-between whitespace-nowrap",
                showSidebar && "lg:pl-5"
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
            </Collapse>
          </div>

          {/* Mobile */}
          <Sheet open={mobileSidebar} onOpenChange={setMobileSidebar}>
            <SheetContent className="pl-3 pr-0">
              <SheetHeader>
                <h3 className="title px-5 mb-1">{t("toc")}</h3>
              </SheetHeader>
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
