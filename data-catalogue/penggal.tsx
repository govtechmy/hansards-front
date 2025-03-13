import { useTranslation } from "@hooks/useTranslation";
import { Mesyuarat } from "@lib/types";
import { useRef, useState } from "react";
import CatalogueFolder, { FolderOpen } from "./folder";
import { OpenFolder } from "./folder-open";

/**
 * Penggal
 * @overview Status: In-development
 */

interface PenggalProps {
  id: string;
  mesyuarat: {
    [key: string]: Mesyuarat;
  };
  penggal_id: string;
  yearRange: string;
}

const CataloguePenggal = ({
  id,
  mesyuarat,
  penggal_id,
  yearRange,
}: PenggalProps) => {
  const meetings = Object.keys(mesyuarat).sort(
    (a, b) =>
      Date.parse(mesyuarat[a].end_date) - Date.parse(mesyuarat[b].end_date)
  );
  const { t } = useTranslation("enum");
  const folderRef = useRef<Record<string, FolderOpen | null>>({});
  const [penggalIndex, setPenggalIndex] = useState(-1);

  return (
    <div id={penggal_id} className="scroll-mt-[168px]">
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
          <div className="flex grow items-center gap-3">
            <h3 className="flex w-fit flex-wrap text-lg font-semibold sm:whitespace-nowrap">
              {t("penggal_full", {
                n: id,
              })}
              {yearRange}
            </h3>
            <span className="hidden h-0.5 w-full border border-dashed border-otl-gray-200 sm:block" />
          </div>
          <div className="grid grid-cols-2 gap-x-6 gap-y-[54px] pb-6 pt-12 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5">
            {meetings.map(id => (
              <CatalogueFolder
                key={id}
                ref={ref =>
                  (folderRef.current[`${penggal_id}/mesyuarat-${id}`] = ref)
                }
                onOpen={() => setPenggalIndex(Number(id))}
                meeting={mesyuarat[id]}
                meeting_id={id}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default CataloguePenggal;
