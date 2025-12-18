import { Container } from "@components/index";
import { useTranslation } from "@hooks/useTranslation";
import { Archive } from "@lib/types";
import { useEffect, useMemo, useRef, useState } from "react";
import { DrawerOpen } from "./folder";
import Penggal, { FolderOpen } from "./penggal";
import dynamic from "next/dynamic";

/**
 * Catalogue Index
 * @overview Status: In-development
 */

interface CatalogueIndexProps {
  archive: Archive;
  parlimens: string[];
}

const Sidebar = dynamic(() => import("@components/Sidebar"), {
  loading: () => <div className="h-full w-60" />,
  ssr: false,
});

const CatalogueIndex = ({ archive, parlimens }: CatalogueIndexProps) => {
  const { t } = useTranslation(["catalogue", "common", "enum"]);
  const drawerRef = useRef<Record<string, DrawerOpen | null>>({});
  const folderRef = useRef<Record<string, FolderOpen | null>>({});
  const scrollRef = useRef<Record<string, HTMLElement | null>>({});

  const classNames = {
    hr: "hidden sm:block border border-slate-200 dark:border-zinc-800 w-full h-0.5",
  };

  const data = useMemo(
    () =>
      Object.keys(archive)
        .reverse()
        .map(p => {
          const { start_date, end_date, ...sessions } = archive[p];
          const start = start_date.substring(0, 4);
          const end = end_date.substring(0, 4);
          const yearRange =
            start === end ? ` (${start})` : ` (${start} - ${end})`;

          return {
            id: p,
            yearRange,
            penggal: Object.keys(sessions)
              .reverse()
              .map(s => {
                const { start_date, end_date, ...mesyuarat } = sessions[s];

                const start = start_date.substring(0, 4);
                const end = end_date.substring(0, 4);
                const yearRange =
                  start === end ? ` (${start})` : ` (${start} - ${end})`;

                return {
                  id: s,
                  yearRange,
                  mesyuarat,
                };
              }),
          };
        }),
    []
  );

  const [selected, setSelected] = useState<string>("");

  useEffect(() => {
    const el = scrollRef.current[selected];
    if (el)
      el.scrollIntoView({
        behavior: "smooth",
      });
  }, [selected]);

  useEffect(() => {
    const hash = document.location.hash;
    const regex = /(parlimen|penggal|mesyuarat)-\d+/g;
    const levels = hash.match(regex);

    if (levels && levels.length === 3) {
      const [parlimen, penggal, mesyuarat] = levels;
      if (mesyuarat) {
        const id = hash.slice(1);
        const el = drawerRef.current[id];
        if (el) el.open();
      }
    }
  }, []);

  return (
    <>
      <Container className="pl-1.5 pr-3">
        <Sidebar
          data={data}
          onClick={selected => {
            window.location.hash = selected;
            setSelected(selected);
          }}
        >
          <div className="flex h-full w-full flex-col pb-6 pl-4.5 pt-3 sm:pl-8 lg:pb-8">
            {data ? (
              parlimens.map((_, index) => {
                const { id, penggal, yearRange } = data[index];
                const parlimen_id = `parlimen-${id}`;

                return (
                  <div key={id} className="flex flex-col">
                    <div className="sticky top-28 z-20 flex items-center gap-3 bg-background py-3">
                      <h2
                        className="header scroll-mt-40 break-all max-sm:line-clamp-1 sm:whitespace-nowrap lg:scroll-mt-28"
                        id={parlimen_id}
                      >
                        {t("parlimen", {
                          ns: "enum",
                          count: Number(id),
                          ordinal: true,
                        })}
                        {yearRange}
                      </h2>
                      <span className={classNames.hr} />
                    </div>

                    <div className="space-y-8 pb-[42px]">
                      {penggal.map(penggal => {
                        const parlimen_penggal = `${parlimen_id}-penggal-${penggal.id}`;
                        return (
                          <Penggal
                            penggal_id={parlimen_penggal}
                            drawerRef={drawerRef}
                            scrollRef={scrollRef}
                            ref={ref =>
                              (folderRef.current[parlimen_penggal] = ref)
                            }
                            {...penggal}
                          />
                        );
                      })}
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="p-2 pt-16 text-zinc-500 lg:p-8">
                {t("no_entries", { ns: "common" })}.
              </p>
            )}
          </div>
        </Sidebar>
      </Container>
    </>
  );
};

export default CatalogueIndex;
