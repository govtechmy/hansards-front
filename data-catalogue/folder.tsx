import {
  Drawer,
  DrawerContent,
  DrawerClose,
  DrawerHeader,
  DrawerTrigger,
} from "@components/Drawer";
import { Button } from "@components/index";
import { XMarkIcon } from "@heroicons/react/20/solid";
import { BookmarkIcon } from "@heroicons/react/24/solid";
import { useMediaQuery } from "@hooks/useMediaQuery";
import { useTranslation } from "@hooks/useTranslation";
import { cn } from "@lib/helpers";
import { Mesyuarat } from "@lib/types";
import Image from "next/image";
import { ForwardedRef, forwardRef, useImperativeHandle, useState } from "react";
import { MesyuaratDates } from "./dates";

/**
 * Catalogue Folder
 * @overview Status: In-development
 */

interface CatalogueFolderProps {
  meeting: Mesyuarat;
  meeting_id: string;
  onOpen: (id: number) => void;
}

export interface FolderOpen {
  open: (url: string) => void;
}

const CatalogueFolder = forwardRef(
  (
    { meeting, meeting_id, onOpen }: CatalogueFolderProps,
    ref: ForwardedRef<FolderOpen>
  ) => {
    const { t, i18n } = useTranslation(["catalogue", "enum", "hansard"]);
    const isDesktop = useMediaQuery("(min-width: 768px)");
    const [open, setOpen] = useState<boolean>(false);

    const { start_date, end_date, sitting_list } = meeting;

    function getShortDate(date: string) {
      return new Date(date).toLocaleDateString(i18n.language, {
        month: "short",
        day: "numeric",
      });
    }
    const start = getShortDate(start_date);
    const end = getShortDate(end_date);
    const dateRange = start === end ? `${start}` : `${start} - ${end}`;

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

    const FolderTab = () => (
      <span className="flex items-center gap-x-3">
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
            "relative mb-1.5 h-20 w-[100px] rounded-md border group-hover:border-border",
            open ? "visible pl-2 pt-2" : "border-transparent p-2"
          )}
        >
          <Image
            src="/static/images/icons/closed-folder.png"
            width={84}
            height={64}
            alt="Closed Folder"
          />
          <span className="absolute bottom-3 right-3 flex items-center gap-0.5 rounded-md bg-slate-400 px-1.5 py-0.5 text-white">
            <BookmarkIcon className="h-3.5 w-3.5" />
            {sitting_list.length}
          </span>
        </div>
        {t("mesyuarat_full", {
          ns: "enum",
          n: meeting_id,
        })}
        <span className="text-sm font-normal text-zinc-500">{dateRange}</span>
      </>
    );

    if (isDesktop)
      return (
        <Button
          variant="reset"
          onClick={() => onOpen(Number(meeting_id))}
          className="group flex flex-col items-center gap-y-1.5 font-medium"
        >
          <Folder />
        </Button>
      );

    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger className="group flex flex-col items-center gap-y-1.5 font-medium">
          <Folder />
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader className="flex justify-between gap-x-3 border-b border-border">
            <FolderTab />
            <DrawerClose>
              <XMarkIcon className="h-5 w-5" />
            </DrawerClose>
          </DrawerHeader>
          <MesyuaratDates
            onClick={() => setOpen(false)}
            sitting_list={sitting_list}
          />
        </DrawerContent>
      </Drawer>
    );
  }
);

export default CatalogueFolder;
