import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTrigger,
} from "@components/Drawer";
import { EnvelopeIcon } from "@heroicons/react/24/solid";
import { useAnalytics } from "@hooks/useAnalytics";
import { useMediaQuery } from "@hooks/useMediaQuery";
import { useTranslation } from "@hooks/useTranslation";
import { copyClipboard } from "@lib/helpers";
import { ComponentProps, memo, ReactNode, useState } from "react";
import {
  CopyIcon,
  FacebookIcon,
  InstagramIcon,
  LinkedInIcon,
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
  const { t } = useTranslation(["hansard", "catalogue", "demografi"]);
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

  const handleClick = () => {
    // invokes native sharing mechanism, not sure if good idea
    // if (navigator.share) {
    //   setOpen(false);
    //   share();
    //   navigator
    //     .share({
    //       title: title,
    //       text: title,
    //       url: URL,
    //     })
    //     .catch((error) => console.error("Error sharing", error));
    // } else
    setOpen(true);
  };

  const ShareButton = () => (
    <div className="flex flex-col gap-6 max-sm:p-4.5">
      {/* <div className="mx-auto flex w-fit items-center gap-4.5 rounded-2xl border border-border bg-background p-3 shadow-button">
        <DateCard date={date} size="sm" />
        <p>
          {new Date(date).toLocaleDateString(i18n.language, {
            weekday: "long",
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </p>
      </div> */}
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
      <div className="flex items-center gap-3">
        <Input value={URL} className="w-full" />

        <Button
          variant="primary-ghost"
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
          <CopyIcon className="size-5" />
          {t("common:" + copyText)}
        </Button>
      </div>
    </div>
  );

  if (isDesktop)
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
        <DialogBody>
          <DialogHeader border>
            <DialogTitle>{t("share_hansard")}</DialogTitle>
          </DialogHeader>
          <DialogContent className="pb-6">
            <ShareButton />
          </DialogContent>
        </DialogBody>
      </Dialog>
    );

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild onClick={e => e.preventDefault()}>
        {trigger ? (
          trigger(handleClick)
        ) : (
          <Button variant="unset" className="bt" onClick={handleClick}>
            <div className="i" />
            {t("share")}
          </Button>
        )}
      </DrawerTrigger>
      <DrawerContent className="rounded-t-xl">
        <DrawerHeader className="flex justify-between border-b border-slate-200 p-4 dark:border-zinc-700">
          <span className="font-medium text-foreground">
            {t("share_hansard")}
          </span>
        </DrawerHeader>
        <ShareButton />
      </DrawerContent>
    </Drawer>
  );
};

const XShare = (props: ComponentProps<"svg">) => {
  return (
    <svg
      width="150"
      height="150"
      viewBox="0 0 150 150"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M67 .55C40.648 3.3 17.102 20.649 6.398 45.2-.5 61.05-1.648 79.3 3.25 96.101c6.05 20.949 21.7 38.648 41.95 47.5 15.85 6.898 34.1 8.046 50.902 3.148 25.148-7.25 44.949-27.898 51.449-53.55C157.699 53 132.8 11.897 92.5 2.3 83.648.2 75.852-.351 67 .55ZM68 47c6.398 8.5 11.8 15.5 12 15.5.2 0 6.852-7 14.7-15.5l14.35-15.5h8.15l-1.75 1.852c-1 1.046-7.5 8.097-14.45 15.648-6.95 7.55-13.75 14.898-15.102 16.25L83.5 67.8l18.75 24.95c10.3 13.75 18.75 25.148 18.75 25.352 0 .25-6.148.398-13.602.398l-13.648-.05-12.7-17C72.3 89.7 68.2 84.647 67.8 84.95c-.3.25-7.402 7.902-15.8 17L36.75 118.5h-3.852c-2.148 0-3.898-.102-3.898-.25 0-.148 7.95-8.852 17.648-19.3 9.653-10.45 17.653-19.2 17.75-19.348C64.45 79.398 56.5 68.55 46.75 55.5 37 42.5 29 31.75 29 31.648c0-.097 6.148-.148 13.7-.148h13.698Zm0 0"
        stroke="none"
        fillRule="nonzero"
        fill="currentColor"
        fillOpacity={1}
      />
      <path
        d="M41.352 38.2c.199.35 12.796 17.25 27.898 37.448l27.5 36.801 6.148.051c3.801 0 6.102-.2 6-.5-.046-.25-12.597-17.148-27.796-37.5l-27.704-37H47.2c-5.148 0-6.199.102-5.847.7Zm0 0"
        stroke="none"
        fillRule="nonzero"
        fill="currentColor"
        fillOpacity={1}
      />
    </svg>
  );
};

const FBShare = (props: ComponentProps<"svg">) => {
  return (
    <svg
      version="1.1"
      width="666.66669"
      height="666.66718"
      viewBox="0 0 666.66668 666.66717"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <defs id="defs13">
        <clipPath clipPathUnits="userSpaceOnUse" id="clipPath25">
          <path d="M 0,700 H 700 V 0 H 0 Z" id="path23" />
        </clipPath>
      </defs>
      <g
        id="g17"
        transform="matrix(1.3333333,0,0,-1.3333333,-133.33333,799.99999)"
      >
        <g id="g19">
          <g id="g21" clipPath="url(#clipPath25)">
            <g id="g27" transform="translate(600,350)">
              <path
                d="m 0,0 c 0,138.071 -111.929,250 -250,250 -138.071,0 -250,-111.929 -250,-250 0,-117.245 80.715,-215.622 189.606,-242.638 v 166.242 h -51.552 V 0 h 51.552 v 32.919 c 0,85.092 38.508,124.532 122.048,124.532 15.838,0 43.167,-3.105 54.347,-6.211 V 81.986 c -5.901,0.621 -16.149,0.932 -28.882,0.932 -40.993,0 -56.832,-15.528 -56.832,-55.9 V 0 h 81.659 l -14.028,-76.396 h -67.631 V -248.169 C -95.927,-233.218 0,-127.818 0,0"
                fill="currentColor"
                id="path29"
              />
            </g>
          </g>
        </g>
      </g>
    </svg>
  );
};

export default memo(ShareDialogDrawer);
