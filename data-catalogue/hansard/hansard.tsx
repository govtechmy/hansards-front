import { DateCard, Hero } from "@components/index";
import { SidebarOpen } from "@data-catalogue/hansard/sidebar";
import MobileButton from "@data-catalogue/hansard/mobile-button";
import { ChevronRightIcon } from "@heroicons/react/20/solid";
import { useAnalytics } from "@hooks/useAnalytics";
import { useTranslation } from "@hooks/useTranslation";
import { cn, numFormat } from "@lib/helpers";
import { routes } from "@lib/routes";
import { Speeches } from "@lib/types";
import Link from "next/link";
import { ReactNode, useRef } from "react";
import SpeechBubble from "./bubble";
import { highlightKeyword, highlightKeywordMarkdown } from "./search/highlight";
import CiteButton from "./cite";
import ShareButton from "./share";
import HansardSearchBar from "./search-bar";
import Sidebar from "./sidebar";
import { formatTimestamp, isSpeech, isYDP } from "@lib/utils";
import { CiteIcon } from "@icons/index";
import {
  DownloadIcon,
  ExcelFileIcon,
  OptionsVerticalIcon,
  PdfFileIcon,
  ShareIcon,
} from "@govtechmy/myds-react/icon";
import {
  Dropdown,
  DropdownContent,
  DropdownItem,
  DropdownTrigger,
} from "@govtechmy/myds-react/dropdown";
import { Button } from "@govtechmy/myds-react/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "@govtechmy/myds-react/breadcrumb";

/**
 * Hansard
 * @overview Status: In-development
 */

interface HansardProps {
  cycle: {
    house: number;
    term: number;
    session: number;
    meeting: number;
  };
  date: string;
  filename: string;
  speeches: Speeches;
  hansard_id: string;
}

