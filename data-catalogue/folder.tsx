import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogDescription,
  DialogHeading,
  DialogTrigger,
} from "@components/Dialog";
import { DateCard, Dropdown } from "@components/index";
import { BookmarkIcon } from "@heroicons/react/24/solid";
import { useTranslation } from "@hooks/useTranslation";
import { ClosedFolderIcon, OpenFolderIcon } from "@icons/index";
import { cn } from "@lib/helpers";
import { Sitting } from "@lib/types";
import { useState } from "react";

/**
 * Catalogue Folder
 * @overview Status: In-development
 */

interface CatalogueFolderProps {
  dateRange: string;
  meeting: string;
  sitting_list: Sitting[];
}

export default function CatalogueFolder({
  dateRange,
  meeting,
  sitting_list,
}: CatalogueFolderProps) {
  const { t, i18n } = useTranslation(["catalogue", "enum"]);
  const [open, setOpen] = useState<boolean>(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <div
          className="flex flex-col gap-y-3 items-center pt-2"
          onClick={() => setOpen(!open)}
        >
          <div className="relative">
            <div
              className={cn(
                open &&
                  "absolute -top-2 -left-2 border rounded-md -z-10 w-[100px] h-20"
              )}
            ></div>
            {open ? <OpenFolderIcon /> : <ClosedFolderIcon />}
            <div
              className={cn(
                open ? "right-3" : "right-1",
                "absolute bottom-1 bg-slate-400 rounded-md flex gap-0.5 items-center py-0.5 px-1.5"
              )}
            >
              <BookmarkIcon className="text-white h-3.5 w-3.5" />
              <p className="text-white font-medium">{sitting_list.length}</p>
            </div>
          </div>
          <div className="flex flex-col text-center gap-y-1">
            <p className="text-zinc-900 dark:text-white font-medium">
              {t("meeting_full", {
                ns: "enum",
                n: meeting,
              })}
            </p>
            <p className="text-slate-500 text-sm">{dateRange}</p>
          </div>
          {/* <div className="h-5 w-5 rotate-45 bg-slate-50 dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 border-l border-t"></div> */}
        </div>
      </DialogTrigger>
      <DialogContent className="w-full border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900 p-6 flex flex-col gap-y-5">
        <DialogHeading className="gap-x-3 flex items-center justify-between mr-6">
          <div className="gap-x-3 flex items-center max-[360px]:flex-wrap">
            <span className="font-medium text-zinc-900 dark:text-white">
              {t("meeting_full", {
                ns: "enum",
                n: meeting,
              })}
            </span>
            <span className="text-zinc-500">{dateRange}</span>
          </div>
          <DialogClose></DialogClose>
        </DialogHeading>
        <DialogDescription>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 max-h-[80vh] overflow-y-auto">
            {sitting_list.map((sitting) => (
              <div className="flex items-center gap-x-4.5 p-3 shadow-button hover:shadow-floating border dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-900">
                <DateCard date={sitting.date} size="sm" />
                <div className="flex flex-col gap-y-1.5">
                  <p className="font-medium">
                    {new Date(sitting.date).toLocaleDateString(i18n.language, {
                      weekday: "long",
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                  <div>
                    <p className="text-blue-600 dark:text-primary-dark flex gap-1.5 text-sm items-center whitespace-nowrap flex-wrap">
                      <span className="dark:hover:text-blue-600">
                        {t("cite")}
                      </span>
                      •
                      <Dropdown
                        className="p-0 border-none shadow-none text-blue-600 dark:text-primary-dark font-normal gap-1 dark:hover:bg-transparent dark:active:bg-transparent dark:hover:text-blue-600"
                        width="w-fit"
                        placeholder={t("download")}
                        selected={undefined}
                        options={[
                          { label: "pdf", value: "pdf" },
                          { label: "csv", value: "csv" },
                        ]}
                        // FIXME: download onChange
                        onChange={(e) => e}
                      />
                      •
                      <span className="dark:hover:text-blue-600">
                        {t("share")}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
}
