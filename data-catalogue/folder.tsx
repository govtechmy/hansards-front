import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogHeader,
  DialogTrigger,
} from "@components/Dialog";
import {
  Drawer,
  DrawerContent,
  DrawerClose,
  DrawerHeader,
  DrawerTrigger,
} from "@components/Drawer";
import { DateCard, Dropdown } from "@components/index";
import { XMarkIcon } from "@heroicons/react/20/solid";
import { BookmarkIcon } from "@heroicons/react/24/solid";
import { useAnalytics } from "@hooks/useAnalytics";
import { useMediaQuery } from "@hooks/useMediaQuery";
import { useTranslation } from "@hooks/useTranslation";
import { BREAKPOINTS } from "@lib/constants";
import { WindowContext } from "@lib/contexts/window";
import { cn, copyClipboard } from "@lib/helpers";
import { routes } from "@lib/routes";
import { Mesyuarat } from "@lib/types";
import Image from "next/image";
import Link from "next/link";
import {
  ForwardedRef,
  forwardRef,
  useContext,
  useImperativeHandle,
  useMemo,
  useState,
} from "react";

/**
 * Catalogue Folder
 * @overview Status: In-development
 */

interface CatalogueFolderProps {
  meeting: Mesyuarat;
  meeting_id: string;
}

export interface FolderOpen {
  open: (url: string) => void;
}

const CatalogueFolder = forwardRef(
  (
    { meeting, meeting_id }: CatalogueFolderProps,
    ref: ForwardedRef<FolderOpen>
  ) => {
    const { t, i18n } = useTranslation(["catalogue", "enum", "hansard"]);
    const isDesktop = useMediaQuery("(min-width: 768px)");

    const [open, setOpen] = useState<boolean>(false);
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

    useImperativeHandle(
      ref,
      () => {
        return {
          open: () => {
            setOpen(true);
          },
        };
      },
      []
    );

    const MesyuaratDates = () => (
      <div
        className={cn(
          "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 max-h-[80dvh] max-md:p-4",
          sitting_list.length < 4
            ? "overflow-visible"
            : "overflow-y-auto scroll"
        )}
      >
        {sitting_list.map((sitting, i) => {
          const { filename, date } = sitting;
          const hansard_id = `${
            filename.startsWith("kk")
              ? routes.HANSARD_KK
              : filename.startsWith("dr")
              ? routes.HANSARD_DR
              : routes.HANSARD_DN
          }/${date}`;
          const { download, share } = useAnalytics(hansard_id);
          const URL = `${process.env.NEXT_PUBLIC_APP_URL}${hansard_id}`;

          const cols = size.width < BREAKPOINTS.XL ? 2 : 3;
          const modulo = sitting_list.length % cols;
          const itemsInLastRow =
            size.width < BREAKPOINTS.MD ? 1 : modulo === 0 ? cols : modulo;

          const className = {
            dropdown:
              "link p-0 border-none shadow-none text-blue-600 dark:text-primary-dark font-normal gap-1 dark:hover:bg-transparent active:bg-transparent dark:active:bg-transparent dark:hover:text-blue-600 overflow-x-hidden",
          };

          return (
            <div
              key={i}
              className="flex items-center gap-x-4.5 p-3 shadow-button border dark:border-zinc-800 rounded-lg bg-background"
            >
              <DateCard date={date} size="sm" />
              <div className="flex flex-col gap-y-1.5">
                <Link
                  href={hansard_id}
                  prefetch={false}
                  onClick={() => setOpen(false)}
                  className="link font-medium text-foreground"
                >
                  {new Date(date).toLocaleDateString(i18n.language, {
                    weekday: "long",
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </Link>
                <div>
                  <div className="text-blue-600 dark:text-primary-dark flex gap-1.5 text-sm items-center whitespace-nowrap flex-wrap">
                    {/* <span className="link dark:hover:text-blue-600">
                      {t("cite")}
                    </span>
                    • */}
                    <Dropdown
                      className={className.dropdown}
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
                      className={className.dropdown}
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
                          label: t("email", { ns: "hansard" }),
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
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );

    const FolderTab = () => (
      <span className="gap-x-3 flex items-center">
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
    );

    const Folder = () => (
      <>
        <div
          className={cn(
            "border group-hover:border-border rounded-md w-[100px] h-20 relative mb-1.5",
            open ? "visible pl-2 pt-2" : "p-2 border-transparent"
          )}
        >
          <Image
            src="/static/images/icons/closed-folder.png"
            width={84}
            height={64}
            alt="Closed Folder"
          />
          <span className="absolute bottom-3 right-3 bg-slate-400 rounded-md flex gap-0.5 items-center py-0.5 px-1.5 text-white">
            <BookmarkIcon className="h-3.5 w-3.5" />
            {sitting_list.length}
          </span>
        </div>
        {t("mesyuarat_full", {
          ns: "enum",
          n: meeting_id,
        })}
        <span className="text-zinc-500 text-sm font-normal">{dateRange}</span>
      </>
    );
    if (isDesktop)
      return (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger className="flex flex-col gap-y-1.5 items-center group font-medium">
            <Folder />
          </DialogTrigger>
          {open && (
            <DialogContent className="max-w-[68rem]">
              <DialogHeader className="gap-x-3 flex justify-between">
                <FolderTab />
                <DialogClose />
              </DialogHeader>
              <MesyuaratDates />
            </DialogContent>
          )}
        </Dialog>
      );

    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger className="flex flex-col gap-y-1.5 items-center group font-medium">
          <Folder />
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader className="gap-x-3 flex justify-between">
            <FolderTab />
            <DrawerClose>
              <XMarkIcon className="h-5 w-5" />
            </DrawerClose>
          </DrawerHeader>
          <MesyuaratDates />
        </DrawerContent>
      </Drawer>
    );
  }
);

export default CatalogueFolder;
