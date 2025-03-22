import { Button } from "@components/index";
import { ArrowBackIcon, ChevronRightIcon } from "@govtechmy/myds-react/icon";
import { useTranslation } from "@hooks/useTranslation";
import { OpenFolderIcon } from "@icons/index";
import { cn } from "@lib/helpers";
import { Mesyuarat } from "@lib/types";
import { Dispatch, SetStateAction } from "react";
import { MesyuaratDates } from "./dates";

/**
 * Mesyuarat Dates
 * @overview Status: In-development
 */

interface OpenFolderProps {
  id: string;
  meeting: Mesyuarat;
  meeting_id: string;
  setPenggalIndex: Dispatch<SetStateAction<number>>;
  yearRange: string;
}

export const OpenFolder = ({
  id,
  meeting,
  meeting_id,
  setPenggalIndex,
  yearRange,
}: OpenFolderProps) => {
  const { t, i18n } = useTranslation(["enum", "hansard"]);

  function getShortDate(date: string) {
    return new Date(date).toLocaleDateString(i18n.language, {
      month: "short",
      day: "numeric",
    });
  }
  const { start_date, end_date, sitting_list } = meeting;
  const start = getShortDate(start_date);
  const end = getShortDate(end_date);
  const dateRange = start === end ? `${start}` : `${start} - ${end}`;

  return (
    <div className="hidden flex-col gap-3 sm:flex">
      <div className="top-[164px] z-10 flex flex-wrap items-center gap-1 whitespace-nowrap bg-bg-white py-3 text-sm font-medium xl:sticky">
        <Button variant="reset" onClick={() => setPenggalIndex(-1)}>
          <h3 className="flex w-fit flex-wrap items-center gap-3 text-lg font-semibold text-txt-black-500 hover:text-txt-black-900 sm:whitespace-nowrap">
            <ArrowBackIcon className="size-6" />
            {t("penggal_full", {
              n: id,
            })}
            {yearRange}
          </h3>
        </Button>

        <ChevronRightIcon className="size-6 text-txt-black-500" />

        <div className="flex grow items-center gap-3">
          <OpenFolderIcon className="h-6 w-8 shrink-0" />
          <span className="text-lg font-semibold">
            {t("mesyuarat_full", {
              ns: "enum",
              n: meeting_id,
            })}
          </span>
          <span className="text-sm font-normal text-txt-black-500">
            {dateRange}
          </span>
          <span
            className={cn(
              "hidden h-0.5 w-full grow sm:block",
              "border border-dashed border-otl-gray-200"
            )}
          />
        </div>
      </div>

      <MesyuaratDates sitting_list={sitting_list} />
    </div>
  );
};
