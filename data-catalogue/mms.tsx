import { Container } from "@components/index";
import { useTranslation } from "@hooks/useTranslation";
import { ArchiveMMS, PenggalMMS, Sitting } from "@lib/types";
import dynamic from "next/dynamic";
import { useEffect, useMemo, useRef, useState } from "react";
import { MesyuaratDates } from "./dates";

/**
 * Katalog Majlis Mengangkat Sumpah
 * @overview Status: In-development
 */

interface CatalogueMMSProps {
  archive: ArchiveMMS;
}

const Sidebar = dynamic(() => import("@components/Sidebar"), {
  loading: () => <div className="h-full w-60" />,
  ssr: false,
});

// API MMS tiada tarikh pada parlimen/penggal, jadi julat tahun diambil daripada sitting
const yearRangeOf = (sittings: Sitting[]): string => {
  if (sittings.length === 0) return "";
  const years = sittings.map(s => Number(s.date.substring(0, 4)));
  const start = Math.min(...years);
  const end = Math.max(...years);
  return start === end ? ` (${start})` : ` (${start} - ${end})`;
};

const CatalogueMMS = ({ archive }: CatalogueMMSProps) => {
  const { t } = useTranslation(["catalogue", "common", "enum"]);
  const scrollRef = useRef<Record<string, HTMLElement | null>>({});
  const [selected, setSelected] = useState<string>("");

  const data = useMemo(
    () =>
      Object.keys(archive)
        .reverse()
        .map(term => {
          const { start_date, end_date, ...sessions } = archive[term];
          const penggal = Object.keys(sessions)
            .reverse()
            .map(id => {
              const sitting_list = (
                (sessions[id] as PenggalMMS).sitting_list ?? []
              )
                .slice()
                .sort((a, b) => Date.parse(a.date) - Date.parse(b.date));
              return { id, sitting_list, yearRange: yearRangeOf(sitting_list) };
            })
            .filter(s => s.sitting_list.length > 0);

          return {
            id: term,
            penggal,
            yearRange: yearRangeOf(penggal.flatMap(s => s.sitting_list)),
          };
        })
        .filter(p => p.penggal.length > 0),
    [archive]
  );

  useEffect(() => {
    scrollRef.current[selected]?.scrollIntoView({ behavior: "smooth" });
  }, [selected]);

  return (
    <Container className="pl-1.5 pr-3">
      <Sidebar
        data={data}
        onClick={selected => {
          window.location.hash = selected;
          setSelected(selected);
        }}
      >
        <div className="flex h-full w-full flex-col pb-6 pl-4.5 pt-3 sm:pl-8 lg:pb-8">
          {data.length > 0 ? (
            data.map(({ id, penggal, yearRange }) => {
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
                    <span className="hidden h-0.5 w-full border border-slate-200 dark:border-zinc-700 sm:block" />
                  </div>

                  <div className="space-y-8 pb-[42px]">
                    {penggal.map(s => {
                      const penggal_id = `${parlimen_id}-penggal-${s.id}`;
                      return (
                        <div key={s.id}>
                          <div className="flex grow items-center gap-3 pt-3">
                            <h3
                              id={penggal_id}
                              ref={ref => (scrollRef.current[penggal_id] = ref)}
                              className="flex w-fit scroll-mt-[168px] flex-wrap text-lg font-semibold sm:whitespace-nowrap"
                            >
                              {t("penggal_full", { ns: "enum", n: s.id })}
                              {s.yearRange}
                            </h3>
                            <span className="hidden h-0.5 w-full border border-dashed border-otl-gray-200 dark:border-zinc-700 sm:block" />
                          </div>
                          <div className="pb-6 pt-6">
                            <MesyuaratDates
                              sitting_list={s.sitting_list}
                              house="mms"
                            />
                          </div>
                        </div>
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
  );
};

export default CatalogueMMS;
