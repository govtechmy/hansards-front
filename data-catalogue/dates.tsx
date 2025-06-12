import { DateCard } from "@components/index";
import { Button, ButtonIcon } from "@govtechmy/myds-react/button";
import {
  ChevronDownIcon,
  DocumentIcon,
  EmailIcon,
  ExcelFileIcon,
  FacebookIcon,
  LinkIcon,
  PdfFileIcon,
  XIcon,
  Checkmark14PointStarIcon,
  CheckCircleFillIcon,
  DocumentFilledIcon,
} from "@govtechmy/myds-react/icon";
import {
  Dropdown,
  DropdownContent,
  DropdownItem,
  DropdownTrigger,
} from "@govtechmy/myds-react/dropdown";
import { Link } from "@govtechmy/myds-react/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@govtechmy/myds-react/table";
import { DataTable } from "@govtechmy/myds-react/data-table";
import { useAnalytics } from "@hooks/useAnalytics";
import { useMediaQuery } from "@hooks/useMediaQuery";
import { useTranslation } from "@hooks/useTranslation";
import { copyClipboard } from "@lib/helpers";
import { routes } from "@lib/routes";
import { Sitting } from "@lib/types";
import NextLink from "next/link";
import { useState } from "react";
import CiteButton from "./cite";
import ShareButton from "./share";
import {} from "@govtechmy/myds-react/icon";

/**
 * Mesyuarat Dates
 * @overview Status: In-development
 */

interface MesyuaratDatesProps {
  onClick?: () => void;
  sitting_list: Sitting[];
}

