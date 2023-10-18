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
import { useAnalytics } from "@hooks/useAnalytics";
import { useTranslation } from "@hooks/useTranslation";
import { ClosedFolderIcon, OpenFolderIcon } from "@icons/index";
import { get } from "@lib/api";
import { BREAKPOINTS } from "@lib/constants";
import { WindowContext } from "@lib/contexts/window";
import { cn, download } from "@lib/helpers";
import { routes } from "@lib/routes";
import { Sitting } from "@lib/types";
import Link from "next/link";
import { useContext, useState } from "react";

/**
 * Catalogue Folder
 * @overview Status: In-development
 */

interface CatalogueFolderProps {
  dateRange: string;
  onClick: () => void;
  onClose: () => void;
  meeting: string;
  sitting_list: Sitting[];
}

export default function CatalogueFolder({
  dateRange,
  onClick,
  onClose,
  meeting,
  sitting_list,
}: CatalogueFolderProps) {
  const { t, i18n } = useTranslation(["catalogue", "enum"]);
  const [open, setOpen] = useState<boolean>(false);
  const { size } = useContext(WindowContext);

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        setOpen(open);
        if (!open) onClose();
      }}
    >
      <DialogTrigger>
        <div
          className="flex flex-col gap-y-3 items-center pt-2"
          onClick={() => {
            setOpen(!open);
            onClick();
          }}
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
          <div
            className={cn(
              "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 max-h-[80vh]",
              sitting_list.length < 4
                ? "overflow-visible"
                : "overflow-y-auto scroll"
            )}
          >
            {sitting_list.map((sitting, i) => {
              const { track } = useAnalytics(sitting.filename);

              const cols = size.width < BREAKPOINTS.XL ? 2 : 3;
              const modulo = sitting_list.length % cols;
              const itemsInLastRow =
                size.width < BREAKPOINTS.MD ? 1 : modulo === 0 ? cols : modulo;

              return (
                <Link
                  href={`${
                    sitting.filename.startsWith("dr")
                      ? routes.HANSARD_DR
                      : routes.HANSARD_DN
                  }/${sitting.date}`}
                  prefetch={false}
                  className="flex items-center gap-x-4.5 p-3 shadow-button hover:shadow-floating border dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-900"
                >
                  <DateCard date={sitting.date} size="sm" />
                  <div className="flex flex-col gap-y-1.5">
                    <p className="font-medium">
                      {new Date(sitting.date).toLocaleDateString(
                        i18n.language,
                        {
                          weekday: "long",
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        }
                      )}
                    </p>
                    <div>
                      <p className="text-blue-600 dark:text-primary-dark flex gap-1.5 text-sm items-center whitespace-nowrap flex-wrap">
                        <span className="dark:hover:text-blue-600 hover:underline [text-underline-position:from-font]">
                          {t("cite")}
                        </span>
                        •
                        <Dropdown
                          className="p-0 border-none shadow-none text-blue-600 dark:text-primary-dark hover:underline [text-underline-position:from-font] font-normal gap-1 dark:hover:bg-transparent active:bg-transparent dark:active:bg-transparent dark:hover:text-blue-600"
                          width="w-fit"
                          placeholder={t("download")}
                          selected={undefined}
                          options={[
                            { label: "PDF", value: "pdf" },
                            { label: t("csv.title"), value: "csv" },
                          ]}
                          anchor={
                            i > sitting_list.length - itemsInLastRow - 1
                              ? "bottom-6"
                              : ""
                          }
                          onChange={({ value: filetype }) => {
                            download(
                              `${process.env.NEXT_PUBLIC_DOWNLOAD_URL}${
                                sitting.filename.startsWith("dr")
                                  ? "dewanrakyat"
                                  : "dewannegara"
                              }/${sitting.filename}.${filetype}`,
                              `sitting.filename.${filetype}`
                            );
                            track(filetype);
                          }}
                        />
                        •
                        <span className="dark:hover:text-blue-600 hover:underline [text-underline-position:from-font]">
                          {t("share")}
                        </span>
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
}
