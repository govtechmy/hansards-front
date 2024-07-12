import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@components/Dialog";
import {
  Sheet,
  SheetContent,
  SheetHeading,
  SheetTrigger,
} from "@components/Sheet";
import { useMediaQuery } from "@hooks/useMediaQuery";
import { Trans, useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { ReactNode, useState } from "react";

/**
 * Cite Dialog/Drawer
 * @overview Status: In-development
 */

interface CiteDialogDrawerProps {
  date: string;
  dewan: string;
  hansard_id: string;
  // trigger: ReactNode;
  trigger: (onClick: () => void) => ReactNode;
}


export default function CiteDialogDrawer({
  date,
  dewan,
  hansard_id,
  trigger,
}: CiteDialogDrawerProps) {
  const { t } = useTranslation(["hansard", "catalogue", "common"]);
  const [open, setOpen] = useState<boolean>(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const mys = "Malaysia";
  const parl_debates = "Parliamentary Debates";
  const full_dewan = dewan === "DR" ? t("common:dewan_rakyat") : dewan === "DN" ? t("common:dewan_negara") : t("common:kamar_khas");
  const _date = new Date(date);
  const _options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  }
  const formattedDate = _date.toLocaleDateString("en-GB", _options);
  const today = new Date().toLocaleDateString("en-GB", _options);
  const title = `${date} ${t("header", { context: dewan.toLowerCase() })}`;
  const { locale } = useRouter();
  const URL = `${process.env.NEXT_PUBLIC_APP_URL}${locale === "en-GB" ? "/" + locale : ""}${hansard_id}`;

  const bil = "{ volume }";
  const page = "{ pages }";

  const CITE_OPTIONS = [
    {
      label: "JournalMP",
      value: `${dewan} Deb ${formattedDate}, Bil. ${bil}, ${page}. ${URL}.`,
    },
    {
      label: "MLA",
      value: `${mys}, Parlimen, ${full_dewan}. \"${title}\" <i>"Parliament Hansards"</i> (${formattedDate}). ${URL.slice(8)}. Accessed ${today}.`,
    },
    {
      label: "APA",
      value: `${mys}, ${parl_debates}, ${full_dewan} ${formattedDate}. ${URL}`,
    },
    {
      label: "Chicago",
      value: `${mys}, ${parl_debates}, ${full_dewan} ${formattedDate}. ${URL}`,
    },
    {
      label: "Harvard",
      value: `${mys}n ${full_dewan} (${_date.getFullYear()}) <i>Debates</i>, ${bil}:${page}.`,
    },
    {
      label: "Vancouver",
      value: `${mys}, ${parl_debates}, ${full_dewan} ${formattedDate}. ${URL}`,
    },
  ];

  const CiteButton = () => (
    <div className="max-md:p-4 space-y-5 max-h-[80dvh] overflow-auto">
      <table className="table-auto text-sm">
        <tbody>
          {CITE_OPTIONS.map(({ label, value }) => (
            <tr>
              <th className="px-2 py-2.5 select-none">{label}</th>
              <td className="px-2 py-2.5 select-all"><Trans>{value}</Trans></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  if (isDesktop)
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          {trigger(() => setOpen(true))}
        </DialogTrigger>
        <DialogContent className="max-w-2xl">
          <DialogHeader className="flex w-full justify-between">
            <span className="text-center font-medium text-foreground w-full">
              {t("cite_hansard")}
            </span>
          </DialogHeader>
          <CiteButton />
        </DialogContent>
      </Dialog>
    );

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {trigger(() => setOpen(true))}
      </SheetTrigger>
      <SheetContent side="bottom" className="p-0 rounded-t-xl">
        <SheetHeading className="p-4 flex justify-between border-b border-slate-200 dark:border-zinc-700">
          <span className="font-medium text-foreground">
            {t("cite_hansard")}
          </span>
        </SheetHeading>
        <CiteButton />
      </SheetContent>
    </Sheet>
  );
}
