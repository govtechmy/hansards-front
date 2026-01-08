import { cn } from "@lib/helpers";
import ShareButton from "../share";
import { useTranslation } from "react-i18next";
import { useAnalytics } from "@hooks/useAnalytics";
import { DownloadIcon, UserIcon } from "@govtechmy/myds-react/icon";
// import {
//   Dropdown,
//   DropdownContent,
//   DropdownItem,
//   DropdownTrigger,
// } from "@govtechmy/myds-react/dropdown";
import { ComponentProps, memo, ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/router";

/**
 * Speech Bubble
 * @overview Status: In-development
 */

export type SpeechBubbleProps = {
  author: string;
  children: ReactNode;
  date: string;
  filename: string;
  hansard_id: string;
  index: number;
  is_annotation: boolean;
  isYDP: boolean;
  length: number;
  side: boolean;
  speaker?: ReactNode;
  timeString: string;
  uid: number | null;
};

const SpeechBubble = ({
  author,
  children,
  date,
  // filename,
  hansard_id,
  index,
  is_annotation,
  isYDP,
  length,
  side,
  speaker,
  timeString,
  uid,
}: SpeechBubbleProps) => {
  const { t } = useTranslation("catalogue");
  // const { download } = useAnalytics(hansard_id);
  // const [downloadOpen, setDownloadOpen] = useState<boolean>(false);
  const [highlight, setHighlight] = useState<boolean>(false);
  const [imgValid, setImgValid] = useState<boolean>(false);
  const [imgUrl, setImgUrl] = useState<string>("");

  const router = useRouter();
  const asPath = router.asPath;

  useEffect(() => {
    const hash = window.location.hash.slice(1);
    const sameId = Number(hash) === index;
    if (hash && sameId) setHighlight(true);

    // ---------- Image validation logic ----------
    if (uid) {
      const url = `${process.env.NEXT_PUBLIC_ASSETS_URL}/img/mp-240/${uid}.jpg`;
      const img = new Image();

      img.onload = () => {
        setImgValid(true);
        setImgUrl(url);
      };
      img.onerror = () => {
        setImgValid(false);
        setImgUrl("");
      };
      img.src = url;

      return () => {
        img.onload = null;
        img.onerror = null;
      };
    }
  }, [asPath, uid, index]);

  return (
    <>
      <div id={`${index}`} key={index} className={cn("s", side && "r")}>
        {/* Avatar */}
        <div className={cn("w", side && "r")}>
          <div className="a">
            {uid === null ? (
              <EmptyMP />
            ) : (
              <>
                {imgValid ? (
                  <img
                    src={imgUrl}
                    width={36}
                    height={36}
                    alt={author}
                    className="p"
                    fetchPriority={index < 10 ? "high" : "auto"}
                  />
                ) : (
                  <EmptyMP />
                )}
              </>
            )}
          </div>
        </div>
        {/* Bubble */}
        <div
          className={cn(
            "b",
            isYDP && "ydp",
            length <= 222 && "x",
            highlight && "h"
          )}
        >
          {speaker ? <div className="m">{speaker}</div> : <></>}
          <div className={cn("c", is_annotation && "d")}>{children}</div>

          <div
            className={cn(
              "ft invisible"
              // downloadOpen ? "visible translate-x-2" : "invisible"
            )}
          >
            {/* <Dropdown open={downloadOpen} onOpenChange={setDownloadOpen}>
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
            </Dropdown> */}
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

const ImageWithFallback = ({ src, ...props }: ComponentProps<"img">) => {
  const [error, setError] = useState<React.SyntheticEvent<
    HTMLImageElement,
    Event
  > | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setError(null);
  }, [src]);

  return error ? (
    <EmptyMP />
  ) : (
    <img
      {...props}
      src={src}
      className={cn(props.className, loading && "blur-[2px]")}
      onLoad={() => setLoading(false)}
      onError={setError}
    />
  );
};

const EmptyMP = () => (
  <div className="flex size-9 items-center justify-center rounded-full border border-otl-gray-200">
    <UserIcon className="size-6 text-txt-black-500" />
  </div>
);

export default SpeechBubble;
