import { CalendarCard } from "@components/index";
import {
  arrow,
  FloatingArrow,
  FloatingFocusManager,
  autoUpdate,
  flip,
  limitShift,
  offset,
  shift,
  useClick,
  useDismiss,
  useFloating,
  useInteractions,
  useRole,
} from "@floating-ui/react";
import { BookmarkIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { useTranslation } from "@hooks/useTranslation";
import { ClosedFolderIcon, OpenFolderIcon } from "@icons/index";
import { cn } from "@lib/helpers";
import { Sitting } from "@lib/types";
import { ReactNode, useId, useRef, useState } from "react";

/**
 * Catalogue Folder
 * @overview Status: In-development
 */

interface CatalogueFolderProps {
  children: ReactNode;
  dateRange: string;
  meeting: string;
  sitting_list: Sitting[];
}

export default function CatalogueFolder({
  children,
  dateRange,
  meeting,
  sitting_list,
}: CatalogueFolderProps) {
  const { t, i18n } = useTranslation("enum");
  const arrowRef = useRef<SVGSVGElement | null>(null);
  const [open, setOpen] = useState<boolean>(false);

  const { refs, floatingStyles, context } = useFloating({
    open: open,
    onOpenChange: setOpen,
    placement: "bottom-start",
    middleware: [
      offset(24),
      flip(),
      arrow({
        element: arrowRef,
      }),
      // flip({ fallbackAxisSideDirection: "end" }),
      // shift({
      //   limiter: limitShift({
      //     // Start limiting 5px earlier
      //     offset: 5,
      //   }),
      // }),
    ],
    whileElementsMounted: autoUpdate,
  });

  const click = useClick(context);
  const dismiss = useDismiss(context);
  const role = useRole(context);

  const { getReferenceProps, getFloatingProps } = useInteractions([
    click,
    dismiss,
    role,
  ]);

  const meetingId = useId();

  return (
    <div
      className="flex flex-col gap-y-3 items-center relative pt-2"
      ref={refs.setReference}
      {...getReferenceProps()}
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
      {children}
      {open && (
        <FloatingFocusManager context={context} modal={false}>
          <div
            className={cn(
              // !open && "invisible",
              // "absolute -bottom-6 left-1/2 z-10 -translate-x-1/2 transform",
              "flex-col items-center flex",
              "z-20"
            )}
            ref={refs.setFloating}
            style={floatingStyles}
            aria-labelledby={meetingId}
            {...getFloatingProps()}
          >
            <div
              className={cn(
                // "absolute top-2.5",
                "w-max rounded-2xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900 p-6 flex flex-col gap-y-5"
              )}
            >
              <div className="gap-x-3 flex items-center justify-between">
                <div className="gap-x-3 flex items-center">
                  <span className="font-medium text-zinc-900 dark:text-white">
                    {t("meeting", {
                      ns: "enum",
                      n: meeting,
                    })}
                  </span>
                  <span className="text-zinc-500">{dateRange}</span>
                </div>
                <XMarkIcon
                  className="text-zinc-500 h-5 w-5 hover:text-zinc-900 dark:hover:text-white"
                  onClick={() => setOpen(false)}
                />
              </div>
              <div className="hidden lg:grid lg:grid-cols-2 xl:grid-cols-3 gap-4">
                {sitting_list.map((sitting) => (
                  <div className="flex items-center gap-x-4.5 p-3 shadow-button hover:shadow-floating rounded-lg bg-white dark:bg-zinc-900">
                    <CalendarCard date={sitting.date} size="sm" />
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
                          <span>{t("cite")}</span>•<span>{t("download")}</span>•
                          <span>{t("share")}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="lg:hidden flex flex-col"></div>
            </div>
            <FloatingArrow
              ref={arrowRef}
              context={context}
              width={32}
              height={18}
              d="M0,0 H32 L16,18 Z"
              className="fill-slate-50 dark:fill-zinc-900 rotate-180
              [&>path:first-of-type]:stroke-slate-200 dark:[&>path:first-of-type]:stroke-zinc-800 
              [&>path:last-of-type]:stroke-slate-200 dark:[&>path:last-of-type]:stroke-zinc-800"
            />
            {/* <div className="h-5 w-5 rotate-45 bg-slate-50 dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 border-l border-t"></div> */}
          </div>
        </FloatingFocusManager>
      )}
    </div>
  );
}
