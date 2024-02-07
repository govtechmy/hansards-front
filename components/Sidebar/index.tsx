import Button from "@components/Button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from "@components/Sheet";
import { ChevronRightIcon } from "@heroicons/react/20/solid";
import { useMediaQuery } from "@hooks/useMediaQuery";
import { useTranslation } from "@hooks/useTranslation";
import { SidebarL } from "@icons/index";
import { cn } from "@lib/helpers";
import { Mesyuarat } from "@lib/types";
import { ReactNode, useState } from "react";
import { Details } from "./details";
import { Collapse } from "./collapse";

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

const TreeState: Record<string, boolean> = Object.create(null);

export default function Sidebar({ children, data, onClick }: SidebarProps) {
  const { t } = useTranslation(["catalogue", "enum"]);
  const [selected, setSelected] = useState<string>();
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  const [showSidebar, setSidebar] = useState<boolean>(true);
  const [mobileSidebar, setMobileSidebar] = useState<boolean>(false);

  const styles = {
    base: "px-5 py-1.5 w-full text-start leading-tight",
    active: "bg-bg-hover font-medium text-foreground",
    inactive: "text-zinc-500",
  };

  const Sidebar = () => (
    <div className="sticky top-14 [mask-image:linear-gradient(to_bottom,transparent,#000_20px),linear-gradient(to_left,#000_10px,transparent_10px)]">
      <ul className="h-[calc(100dvh-56px)] lg:h-[calc(100dvh-168px)] max-lg:hide-scrollbar overflow-y-auto overflow-x-hidden sidebar-scrollbar pt-1.5">
        {data ? (
          data.map(({ id, penggal, yearRange }) => {
            const parlimen_id = `parlimen-${id}/`;
            const parlimen = t("parlimen", {
              ns: "enum",
              count: id,
              ordinal: true,
            });
            const open = TreeState === undefined ? false : TreeState[id]
            return (
              <li
                key={id}
                title={`${parlimen}${yearRange}`}
                className={cn(
                  "text-sm relative",
                  selected && selected.startsWith(parlimen_id)
                    ? styles.active
                    : styles.inactive
                )}
              >
                <Details
                  key={parlimen_id}
                  open={open || selected?.startsWith(parlimen_id)}
                  onOpen={() => TreeState[id] = !open}
                  summary={
                    <span className="flex flex-col">
                      <span className="font-medium">{parlimen}</span>
                      {yearRange}
                    </span>
                  }
                >
                  {penggal.map(({ id, yearRange }) => {
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
                          setMobileSidebar(false);
                        }}
                        className={cn(
                          "hover:bg-bg-hover relative ml-2.5 px-5 py-0.5",
                          selected === parlimen_penggal
                            ? styles.active
                            : styles.inactive
                        )}
                      >
                        <p className="font-medium whitespace-nowrap">
                          {penggal_full}
                        </p>
                        {yearRange}
                        <SidebarL className="absolute left-[-0.5px] bottom-1/2" />
                      </li>
                    );
                  })}
                  <div
                    className="absolute left-2.5 top-0 w-px border-l border-slate-400 z-10"
                    style={{ height: (penggal.length - 1) * 47 + 10.5 }}
                  />
                </Details>
              </li>
            );
          })
        ) : (
          <li className="px-5 py-1.5 text-zinc-500 text-sm italic">
            {t("no_entries")}
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

  if (isDesktop)
    return (
      <div className="flex w-full">
        <div
          className={cn(
            "border-r border-r-border shrink-0 w-14 h-[calc(100dvh-112px)] sticky top-28",
            "transform-gpu [transition-property:width] ease-in-out motion-reduce:transition-none",
            showSidebar ? "lg:w-60 duration-300" : "hide-scrollbar duration-500"
          )}
        >
          <div
            className={cn(
              "sticky top-0 z-10 bg-background flex gap-3 p-3 pb-1.5 items-end justify-between whitespace-nowrap",
              showSidebar && "lg:pl-5"
            )}
          >
            <h4
              className={cn(
                "title",
                !showSidebar &&
                  "absolute -rotate-90 origin-top-left translate-y-[150px] text-zinc-500"
              )}
            >
              {t("full_archive")}
            </h4>
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

        {children}
      </div>
    );

  return (
    <>
      <div className="flex w-full">
        <div className="sticky top-28 h-screen whitespace-nowrap border-r border-r-border">
          <div className="sticky top-28 bg-background flex gap-3 py-3 px-2">
            <h4 className="title absolute -rotate-90 origin-top-left translate-y-[150px]">
              {t("full_archive")}
            </h4>
            <Sheet open={mobileSidebar} onOpenChange={setMobileSidebar}>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  className="p-1.5 shadow-button"
                  title={showSidebar ? t("hide_sidebar") : t("show_sidebar")}
                >
                  <ChevronRightIcon className="h-4.5 w-4.5" />
                </Button>
              </SheetTrigger>
              <SheetContent className="pl-3 pr-0">
                <SheetHeader>
                  <h3 className="title px-5 mb-1">{t("full_archive")}</h3>
                </SheetHeader>
                <Sidebar />
              </SheetContent>
            </Sheet>
          </div>
        </div>
        {children}
      </div>
    </>
  );
}
