import { useTranslation } from "@hooks/useTranslation";
import { Mesyuarat } from "@lib/types";
import {
  ForwardedRef,
  forwardRef,
  MutableRefObject,
  useImperativeHandle,
  useState,
} from "react";
import CatalogueFolder, { DrawerOpen } from "./folder";
import { OpenFolder } from "./folder-open";

/**
 * Penggal
 * @overview Status: In-development
 */

interface PenggalProps {
  drawerRef: MutableRefObject<Record<string, DrawerOpen | null>>;
  id: string;
  mesyuarat: {
    [key: string]: Mesyuarat;
  };
  penggal_id: string;
  scrollRef: MutableRefObject<Record<string, HTMLElement | null>>;
  yearRange: string;
}

export interface FolderOpen {
  open: (index: number) => void;
}

const CataloguePenggal = forwardRef(
  (
    {
      drawerRef,
      id,
      mesyuarat,
      penggal_id,
      scrollRef,
      yearRange,
    }: PenggalProps,
    ref: ForwardedRef<FolderOpen>
  ) => {
    const meetings = Object.keys(mesyuarat).sort(
      (a, b) =>
        Date.parse(mesyuarat[a].end_date) - Date.parse(mesyuarat[b].end_date)
    );
    const { t } = useTranslation("enum");

    const [penggalIndex, setPenggalIndex] = useState(-1);

    useImperativeHandle(
      ref,
      () => {
        return {
          open: (index: number) => {
            setPenggalIndex(index);
          },
        };
      },
      []
    );

    return (
      <div>
        {penggalIndex >= 0 ? (
          <OpenFolder
            id={id}
            meeting={mesyuarat[penggalIndex]}
            meeting_id={String(penggalIndex)}
            setPenggalIndex={setPenggalIndex}
            yearRange={yearRange}
          />
        ) : (
          <>
            <div className="flex grow items-center gap-3 pt-3">
              <h3
                id={penggal_id}
                ref={ref => (scrollRef.current[penggal_id] = ref)}
                className="flex w-fit scroll-mt-[168px] flex-wrap text-lg font-semibold sm:whitespace-nowrap"
              >
                {t("penggal_full", {
                  n: id,
                })}
                {yearRange}
              </h3>
              <span className="hidden h-0.5 w-full border border-dashed border-otl-gray-200 sm:block" />
            </div>
            <div className="grid grid-cols-2 gap-x-6 gap-y-[54px] pb-6 pt-12 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5">
              {meetings.map(id => {
                if (Number(id) >= 0)
                  return (
                    <CatalogueFolder
                      key={id}
                      ref={ref =>
                        (drawerRef.current[`${penggal_id}-mesyuarat-${id}`] =
                          ref)
                      }
                      onOpen={() => setPenggalIndex(Number(id))}
                      meeting={mesyuarat[id]}
                      meeting_id={id}
                    />
                  );
                return <></>;
              })}
            </div>
          </>
        )}
      </div>
    );
  }
);

export default CataloguePenggal;
