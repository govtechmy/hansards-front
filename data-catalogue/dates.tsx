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
import { DOWNLOAD_URL } from "@lib/config";

/**
 * Mesyuarat Dates
 * @overview Status: In-development
 */

interface MesyuaratDatesProps {
  onClick?: () => void;
  sitting_list: Sitting[];
}

const isPre2008 = (date: string) => new Date(date).getFullYear() < 2008;
const isNotProduction = process.env.NEXT_PUBLIC_APP_ENV !== "production";
console.log(
  "isNotProduction",
  isNotProduction,
  process.env.NEXT_PUBLIC_APP_ENV
);

export const MesyuaratDates = ({
  onClick,
  sitting_list,
}: MesyuaratDatesProps) => {
  const { t, i18n } = useTranslation(["catalogue", "enum", "hansard"]);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const minWidth1280px = useMediaQuery("(min-width: 1280px)");
  const [copyText, setCopyText] = useState<string>("copy");
  const title = "Hansard Parlimen";

  return (
    <div className="mx-auto grid w-full grid-cols-1 gap-4 max-md:p-4 md:grid-cols-2 lg:grid-cols-3">
      {sitting_list.map((sitting, i) => {
        const { filename, date, is_final } = sitting;
        // If the environment is staging, `is_old` is always false. Otherwise, check if the date is before 2008.
        const is_old = isNotProduction ? false : isPre2008(date);
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
          <div
            key={i}
            className="flex items-center gap-x-4.5 rounded-lg border bg-background p-3 shadow-button dark:border-zinc-800"
          >
            <DateCard date={date} size="sm" />
            <div className="flex flex-col gap-y-1.5">
              {!IS_KK &&
                (is_final ? (
                  <span className="me-2 inline-flex w-fit items-center rounded-sm border border-green-500 bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-700 dark:bg-opacity-20 dark:text-green-300">
                    <CheckCircleFillIcon className="size-4" />
                    &nbsp; {t("final")}
                  </span>
                ) : (
                  <span className="me-2 inline-flex w-fit items-center rounded-sm border border-orange-500 bg-orange-100 bg-opacity-40 px-2.5 py-0.5 text-xs font-medium text-orange-900 dark:bg-orange-500 dark:bg-opacity-10 dark:text-orange-200">
                    <DocumentFilledIcon className="size-4" />
                    &nbsp; {t("draft")}
                  </span>
                ))}
              {is_old ? (
                <div className="flex items-center gap-1 font-medium text-foreground">
                  {new Date(date).toLocaleDateString(i18n.language, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                  {`, ${new Date(date).toLocaleDateString(i18n.language, {
                    weekday: "long",
                  })}`}
                </div>
              ) : (
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
              )}
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
                          disabled={is_old && filetype === "csv"}
                          onSelect={() => {
                            if (is_old && filetype === "csv") return;
                            window.open(
                              `${DOWNLOAD_URL}${
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
