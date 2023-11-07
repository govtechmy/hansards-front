import At from "@components/At";
import Button from "@components/Button";
import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogDescription,
  DialogHeading,
  DialogTrigger,
} from "@components/Dialog";
import DateCard from "@components/Card/date-card";
import { DocumentDuplicateIcon, EnvelopeIcon } from "@heroicons/react/24/solid";
import { useAnalytics } from "@hooks/useAnalytics";
import { useTranslation } from "@hooks/useTranslation";
import { FBShare, XShare } from "@icons/index";
import { copyClipboard } from "@lib/helpers";
import { ReactNode, useState } from "react";

/**
 * Share Button
 * @overview Status: In-development
 */

interface ShareButtonProps {
  date: string;
  hansard_id: string;
  index?: number;
  trigger?: (onClick: () => void) => ReactNode;
}

export default function ShareButton({
  date,
  hansard_id,
  index,
  trigger,
}: ShareButtonProps) {
  const { t, i18n } = useTranslation(["hansard", "catalogue"]);
  const [open, setOpen] = useState<boolean>(false);
  const [copyText, setCopyText] = useState<string>("copy");
  const { share } = useAnalytics(hansard_id);
  const title = `Hansard Parlimen`;
  const URL = `https://hansard.parlimen.gov.my/hansard/${hansard_id}${
    index ? `#${index}` : ""
  }`;

  const onClick = () => {
    if (navigator.share) {
      share();
      navigator
        .share({
          title: title,
          text: title,
          url: URL,
        })
        .catch((error) => console.error("Error sharing", error));
    } else setOpen(!open);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        {trigger ? (
          trigger(onClick)
        ) : (
          <div className="bt" onClick={onClick}>
            <div className={"shr"} />
            {t("share")}
          </div>
        )}
      </DialogTrigger>
      <DialogContent className="lg:w-fit border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900 p-6 flex flex-col gap-y-5">
        <DialogHeading className="flex justify-between">
          <span className="text-center font-medium text-zinc-900 dark:text-white w-full">
            {t("share_hansard")}
          </span>
          <DialogClose></DialogClose>
        </DialogHeading>
        <DialogDescription className="flex flex-col gap-6 max-h-[80vh]">
          <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl shadow-button p-3 flex gap-4.5 w-fit mx-auto items-center">
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
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              {
                name: "Twitter",
                icon: <XShare className="h-4 w-4" />,
                link: `https://www.twitter.com/intent/tweet?text=${title}&url=${URL}&hashtags=hansard`,
              },
              {
                name: "Facebook",
                icon: <FBShare className="h-5 w-5" />,
                link: `https://www.facebook.com/sharer/sharer.php?u=${URL}&t=${title}`,
              },
              {
                name: "E-mail",
                icon: <EnvelopeIcon className="h-5 w-5" />,
                link: `mailto:?subject=${title}&body=${URL}`,
              },
              {
                name: t(copyText, { ns: "common" }),
                icon: <DocumentDuplicateIcon className="h-5 w-5" />,
                link: "copy",
              },
            ].map(({ name, icon, link }) => {
              return (
                <Button
                  key={name}
                  variant="default"
                  onClick={() => {
                    share();
                    if (link === "copy") {
                      copyClipboard(URL);
                      setCopyText("copied");
                      setTimeout(() => {
                        setCopyText("copy");
                      }, 1000);
                    }
                  }}
                >
                  {icon}
                  {link === "copy" ? (
                    <p>{name}</p>
                  ) : (
                    <At href={link} external>
                      {name}
                    </At>
                  )}
                </Button>
              );
            })}
          </div>
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
}