const Hansard = ({
  cycle,
  date,
  filename,
  speeches,
  hansard_id,
}: HansardProps) => {
  const { t } = useTranslation(["hansard", "enum", "common"]);
  const scrollRef = useRef<Record<string, HTMLElement | null>>({});
  const sidebarRef = useRef<SidebarOpen>(null);
  function handleClick() {
    if (sidebarRef.current) sidebarRef.current.open();
  }

  const { counts, download } = useAnalytics(hansard_id);
  const { downloads, shares, views } = counts;

  let curr_timestamp = 0;

  const recurSpeech = (speeches: Speeches, prev_id?: string): ReactNode => {
    let curr_author = "";
    let curr_dir = false;

    return speeches.map((s, i) => {
      const isFirstLevel = !prev_id;
      const sidebar_id = isFirstLevel ? `${i}` : `${prev_id}_${i}`;

      // Annotation, Speech, Timestamp
      if (isSpeech(s)) {
        const {
          author: _author,
          author_id,
          is_annotation,
          index,
          speech,
          timestamp,
        } = s;
        const speech_id = `${prev_id}_${i}`;

        // Timestamp
        const timeChanged = curr_timestamp !== timestamp;
        if (timeChanged) curr_timestamp = timestamp;
        const timeString = formatTimestamp(timestamp);
        const time = highlightKeyword(timeString, `${index}_time`);

        // Search
        const author = _author ?? "";
        if (author !== curr_author) curr_dir = !curr_dir;
        curr_author = author;
        const names = author.includes(" [") ? author.split(" [") : [author];

        const IS_YDP = isYDP(author);
        const unspecified_author = ["Beberapa Ahli", "Seorang Ahli"].includes(
          author
        );

        const mod = IS_YDP
          ? "ydp"
          : author === "ANNOTATION" || unspecified_author || !author
          ? "z"
          : (author_id ? author_id : names[0].length) % 10;

        const speaker =
          author !== "ANNOTATION" ? (
            <p
              className={cn(
                "n",
                {
                  0: "o", // orange
                  1: "l", // lime
                  2: "g", // green
                  3: "t", // emerald
                  4: "c", // cyan
                  5: "b", // blue
                  6: "v", // violet
                  7: "f", // fuchsia
                  8: "p", // pink
                  9: "r", // rose
                  ydp: "ydp", // yellow
                  z: "z", // zinc
                }[mod]
              )}
            >
              {highlightKeyword(names[0], `${speech_id}_title`)}
              {names[1] ? (
                <span className="o">
                  {` - `}
                  {highlightKeyword(
                    `${names[1].slice(0, -1)}`,
                    `${speech_id}_subtitle`
                  )}
                </span>
              ) : undefined}
            </p>
          ) : (
            <></>
          );

        return (
          <>
            {index === 0 || timeChanged ? (
              <time className="t">{time}</time>
            ) : (
              <></>
            )}
            {author === "ANNOTATION" ? (
              <div className="a" id={`${index}`}>
                {highlightKeywordMarkdown(speech, speech_id)}
              </div>
            ) : (
              <SpeechBubble
                speaker={speaker}
                timeString={timeString}
                filename={hansard_url}
                index={index}
                is_annotation={is_annotation}
                hansard_id={hansard_id}
                date={date}
                length={speech.length}
                isYDP={IS_YDP}
                side={curr_dir}
                uid={author_id}
                author={author}
              >
                {highlightKeywordMarkdown(speech, speech_id)}
              </SpeechBubble>
            )}
          </>
        );
      } else {
        const heading = Object.keys(s)[0];

        return (
          <div key={i} className="flex flex-col gap-3 lg:gap-6">
            <div
              title={heading}
              className={cn(
                "top-28 z-10 text-balance bg-background py-3 text-center text-foreground lg:sticky",
                // !s[heading].some((e) => !isSpeech(e)) && "lg:sticky",
                isFirstLevel ? "font-bold" : "font-medium"
              )}
            >
              <div
                className="scroll-mt-40 lg:scroll-mt-24"
                ref={ref => (scrollRef.current[sidebar_id] = ref)}
              />
              {highlightKeyword(heading, `${i}`)}
            </div>
            {recurSpeech(s[heading], sidebar_id)}
          </div>
        );
      }
    });
  };

  const IS_DR = cycle.house === 0;
  const IS_KK = cycle.house === 2;
  const dewan_route = IS_KK
    ? routes.KATALOG_KK
    : IS_DR
    ? routes.KATALOG_DR
    : routes.KATALOG_DN;

  const parlimen_link = `${dewan_route}#parlimen-${cycle.term}`;
  const penggal_link = `${parlimen_link}-penggal-${cycle.session}`;
  const mesyuarat_link = `${penggal_link}-mesyuarat-${cycle.meeting}`;

  const hansard_url = `${process.env.NEXT_PUBLIC_DOWNLOAD_URL}${
    IS_KK ? "kamarkhas" : IS_DR ? "dewanrakyat" : "dewannegara"
  }/${filename}`;

  return (
    <Sidebar
      ref={sidebarRef}
      speeches={speeches}
      onClick={selected => {
        scrollRef.current[selected]?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }}
    >
      {open => (
        <div className="relative flex w-full flex-col items-center">
          <Hero>
            <div className="space-y-6 py-8 lg:py-12 xl:w-full">
              <Breadcrumb className="text-txt-black-500">
                <BreadcrumbItem className="max-w-[250px]">
                  <BreadcrumbLink asChild>
                    <Link href={dewan_route} prefetch={false}>
                      {t("archive", {
                        context: IS_KK ? "kk" : IS_DR ? "dr" : "dn",
                      })}
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link href={parlimen_link} prefetch={false}>
                      {t("parlimen", { ns: "enum", count: cycle.term })}
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link href={penggal_link} prefetch={false}>
                      {t("penggal_full", { ns: "enum", n: cycle.session })}
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link href={mesyuarat_link} prefetch={false}>
                      {t("mesyuarat_full", { ns: "enum", n: cycle.meeting })}
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </Breadcrumb>

              <div className="flex items-center justify-between gap-3 lg:gap-6">
                <DateCard size="lg" date={date} />
                <div className="flex w-[calc(100%-78px)] flex-col justify-center gap-y-3">
                  <h1
                    className="text-3xl font-bold leading-[38px] text-txt-black-900"
                    data-testid="hero-header"
                  >
                    {t("header", {
                      context: IS_KK ? "kk" : IS_DR ? "dr" : "dn",
                    })}
                  </h1>
                  {views >= 0 || shares >= 0 || downloads >= 0 ? (
                    <p
                      className="flex flex-wrap items-center gap-1.5 whitespace-nowrap text-sm text-txt-black-500"
                      data-testid="hero-views"
                    >
                      <span>{`${numFormat(views, "compact")} ${t("views", {
                        ns: "common",
                        count: views,
                      })}`}</span>
                      •
                      <span>{`${numFormat(shares, "compact")} ${t("shares", {
                        count: shares,
                      })}`}</span>
                      •
                      <span>{`${numFormat(downloads, "compact")} ${t(
                        "downloads",
                        {
                          ns: "common",
                          count: downloads,
                        }
                      )}`}</span>
                    </p>
                  ) : (
                    <div className="h-5 w-full" />
                  )}
                </div>
              </div>
            </div>
          </Hero>

          <div className="sticky top-14 z-20 flex w-full items-center justify-between gap-1 border-b border-b-border bg-background pr-3 lg:gap-3 lg:px-8">
            <HansardSearchBar />

            <Dropdown>
              <DropdownTrigger asChild>
                <Button
                  variant="default-outline"
                  className="md:hidden"
                  iconOnly
                >
                  <OptionsVerticalIcon className="size-5" />
                </Button>
              </DropdownTrigger>
              <DropdownContent>
                <DropdownItem asChild>
                  <CiteButton
                    date={date}
                    hansard_id={hansard_id}
                    dewan={IS_KK ? "KK" : IS_DR ? "DR" : "DN"}
                    trigger={onClick => (
                      <Button
                        variant="default-ghost"
                        className="w-full"
                        onClick={onClick}
                      >
                        {t("cite")}
                      </Button>
                    )}
                  />
                </DropdownItem>
                {[
                  "pdf",
                  // "csv"
                ].map(filetype => (
                  <DropdownItem
                    key={filetype}
                    onSelect={() => {
                      window.open(`${hansard_url}.${filetype}`, "_blank");
                      download(filetype as "pdf" | "csv");
                    }}
                  >
                    {t("download", { context: filetype })}
                  </DropdownItem>
                ))}
                <DropdownItem asChild>
                  <ShareButton
                    date={date}
                    hansard_id={hansard_id}
                    trigger={onClick => (
                      <Button
                        variant="default-ghost"
                        className="w-full"
                        onClick={onClick}
                      >
                        {t("share")}
                      </Button>
                    )}
                  />
                </DropdownItem>
              </DropdownContent>
            </Dropdown>

            <div className="z-50 hidden gap-1 whitespace-nowrap border-l border-otl-gray-200 pl-3 md:flex">
              <CiteButton
                date={date}
                hansard_id={hansard_id}
                dewan={IS_KK ? "KK" : IS_DR ? "DR" : "DN"}
                trigger={onClick => (
                  <Button variant="primary-ghost" onClick={onClick}>
                    <CiteIcon className="size-5" />
                    {t("cite")}
                  </Button>
                )}
              />
              <Dropdown>
                <DropdownTrigger asChild>
                  <Button variant="primary-ghost">
                    <DownloadIcon />
                    {t("download", { ns: "catalogue" })}
                  </Button>
                </DropdownTrigger>
                <DropdownContent align="start">
                  {["pdf", "csv"].map(filetype => (
                    <DropdownItem
                      key={filetype}
                      onSelect={() => {
                        window.open(`${hansard_url}.${filetype}`, "_blank");
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
              <ShareButton
                date={date}
                hansard_id={hansard_id}
                trigger={onClick => (
                  <Button variant="primary-ghost" onClick={onClick}>
                    <ShareIcon />
                    {t("share")}
                  </Button>
                )}
              />
            </div>
          </div>

          <div
            className={cn(
              "relative flex h-full flex-col gap-y-6 bg-background px-3 pb-8 pt-3 md:px-4.5 lg:max-w-[1048px] lg:px-6 lg:py-12",
              open && "mx-auto"
            )}
          >
            <MobileButton onClick={handleClick} />
            {recurSpeech(speeches)}
          </div>
        </div>
      )}
    </Sidebar>
  );
};

export default Hansard;
