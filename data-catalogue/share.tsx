import At from "@components/At";
import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogDescription,
  DialogHeading,
  DialogTrigger,
} from "@components/Dialog";
import { DocumentDuplicateIcon, EnvelopeIcon } from "@heroicons/react/24/solid";
import { useTranslation } from "@hooks/useTranslation";
import { FBShare, XShare } from "@icons/index";
import { AnalyticsContext } from "@lib/contexts/analytics";
import { copyClipboard } from "@lib/helpers";
import { ReactNode, useContext, useState } from "react";

/**
 * Share Button
 * @overview Status: In-development
 */

interface ShareButtonProps {
  id: string;
  trigger?: (onClick: () => void) => ReactNode;
}

export default function ShareButton({ id, trigger }: ShareButtonProps) {
  const { t, i18n } = useTranslation(["hansard", "catalogue"]);
  const [open, setOpen] = useState<boolean>(false);
  const [copyText, setCopyText] = useState<string>("copy");

  const title = `Hansard Parlimen`;
  const URL = `https://hansard.parlimen.gov.my/hansard/${id}`;

  const onClick = () => {
    if (navigator.share) {
      navigator
        .share({
          title: "Hansard Parlimen",
          text: "Hansard Parlimen",
          url: `https://hansard.parlimen.gov.my/hansard/${id}`,
        })
        .then(() => console.log("Successful share"))
        .catch((error) => console.log("Error sharing", error));
    } else setOpen(!open);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        {trigger ? (
          trigger(onClick)
        ) : (
          <button
            className="bt"
            onClick={onClick}
          >
            <div className={"shr"} />
            {t("share")}
          </button>
        )}
      </DialogTrigger>
      <DialogContent className="w-full border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900 p-6 flex flex-col gap-y-5">
        <DialogHeading>
          <span className="font-medium text-zinc-900 dark:text-white">
            {t("share")}
          </span>
          <DialogClose></DialogClose>
        </DialogHeading>
        <DialogDescription>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-h-[80vh]">
            {[
              {
                name: "Twitter",
                icon: <XShare className="h-8 w-8" />,
                link: `https://www.twitter.com/intent/tweet?text=${title}&url=${URL}&hashtags=hansard`,
              },
              {
                name: "Facebook",
                icon: <FBShare className="h-8 w-8" />,
                link: `https://www.facebook.com/sharer/sharer.php?u=${URL}&t=${title}`,
              },
              {
                name: "E-mail",
                icon: <EnvelopeIcon className="h-8 w-8" />,
                link: `mailto:?subject=${title}&body=${URL}`,
              },
              {
                name: t(copyText, { ns: "common" }),
                icon: <DocumentDuplicateIcon className="h-8 w-8" />,
                link: "copy",
              },
            ].map(({ name, icon, link }) => {
              const { result, realtime_track } = useContext(AnalyticsContext);

              return (
                <div className="flex flex-col gap-3 justify-center items-center h-24 p-3 shadow-button border dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-900">
                  {icon}
                  {link === "copy" ? (
                    <p
                      className="link-dim"
                      onClick={() => {
                        copyClipboard(URL);
                        setCopyText("copied");
                        setTimeout(() => {
                          setCopyText("copy");
                        }, 1000);
                      }}
                    >
                      {name}
                    </p>
                  ) : (
                    <At href={link} className="link-dim" external>
                      {name}
                    </At>
                  )}
                </div>
              );
            })}
          </div>
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
}
