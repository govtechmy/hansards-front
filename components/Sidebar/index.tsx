import Button from "@components/Button";
import {
  Sheet,
  SheetContent,
  SheetHeading,
  SheetTrigger,
} from "@components/Sheet";
import { ChevronRightIcon } from "@heroicons/react/20/solid";
import { useMediaQuery } from "@hooks/useMediaQuery";
import { useTranslation } from "@hooks/useTranslation";
import { SidebarL } from "@icons/index";
import { cn } from "@lib/helpers";
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
      <ul className="max-lg:hide-scrollbar sidebar-scrollbar h-[calc(100dvh-56px)] overflow-y-auto overflow-x-hidden pt-1.5 lg:h-[calc(100dvh-168px)]">
        {data ? (
          data.map(({ id, penggal, yearRange }) => {
            const parlimen_id = `parlimen-${id}`;
            const parlimen = t("parlimen", {
              ns: "enum",
              count: id,
              ordinal: true,
            });
            const open = TreeState === undefined ? false : TreeState[id];
            return (
              <li
                key={id}
                title={`${parlimen}${yearRange}`}
                className={cn(
                  "relative text-sm",
                  selected && selected.startsWith(parlimen_id)
                    ? styles.active
                    : styles.inactive
                )}
              >
                <Details
                  key={parlimen_id}
                  open={open || selected?.startsWith(parlimen_id)}
                  onOpen={() => (TreeState[id] = !open)}
                  summary={
                    <span className="flex flex-col">
                      {parlimen}
                      <span className="font-normal">{yearRange}</span>
                    </span>
                  }
                >
                  {penggal.map(({ id, yearRange }, i) => {
                    const parlimen_penggal = parlimen_id + `-penggal-${id}`;
                    const penggal_full = t("penggal_full", {
                      ns: "enum",
                      n: id,
                    });
                    return (
                      <li
                        key={parlimen_penggal}
                        title={penggal_full + yearRange}
                        onClick={() => {
                          setSelected(parlimen_penggal);
                          onClick(parlimen_penggal);
                          setMobileSidebar(false);
                        }}
                        className={cn(
                          "relative ml-2.5 px-5 py-0.5 hover:bg-bg-hover",
                          selected === parlimen_penggal
                            ? styles.active
                            : styles.inactive
                        )}
                      >
                        <p className="whitespace-nowrap font-medium">
                          {penggal_full}
                        </p>
                        {yearRange}
                        <SidebarL className="absolute bottom-1/2 left-[-0.5px]" />
                      </li>
                    );
                  })}
                  <div className="absolute left-2.5 top-0 z-10 h-[calc(100%-43px)] w-px border-l border-slate-400" />
                </Details>
              </li>
            );
          })
        ) : (
          <li className="px-5 py-1.5 text-sm italic text-zinc-500">
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
            "sticky top-28 h-[calc(100dvh-112px)] w-14 shrink-0 border-r border-r-border",
            "transform-gpu ease-in-out [transition-property:width] motion-reduce:transition-none",
            showSidebar ? "duration-300 lg:w-60" : "hide-scrollbar duration-500"
          )}
        >
          <div
            className={cn(
              "sticky top-0 z-10 flex items-end justify-between gap-3 whitespace-nowrap bg-background p-3 pb-1.5",
              showSidebar && "lg:pl-5"
            )}
          >
            <h4
              className={cn(
                "title",
                !showSidebar &&
                  "absolute origin-top-left translate-y-[150px] -rotate-90 text-zinc-500"
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
                  "size-4.5 transition-transform ease-in-out motion-reduce:transform-none",
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
          <div className="sticky top-28 flex gap-3 bg-background px-2 py-3">
            <h4 className="title absolute origin-top-left translate-y-[150px] -rotate-90">
              {t("full_archive")}
            </h4>
            <Sheet open={mobileSidebar} onOpenChange={setMobileSidebar}>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  className="p-1.5 shadow-button"
                  title={mobileSidebar ? t("hide_sidebar") : t("show_sidebar")}
                  onClick={() => setMobileSidebar(!mobileSidebar)}
                >
                  <ChevronRightIcon className="size-4.5" />
                </Button>
              </SheetTrigger>
              <SheetContent className="pl-3 pr-0">
                <SheetHeading>
                  <h3 className="title mb-1 px-5">{t("full_archive")}</h3>
                </SheetHeading>
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
