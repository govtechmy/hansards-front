import { cn } from "@lib/helpers";
import { ReactNode, useState } from "react";
import ShareButton from "./share";
import ImageWithFallback from "@components/ImageWithFallback";
import { useTranslation } from "react-i18next";
import { useAnalytics } from "@hooks/useAnalytics";
import { DownloadIcon, UserIcon } from "@govtechmy/myds-react/icon";
import {
  Dropdown,
  DropdownContent,
  DropdownItem,
  DropdownTrigger,
} from "@govtechmy/myds-react/dropdown";

/**
 * Speech Bubble
 * @overview Status: In-development
 */

export type SpeechBubbleProps = {
  children: ReactNode;
  date: string;
  filename: string;
  hansard_id: string;
  index: number;
  isYDP: boolean;
  length: number;
  side: boolean;
  speaker: ReactNode;
  speech_id: string;
  timeString: string;
  uid: number;
};

const SpeechBubble = ({
  children,
  date,
  filename,
  hansard_id,
  index,
  isYDP,
  length,
  side,
  speaker,
  speech_id,
  timeString,
  uid,
}: SpeechBubbleProps) => {
  const { t } = useTranslation("catalogue");
  const { download } = useAnalytics(hansard_id);
  const [downloadOpen, setDownloadOpen] = useState<boolean>(false);

  return (
    <>
      <div id={`${index}`} key={speech_id} className={cn("s", side && "r")}>
        {/* Avatar */}
        <div className={cn("w", side && "r")}>
          <div className="a">
            {/* <ImageWithFallback
              fallback={
                <div className="border border-border size-9 rounded-full" />
              }
              src={`/static/`}
              width={36}
              height={1}
              alt={``}
              className="p"
              priority={index <= 5}
            /> */}
            {/* <img
              alt={`${uid}`}
              className="p"
              src={`/mp/${uid}.jpg`}
              width={36}
              height={36}
            /> */}
            <div className="flex size-9 items-center justify-center rounded-full border border-border">
              <UserIcon className="size-6 text-zinc-500" />
            </div>
          </div>
        </div>
        {/* Bubble */}
        <div className={cn("b", isYDP && "ydp", length <= 222 && "x")}>
          {speaker ? <div className="m">{speaker}</div> : <></>}
          {children}

          <div
            className={cn(
              "ft",
              downloadOpen ? "visible translate-x-2" : "invisible"
            )}
          >
            <Dropdown open={downloadOpen} onOpenChange={setDownloadOpen}>
              <DropdownTrigger className="bt">
                <DownloadIcon />
                {t("download", { ns: "catalogue" })}
              </DropdownTrigger>
              <DropdownContent>
                {[
                  { name: "PDF", type: "pdf" },
                  { name: t("csv"), type: "csv" },
                ].map(file => (
                  <DropdownItem
                    key={file.type}
                    onSelect={() => {
                      window.open(`${filename}.${file.type}`, "_blank");
                      download(file.type as "pdf" | "csv");
                    }}
                  >
                    {file.name}
                  </DropdownItem>
                ))}
              </DropdownContent>
            </Dropdown>
            <ShareButton
              date={date}
              hansard_id={hansard_id}
              index={`${index}`}
            />
          </div>
          <span className="t">{timeString}</span>
        </div>
      </div>
    </>
  );
};

export default SpeechBubble;