export const MesyuaratDates = ({
  onClick,
  sitting_list,
}: MesyuaratDatesProps) => {
  const { t, i18n } = useTranslation(["catalogue", "enum", "hansard"]);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const minWidth1280px = useMediaQuery("(min-width: 1280px)");
  const [copyText, setCopyText] = useState<string>("copy");
  const title = "Hansard Parlimen";

  // const filetypes = ["csv", "pdf"] as const;

  return (
    // <Table>
    //   <TableHeader>
    //     <TableRow>
    //       <TableHead className="w-1/4">Date</TableHead>
    //       <TableHead className="w-1/12">Day</TableHead>
    //       <TableHead className="w-1/12">Share</TableHead>
    //       <TableHead className="w-1/12">Download</TableHead>
    //     </TableRow>
    //   </TableHeader>
    //   <TableBody>
    <div className="mx-auto grid w-full grid-cols-1 gap-4 max-md:p-4 md:grid-cols-2 lg:grid-cols-3">
      {sitting_list.map((sitting, i) => {
        const { filename, date, is_final } = sitting;
        const IS_KK = filename.startsWith("kk");
        const IS_DR = filename.startsWith("dr");
        const hansard_id = `${
          IS_KK
            ? routes.HANSARD_KK
            : IS_DR
              ? routes.HANSARD_DR
              : routes.HANSARD_DN
        }/${date}`;
        const { download, share } = useAnalytics(hansard_id);
        const URL = `${process.env.NEXT_PUBLIC_APP_URL}${hansard_id}`;

        return (
          // table view
          // <TableRow>
          //   <TableCell>
          //     <NextLink
          //       href={hansard_id}
          //       prefetch={false}
          //       onClick={onClick}
          //       className="link flex items-center gap-1.5 font-medium text-foreground"
          //     >
          //       <DocumentIcon className="size-5" />
          //       {new Date(date).toLocaleDateString(i18n.language, {
          //         year: "numeric",
          //         month: "short",
          //         day: "numeric",
          //       })}
          //     </NextLink>
          //   </TableCell>
          //   <TableCell>
          //     {new Date(date).toLocaleDateString(i18n.language, {
          //       weekday: "short",
          //     })}
          //   </TableCell>
          //   <TableCell>
          //     <div className="flex w-fit items-center gap-1">
          //       {/* options={[
          //             {
          //               label: "Twitter",
          //               value: `https://www.twitter.com/intent/tweet?text=${title}&url=${URL}&hashtags=hansard`,
          //             },
          //             {
          //               label: "Facebook",
          //               value: `https://www.facebook.com/sharer/sharer.php?u=${URL}&t=${title}`,
          //             },
          //             {
          //               label: t("email", { ns: "hansard" }),
          //               value: `mailto:?subject=${title}&body=${URL}`,
          //             },
          //             {
          //               label: t(copyText, { ns: "common" }),
          //               value: "copy",
          //             },
          //           ]} */}
          //       <Button variant="default-ghost" iconOnly asChild>
          //         <Link
          //           target="_blank"
          //           href={`https://www.facebook.com/sharer/sharer.php?u=${URL}&t=${title}`}
          //         >
          //           <ButtonIcon>
          //             <FacebookIcon className="size-5" />
          //           </ButtonIcon>
          //         </Link>
          //       </Button>
          //       <Button variant="default-ghost" iconOnly asChild>
          //         <Link
          //           target="_blank"
          //           href={`https://www.twitter.com/intent/tweet?text=${title}&url=${URL}`}
          //         >
          //           <ButtonIcon>
          //             <XIcon className="size-5" />
          //           </ButtonIcon>
          //         </Link>
          //       </Button>
          //       <Button variant="default-ghost" asChild>
          //         <Link
          //           target="_blank"
          //           underline="none"
          //           href={`mailto:?subject=${title}&body=${URL}`}
          //         >
          //           <ButtonIcon>
          //             <EmailIcon className="size-5" />
          //           </ButtonIcon>
          //           Email
          //         </Link>
          //       </Button>
          //       <Button
          //         variant="default-ghost"
          //         onClick={() => {
          //           copyClipboard(URL);
          //           setCopyText("copied");
          //           setTimeout(() => {
          //             setCopyText("copy");
          //           }, 1000);
          //         }}
          //       >
          //         <ButtonIcon>
          //           <LinkIcon className="size-5" />
          //         </ButtonIcon>
          //         Copy link
          //       </Button>
          //     </div>
          //   </TableCell>
          //   <TableCell align="center">
          //     <div className="flex items-center gap-1">
          //       {filetypes.map(filetype => (
          //         <Button
          //           variant="default-ghost"
          //           onClick={() => {
          //             window.open(
          //               `${process.env.NEXT_PUBLIC_DOWNLOAD_URL}${
          //                 filename.startsWith("dr")
          //                   ? "dewanrakyat"
          //                   : "dewannegara"
          //               }/${filename}.${filetype}`,
          //               "_blank"
          //             );
          //             download(filetype);
          //           }}
          //         >
          //           {filetype === "csv" ? (
          //             <ExcelFileIcon className="size-5" />
          //           ) : (
          //             <PdfFileIcon className="size-5" />
          //           )}
          //           {filetype.toUpperCase()}
          //         </Button>
          //       ))}
          //     </div>
          //   </TableCell>
          // </TableRow>
          <div
            key={i}
            className="flex items-center gap-x-4.5 rounded-lg border bg-background p-3 shadow-button dark:border-zinc-800"
          >
            <DateCard date={date} size="sm" />
            <div className="flex flex-col gap-y-1.5">
              {is_final ? (
                <span className="me-2 inline-flex items-center rounded-sm border border-green-500 bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-700 dark:bg-opacity-20 dark:text-green-300">
                  <CheckCircleFillIcon className="size-4" />
                  &nbsp; {t("final")}
                </span>
              ) : (
                <span className="me-2 inline-flex w-fit items-center rounded-sm border border-orange-500 bg-orange-100 bg-opacity-40 px-2.5 py-0.5 text-xs font-medium text-orange-900 dark:bg-orange-500 dark:bg-opacity-10 dark:text-orange-200">
                  <DocumentFilledIcon className="size-4" />
                  &nbsp; {t("draft")}
                </span>
              )}
              <NextLink
                href={hansard_id}
                prefetch={false}
                onClick={onClick}
                className="link flex items-center gap-1 font-medium text-foreground"
              >
                {new Date(date).toLocaleDateString(i18n.language, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
                {`, ${new Date(date).toLocaleDateString(i18n.language, {
                  weekday: "long",
                })}`}
              </NextLink>
              <div>
                <div className="flex flex-wrap items-center gap-1.5 whitespace-nowrap text-sm text-blue-600 dark:text-primary-dark">
                  <CiteButton
                    date={date}
                    hansard_id={hansard_id}
                    dewan={IS_KK ? "KK" : IS_DR ? "DR" : "DN"}
                    trigger={onClick => (
                      <Link
                        primary
                        underline="hover"
                        onClick={onClick}
                        className="cursor-pointer"
                      >
                        {t("cite")}
                      </Link>
                    )}
                  />
                  •
                  <Dropdown>
                    <DropdownTrigger asChild>
                      <Link
                        primary
                        underline="hover"
                        className="flex cursor-pointer items-center"
                      >
                        {t("download", { ns: "catalogue" })}
                        <ChevronDownIcon />
                      </Link>
                    </DropdownTrigger>
                    <DropdownContent align="start">
                      {["pdf", "csv"].map(filetype => (
                        <DropdownItem
                          key={filetype}
                          onSelect={() => {
                            window.open(
                              `${process.env.NEXT_PUBLIC_DOWNLOAD_URL}${
                                filename.startsWith("dr")
                                  ? "dewanrakyat"
                                  : filename.startsWith("kk")
                                    ? "kamarkhas"
                                    : "dewannegara"
                              }/${filename}.${filetype}`,
                              "_blank"
                            );
                            download(filetype as "pdf" | "csv");
                          }}
                        >
                          {filetype === "pdf" ? (
                            <PdfFileIcon className="size-4" />
                          ) : (
                            <ExcelFileIcon className="size-4" />
                          )}
                          <p className="sr-only">
                            {t("download", { context: filetype })}
                          </p>
                          {filetype.toUpperCase()}
                        </DropdownItem>
                      ))}
                    </DropdownContent>
                  </Dropdown>
                  •
                  <ShareButton
                    date={date}
                    hansard_id={hansard_id}
                    trigger={onClick => (
                      <Link
                        primary
                        underline="hover"
                        onClick={onClick}
                        className="cursor-pointer"
                      >
                        {t("share")}
                      </Link>
                    )}
                  />
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
    //   </TableBody>
    // </Table>
  );
};
