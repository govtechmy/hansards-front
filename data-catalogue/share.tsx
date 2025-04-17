import { EnvelopeIcon } from "@heroicons/react/24/solid";
import { useAnalytics } from "@hooks/useAnalytics";
import { useMediaQuery } from "@hooks/useMediaQuery";
import { useTranslation } from "@hooks/useTranslation";
import { copyClipboard } from "@lib/helpers";
import { memo, ReactNode, useState } from "react";
import {
  CopyIcon,
  FacebookIcon,
  OptionsVerticalIcon,
  WhatsappIcon,
  XIcon,
} from "@govtechmy/myds-react/icon";
import { Button } from "@govtechmy/myds-react/button";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@govtechmy/myds-react/dialog";
import { Input } from "@govtechmy/myds-react/input";
import { Link } from "@govtechmy/myds-react/link";

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

export const ShareDialogDrawer = ({
  date,
  hansard_id,
  index,
  trigger,
}: ShareDialogDrawerProps) => {
  const { t, i18n } = useTranslation(["hansard", "catalogue", "demografi"]);
  const [open, setOpen] = useState<boolean>(false);
  const isDesktop = useMediaQuery("(min-width: 640px)");

  const [copyText, setCopyText] = useState<string>("copy");
  const { share } = useAnalytics(hansard_id);
  const title = "Hansard Parlimen";
  const URL = `${process.env.NEXT_PUBLIC_APP_URL}${hansard_id}${
    index ? `#${index}` : ""
  }`;

  const SHARE_OPTIONS = [
    {
      name: "WhatsApp",
      icon: WhatsappIcon,
      link: `https://api.whatsapp.com/send/?text=${URL}`,
    },
    {
      name: "Facebook",
      icon: FacebookIcon,
      link: `https://www.facebook.com/sharer/sharer.php?u=${URL}&t=${title}`,
    },
    {
      name: "X",
      icon: XIcon,
      link: `https://www.x.com/intent/tweet?text=${title}&url=${URL}&hashtags=hansard`,
    },
    {
      name: t("email"),
      icon: EnvelopeIcon,
      link: `mailto:?subject=${title}&body=${URL}`,
    },
  ];

  const handleClick = () => setOpen(true);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild onClick={e => e.preventDefault()}>
        {trigger ? (
          trigger(handleClick)
        ) : (
          <Button variant="unset" className="bt" onClick={handleClick}>
            <div className="i" />
            {t("share")}
          </Button>
        )}
      </DialogTrigger>
      <DialogBody className="sm:max-w-xl">
        <DialogHeader border>
          <DialogTitle>{t("share_hansard")}</DialogTitle>
        </DialogHeader>
        <DialogContent className="pb-6">
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between gap-3 text-body-xs text-txt-black-700 sm:text-body-sm">
              {SHARE_OPTIONS.map(s => {
                return (
                  <Link
                    target="_blank"
                    href={s.link}
                    onClick={share}
                    underline="none"
                    className="flex w-14 flex-col items-center gap-1 sm:w-20 sm:gap-2 sm:p-2"
                  >
                    <s.icon className="size-10 p-1 sm:size-12" />
                    {s.name}
                  </Link>
                );
              })}
              <Button
                variant="unset"
                className="flex w-14 flex-col items-center gap-1 p-0 font-normal max-sm:text-body-xs sm:w-20 sm:gap-2 sm:p-2"
                onClick={() => {
                  if (navigator.share) {
                    share();
                    navigator
                      .share({
                        title: title,
                        text: title,
                        url: URL,
                      })
                      .catch(error => console.error("Error sharing", error));
                  }
                }}
              >
                <OptionsVerticalIcon className="size-10 p-2 sm:size-12" />
                {t("demografi:other")}
              </Button>
            </div>
            <div className="flex flex-col items-end gap-3">
              <Input value={URL} className="w-full" />

              <Button
                variant={copyText === "copy" ? "primary-fill" : "primary-ghost"}
                className="whitespace-nowrap"
                onClick={() => {
                  share();
                  copyClipboard(URL);
                  setCopyText("copied");
                  setTimeout(() => {
                    setCopyText("copy");
                  }, 1000);
                }}
              >
                {t("common:" + copyText)}
              </Button>
            </div>
          </div>
        </DialogContent>
      </DialogBody>
    </Dialog>
  );
};

export default memo(ShareDialogDrawer);
