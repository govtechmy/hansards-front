import { Button } from "@govtechmy/myds-react/button";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@govtechmy/myds-react/dialog";
import {
  SummaryList,
  SummaryListAction,
  SummaryListBody,
  SummaryListDetail,
  SummaryListRow,
  SummaryListTerm,
} from "@govtechmy/myds-react/summary-list";
import { useMediaQuery } from "@hooks/useMediaQuery";
import { Trans, useTranslation } from "next-i18next";
import { ReactNode, useState } from "react";
import { CopyIcon } from "@govtechmy/myds-react/icon";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTrigger,
} from "@components/Drawer";

/**
 * Cite Dialog/Drawer
 * @overview Status: In-development
 */

interface CiteDialogDrawerProps {
  date: string;
  dewan: string;
  hansard_id: string;
  trigger: (onClick: () => void) => ReactNode;
}

export default function CiteDialogDrawer({
  date: _date,
  dewan,
  hansard_id,
  trigger,
}: CiteDialogDrawerProps) {
  const { t } = useTranslation(["hansard", "catalogue", "common"]);
  const [open, setOpen] = useState<boolean>(false);

  const isDesktop = useMediaQuery("(min-width: 768px)");

  const author = t("common:footer.parlimen");
  const website_name = "Hansard Parlimen";

  const date = new Date(_date);
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  const published_date_full = date.toLocaleDateString("en-GB", options);
  const published_day = date.toLocaleDateString("en-GB", {
    day: "numeric",
  });
  const published_month = date.toLocaleDateString("en-GB", {
    month: "long",
  });
  const published_yr = date.getFullYear();
  const today = new Date();
  const today_full = today.toLocaleDateString("en-GB", options);
  const this_month = today.toLocaleDateString("en-GB", {
    month: "short",
  });
  const title = `${_date} ${t("header", { context: dewan.toLowerCase() })}`;
  const URL = `${process.env.NEXT_PUBLIC_APP_URL}${hansard_id}`;

  const CITE_OPTIONS = [
    {
      label: "JournalMP",
      value: `${author}, '${title}' <${URL}> accessed ${today_full}`,
    },
    {
      label: "Harvard",
      value: `${author}, ${published_yr}. <i>${title}</i>. ${website_name}. Available at: ${URL} (Accessed: ${today_full})`,
    },
    {
      label: "Chicago",
      value: `${author}. "${title}." ${website_name}. ${published_date_full}. ${URL}.`,
    },
    {
      label: "MLA",
      value: `${author}. "${title}" <i>${website_name}</i>, ${published_date_full}, ${URL}.`,
    },
    {
      label: "APA",
      value: `${author}. (${published_yr}, ${published_month} ${published_day}). <i>${title}.</i> ${website_name}. ${URL}`,
    },
    {
      label: "Vancouver",
      value: `${author}. ${title} [Internet]. ${published_yr} [cited ${new Date().getFullYear()} ${this_month} ${today.getDate()}]. Available from: ${URL}`,
    },
  ];

  const CiteButton = () => (
    <SummaryList className="max-h-[80dvh] overflow-auto max-sm:px-4.5">
      <SummaryListBody>
        {CITE_OPTIONS.map(({ label, value }) => {
          const plain = "text/plain";
          const html = "text/html";
          const text = document.getElementById(label)?.innerText || "";
          const blobHtml = new Blob([value], { type: html });
          const blobText = new Blob([text], { type: plain });
          const data = [
            new ClipboardItem({
              [plain]: blobText,
              [html]: blobHtml,
            }),
          ];

          return (
            <SummaryListRow className="max-sm:block">
              <SummaryListTerm className="min-w-fit max-sm:pt-4.5">
                {label}
              </SummaryListTerm>
              <SummaryListDetail
                id={label}
                className="w-fit text-txt-black-700 max-sm:order-last max-sm:p-0 sm:w-max"
              >
                {label === "JournalMP" ? value : <Trans>{value}</Trans>}
              </SummaryListDetail>
              <SummaryListAction className="max-sm:pb-3 max-sm:pr-0">
                <Button
                  variant="primary-ghost"
                  onClick={async () => await navigator.clipboard.write(data)}
                >
                  <CopyIcon className="size-5" />
                  {t("common:copy")}
                </Button>
              </SummaryListAction>
            </SummaryListRow>
          );
        })}
      </SummaryListBody>
    </SummaryList>
  );

  if (isDesktop)
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{trigger(() => setOpen(true))}</DialogTrigger>
        <DialogBody className="sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle>{t("cite_hansard")}</DialogTitle>
          </DialogHeader>
          <DialogContent className="pb-6 pt-0">
            <CiteButton />
          </DialogContent>
        </DialogBody>
      </Dialog>
    );

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{trigger(() => setOpen(true))}</DrawerTrigger>
      <DrawerContent className="rounded-t-xl p-0">
        <DrawerHeader className="flex justify-between border-b border-slate-200 p-4 dark:border-zinc-700">
          <span className="font-medium text-foreground">
            {t("cite_hansard")}
          </span>
        </DrawerHeader>
        <CiteButton />
      </DrawerContent>
    </Drawer>
  );
}
