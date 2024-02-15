import At from "@components/At";
import Button from "@components/Button";
import {
  Dialog,
  DialogContent,
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
import DateCard from "@components/Card/date-card";
import {
  DocumentDuplicateIcon,
  EnvelopeIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import { useAnalytics } from "@hooks/useAnalytics";
import { useMediaQuery } from "@hooks/useMediaQuery";
import { useTranslation } from "@hooks/useTranslation";
import { FBShare, XShare } from "@icons/index";
import { copyClipboard } from "@lib/helpers";
import { ReactNode, useState } from "react";

/**
 * Share Dialog/Drawer
 * @overview Status: In-development
 */

interface ShareDialogDrawerProps {
  date: string;
  hansard_id: string;
  index?: string;
  trigger?: (onClick: () => void) => ReactNode;
}

export default function ShareDialogDrawer({
  date,
  hansard_id,
  index,
  trigger,
}: ShareDialogDrawerProps) {
  const { t, i18n } = useTranslation(["hansard", "catalogue"]);
  const [open, setOpen] = useState<boolean>(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const [copyText, setCopyText] = useState<string>("copy_link");
  const { share } = useAnalytics(hansard_id);
  const title = `Hansard Parlimen`;
  const URL = `${process.env.NEXT_PUBLIC_APP_URL}${hansard_id}${
    index ? `#${index}` : ""
  }`;

  const SHARE_OPTIONS = [
    {
      name: "Facebook",
      icon: <FBShare className="h-8 w-8" />,
      link: `https://www.facebook.com/sharer/sharer.php?u=${URL}&t=${title}`,
    },
    {
      name: "Twitter",
      icon: <XShare className="h-8 w-8" />,
      link: `https://www.twitter.com/intent/tweet?text=${title}&url=${URL}&hashtags=hansard`,
    },
    {
      name: t("email"),
      icon: <EnvelopeIcon className="h-8 w-8" />,
      link: `mailto:?subject=${title}&body=${URL}`,
    },
    {
      name: t(copyText),
      icon: <DocumentDuplicateIcon className="h-8 w-8" />,
      link: "copy",
    },
  ];

  const handleClick = () => {
    if (navigator.share) {
      setOpen(false);
      share();
      navigator
        .share({
          title: title,
          text: title,
          url: URL,
        })
        .catch((error) => console.error("Error sharing", error));
    } else setOpen(true);
  };

  const ShareButton = () => (
    <div className="max-md:p-4 space-y-5">
      <div className="bg-background border border-border rounded-2xl shadow-button p-3 flex gap-4.5 w-fit mx-auto items-center">
        <DateCard date={date} size="sm" />
        <p>
          {new Date(date).toLocaleDateString(i18n.language, {
            weekday: "long",
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </p>
      </div>
      <div className="w-full grid grid-cols-2 sm:grid-cols-4 gap-3">
        {SHARE_OPTIONS.map(({ name, icon, link }) => {
          return (
            <Button
              key={name}
              variant="outline"
              className="whitespace-nowrap flex flex-col"
              onClick={() => {
                share();
                if (link === "copy") {
                  copyClipboard(URL);
                  setCopyText("copied");
                  setTimeout(() => {
                    setCopyText("copy_link");
                  }, 1000);
                }
              }}
            >
              {icon}
              {link === "copy" ? (
                name
              ) : (
                <At href={link} external>
                  {name}
                </At>
              )}
            </Button>
          );
        })}
      </div>
    </div>
  );

  if (isDesktop)
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild onClick={(e) => e.preventDefault()}>
          {trigger ? (
            trigger(handleClick)
          ) : (
            <Button variant="reset" className="bt" onClick={handleClick}>
              <div className="i" />
              {t("share")}
            </Button>
          )}
        </DialogTrigger>
        <DialogContent className="max-w-[536px]">
          <DialogHeader className="flex w-full justify-between">
            <span className="text-center font-medium text-foreground w-full">
              {t("share_hansard")}
            </span>
          </DialogHeader>
          <ShareButton />
        </DialogContent>
      </Dialog>
    );

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild onClick={(e) => e.preventDefault()}>
        {trigger ? (
          trigger(handleClick)
        ) : (
          <Button variant="reset" className="bt" onClick={handleClick}>
            <div className="i" />
            {t("share")}
          </Button>
        )}
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="p-4 flex justify-between border-b border-slate-200 dark:border-zinc-700">
          <span className="font-medium text-foreground">
            {t("share_hansard")}
          </span>
          <DrawerClose>
            <XMarkIcon className="text-zinc-500 h-6 w-6" />
          </DrawerClose>
        </DrawerHeader>
        <ShareButton />
      </DrawerContent>
    </Drawer>
  );
}
