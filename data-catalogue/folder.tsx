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
import { BREAKPOINTS } from "@lib/constants";
import { WindowContext } from "@lib/contexts/window";
import { cn, copyClipboard } from "@lib/helpers";
import { Mesyuarat } from "@lib/types";
import Image from "next/image";
import Link from "next/link";
import { useContext, useMemo, useState } from "react";

/**
 * Catalogue Folder
 * @overview Status: In-development
 */

interface CatalogueFolderProps {
  isOpen: boolean;
  meeting: Mesyuarat;
  meeting_id: string;
}

export default function CatalogueFolder({
  isOpen,
  meeting,
  meeting_id,
}: CatalogueFolderProps) {
  const { t, i18n } = useTranslation(["catalogue", "enum"]);
  const [open, setOpen] = useState<boolean>(isOpen);
  const [copyText, setCopyText] = useState<string>("copy");
  const title = `Hansard Parlimen`;
  const { size } = useContext(WindowContext);

  const { start_date, end_date, sitting_list } = meeting;

  const dateRange = useMemo(() => {
    function getShortDate(date: string) {
      return new Date(date).toLocaleDateString(i18n.language, {
        month: "short",
        day: "numeric",
      });
    }
    const start = getShortDate(start_date);
    const end = getShortDate(end_date);
    return start === end ? `${start}` : `${start} - ${end}`;
  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        className="flex flex-col gap-y-1.5 items-center group font-medium"
        onClick={() => setOpen(!open)}
      >
        <div
          className={cn(
            "border group-hover:border-slate-200 dark:group-hover:border-zinc-800 rounded-md w-[100px] h-20 relative mb-1.5",
            open ? "visible pl-2 pt-2" : "p-2 border-transparent"
          )}
        >
          {open ? (
            <Image
              src="/static/images/icons/open-folder.png"
              width={84}
              height={64}
              alt="Open Folder"
            />
          ) : (
            <Image
              src="/static/images/icons/closed-folder.png"
              width={84}
              height={64}
              alt="Closed Folder"
            />
          )}
          <span className="absolute bottom-3 right-3 bg-slate-400 rounded-md flex gap-0.5 items-center py-0.5 px-1.5 text-white ">
            <BookmarkIcon className="h-3.5 w-3.5" />
            {sitting_list.length}
          </span>
        </div>
        {t("mesyuarat_full", {
          ns: "enum",
          n: meeting_id,
        })}
        <span className="text-zinc-500 text-sm font-normal">{dateRange}</span>
      </DialogTrigger>
      {open && (
        <DialogContent className="p-0">
          <div className="w-full border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900 p-6 flex flex-col gap-y-5 rounded-t-xl">
            <DialogHeading className="gap-x-3 flex items-center justify-between">
              <span className="gap-x-3 flex items-center ">
                <Image
                  src="/static/images/icons/open-folder.png"
                  width={32}
                  height={20}
                  alt="Open Folder"
                />
                <span className="flex flex-wrap gap-x-3 font-medium text-zinc-900 dark:text-white">
                  {t("mesyuarat_full", {
                    ns: "enum",
                    n: meeting_id,
                  })}
                  <span className="font-normal text-zinc-500">{dateRange}</span>
                </span>
              </span>
              <DialogClose />
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
                  const { filename, date } = sitting;
                  const hansard_id = `${
                    filename.startsWith("kk")
                      ? "kamar-khas"
                      : filename.startsWith("dr")
                      ? "dewan-rakyat"
                      : "dewan-negara"
                  }/${date}`;
                  const { download, share } = useAnalytics(hansard_id);
                  const URL = `https://hansard.parlimen.gov.my/hansard/${hansard_id}`;

                  const cols = size.width < BREAKPOINTS.XL ? 2 : 3;
                  const modulo = sitting_list.length % cols;
                  const itemsInLastRow =
                    size.width < BREAKPOINTS.MD
                      ? 1
                      : modulo === 0
                      ? cols
                      : modulo;

                  return (
                    <div
                      key={i}
                      className="flex items-center gap-x-4.5 p-3 shadow-button border dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-900"
                    >
                      <DateCard date={date} size="sm" />
                      <div className="flex flex-col gap-y-1.5">
                        <Link
                          href={`/hansard/${hansard_id}`}
                          prefetch={false}
                          onClick={() => setOpen(false)}
                          className="font-medium hover:underline [text-underline-position:from-font] text-zinc-900 dark:text-white"
                        >
                          {new Date(date).toLocaleDateString(i18n.language, {
                            weekday: "long",
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </Link>
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
                                { label: t("csv"), value: "csv" },
                              ]}
                              anchor={
                                i > sitting_list.length - itemsInLastRow - 1
                                  ? "bottom-6"
                                  : ""
                              }
                              onChange={({ value: filetype }) => {
                                window.open(
                                  `${process.env.NEXT_PUBLIC_DOWNLOAD_URL}${
                                    filename.startsWith("dr")
                                      ? "dewanrakyat"
                                      : "dewannegara"
                                  }/${filename}.${filetype}`,
                                  "_blank"
                                );
                                download(filetype);
                              }}
                            />
                            •
                            <Dropdown
                              className="p-0 border-none shadow-none text-blue-600 dark:text-primary-dark hover:underline [text-underline-position:from-font] font-normal gap-1 dark:hover:bg-transparent active:bg-transparent dark:active:bg-transparent dark:hover:text-blue-600"
                              width="w-fit"
                              placeholder={t("share")}
                              selected={undefined}
                              options={[
                                {
                                  label: "Twitter",
                                  value: `https://www.twitter.com/intent/tweet?text=${title}&url=${URL}&hashtags=hansard`,
                                },
                                {
                                  label: "Facebook",
                                  value: `https://www.facebook.com/sharer/sharer.php?u=${URL}&t=${title}`,
                                },
                                {
                                  label: "E-mail",
                                  value: `mailto:?subject=${title}&body=${URL}`,
                                },
                                {
                                  label: t(copyText, { ns: "common" }),
                                  value: "copy",
                                },
                              ]}
                              anchor={
                                i > sitting_list.length - itemsInLastRow - 1
                                  ? "bottom-6 right-0"
                                  : "right"
                              }
                              onChange={({ value: link }) => {
                                share();
                                if (link === "copy") {
                                  copyClipboard(URL);
                                  setCopyText("copied");
                                  setTimeout(() => {
                                    setCopyText("copy");
                                  }, 1000);
                                } else window.open(link, "_blank");
                              }}
                            />
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </DialogDescription>
          </div>
        </DialogContent>
      )}
    </Dialog>
  );
}
