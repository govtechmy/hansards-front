import { DateCard, Hero } from "@components/index";
import { SidebarOpen } from "@data-catalogue/hansard/sidebar";
import MobileButton from "@data-catalogue/hansard/mobile-button";
import { useAnalytics } from "@hooks/useAnalytics";
import { useDownload } from "@hooks/useDownload";
import { useMediaQuery } from "@hooks/useMediaQuery";
import { useTranslation } from "@hooks/useTranslation";
import { cn, numFormat } from "@lib/helpers";
import { routes } from "@lib/routes";
import { Speeches } from "@lib/types";
import Link from "next/link";
import { ReactNode, useContext, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { createPdfSession, PdfSession } from "./pdf-session";
import SpeechBubble from "./bubble";
import { highlightKeyword, highlightKeywordMarkdown } from "./search/highlight";
import CiteButton from "../cite";
import ShareButton from "../share";
import HansardSearchBar from "./search-bar";
import { SearchEventContext } from "./search/context";
import Sidebar from "./sidebar";
import { formatTimestamp, isSpeech, isYDP } from "@lib/utils";
import { CiteIcon } from "@icons/index";
import {
  DownloadIcon,
  ExcelFileIcon,
  OptionsVerticalIcon,
  PdfFileIcon,
  ShareIcon,
  CheckCircleFillIcon,
  DocumentFilledIcon,
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
import { Tag } from "@components/Tag";

const PdfViewer = dynamic(() => import("./pdf-viewer"), { ssr: false });

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
  is_final?: boolean;
}

const Hansard = ({
  cycle,
  date,
  filename,
  speeches,
  hansard_id,
  is_final,
}: HansardProps) => {
  const { t } = useTranslation(["hansard", "enum", "common"]);
  const { onResetSearch } = useContext(SearchEventContext);
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const scrollRef = useRef<Record<string, HTMLElement | null>>({});
  const sidebarRef = useRef<SidebarOpen>(null);
  const readingRef = useRef<HTMLDivElement>(null);
  const transcriptRef = useRef<HTMLDivElement>(null);
  const savedScroll = useRef(0);
  const [pdfOpen, setPdfOpen] = useState(false);
  const [pdfPage, setPdfPage] = useState(1);
  const [pdfSession, setPdfSession] = useState<PdfSession | null>(null);
  const splitOpen = isDesktop && pdfOpen;

  useEffect(() => {
    if (!isDesktop) setPdfOpen(false);
  }, [isDesktop]);

  useEffect(() => {
    const session = createPdfSession();
    setPdfSession(session);
    if (!isDesktop || !filename) return;

    const hash = window.location.hash.slice(1);
    const target = document.getElementById(hash);
    const page = Number(
      target?.closest<HTMLElement>("[data-pdf-page]")?.dataset.pdfPage
    );
    if (!Number.isInteger(page) || page < 1) return () => session.dispose();

    let cancelled = false;
    const idleWindow = window as unknown as {
      requestIdleCallback?: (callback: () => void) => number;
      cancelIdleCallback?: (handle: number) => void;
    };
    // Prepare the hash-linked page during idle time using the viewer's shared session.
    const prefetch = () => {
      import("./pdf-viewer")
        .then(({ prefetchPdfPage }) => {
          if (!cancelled) return prefetchPdfPage(filename, page, session);
        })
        .catch(() => undefined);
    };
    const usesIdleCallback = Boolean(
      idleWindow.requestIdleCallback && idleWindow.cancelIdleCallback
    );
    const idleHandle = usesIdleCallback
      ? idleWindow.requestIdleCallback!(prefetch)
      : window.setTimeout(prefetch, 0);

    return () => {
      cancelled = true;
      if (usesIdleCallback && idleWindow.cancelIdleCallback) {
        idleWindow.cancelIdleCallback(idleHandle);
      } else {
        window.clearTimeout(idleHandle);
      }
      session.dispose();
    };
  }, [filename, isDesktop]);

  function togglePdf() {
    if (!isDesktop) return;
    if (pdfOpen) {
      setPdfOpen(false);
      requestAnimationFrame(() => window.scrollTo(0, savedScroll.current));
    } else {
      savedScroll.current = window.scrollY;
      const hash = window.location.hash.slice(1);
      const target = document.getElementById(hash);
      onResetSearch();
      setPdfPage(
        Number(
          target?.closest<HTMLElement>("[data-pdf-page]")?.dataset.pdfPage
        ) || 1
      );
      setPdfOpen(true);
      requestAnimationFrame(() => {
        readingRef.current?.scrollIntoView({ block: "start" });
        const target = document.getElementById(hash);
        const transcript = transcriptRef.current;
        if (target && transcript) {
          transcript.scrollTop +=
            target.getBoundingClientRect().top -
            transcript.getBoundingClientRect().top;
        }
      });
    }
  }
  function handleClick() {
    if (sidebarRef.current) sidebarRef.current.open();
  }

  const { counts } = useAnalytics(hansard_id);
  const { download, share, view } = counts;

  let curr_timestamp = 0;

  const DEWAN_TAG: Record<
    string,
    {
      variant: "primary" | "warning" | "success";
      className: string;
      label: string;
    }
  > = {
    "dewan-rakyat": {
      variant: "primary",
      className: "!text-body-xs font-normal text-[#2563EB]",
      label: t("enum:dewan-rakyat"),
    },
    "dewan-negara": {
      variant: "warning",
      className: "border-[#A1620733] !text-body-xs font-normal text-[#A16207]",
      label: t("enum:dewan-negara"),
    },
    "kamar-khas": {
      variant: "success",
      className: "border-[#15803D33] !text-body-xs font-normal text-[#15803D]",
      label: t("enum:kamar-khas"),
    },
  };

  const recurSpeech = (
    speeches: Speeches,
    prev_id?: string,
    is_final?: boolean
  ): ReactNode => {
    let curr_author_id = 0;
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
          pdf_page_start,
          pdf_page_end,
          source_page_start,
          source_page_end,
        } = s;
        const speech_id = `${sidebar_id}_${i}`;

        // Timestamp
        const timeChanged = curr_timestamp !== timestamp;
        if (timeChanged) curr_timestamp = timestamp;
        const timeString = formatTimestamp(timestamp);
        const time = highlightKeyword(timeString, `${index}_time`);

        // Search
        const author = _author ?? "";
        if (author_id !== curr_author_id) curr_dir = !curr_dir;
        curr_author_id = author_id ?? 0;
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
          <div
            key={i}
            data-pdf-page={
              Number.isInteger(pdf_page_start) && pdf_page_start > 0
                ? pdf_page_start
                : undefined
            }
          >
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
                is_final={is_final}
                pdf_page_start={pdf_page_start}
                pdf_page_end={pdf_page_end}
                source_page_start={source_page_start}
                source_page_end={source_page_end}
              >
                {highlightKeywordMarkdown(speech, speech_id)}
              </SpeechBubble>
            )}
          </div>
        );
      } else {
        const heading = Object.keys(s)[0];

        return (
          <div key={i} className="flex flex-col gap-3 lg:gap-6">
            <div
              title={heading}
              className={cn(
                "z-10 bg-background py-3 text-center text-foreground lg:sticky",
                splitOpen ? "top-0" : "top-28",
                splitOpen ? "truncate whitespace-nowrap px-3" : "text-balance",
                // !s[heading].some((e) => !isSpeech(e)) && "lg:sticky"
                isFirstLevel ? "font-bold" : "font-medium"
              )}
            >
              <div
                className="scroll-mt-40 lg:scroll-mt-24"
                ref={ref => (scrollRef.current[sidebar_id] = ref)}
              ></div>
              {highlightKeyword(heading, `${i}`)}
            </div>
            {recurSpeech(s[heading], sidebar_id, is_final)}
          </div>
        );
      }
    });
  };

  const IS_DR = cycle.house === 0;
  const IS_KK = cycle.house === 2;

  const HOUSE_TO_DEWAN: Record<number, string> = {
    0: "dewan-rakyat",
    1: "dewan-negara",
    2: "kamar-khas",
  };
  const dewanKey = HOUSE_TO_DEWAN[cycle.house];

  const dewan_route = IS_KK
    ? routes.KATALOG_KK
    : IS_DR
      ? routes.KATALOG_DR
      : routes.KATALOG_DN;

  const parlimen_link = `${dewan_route}#parlimen-${cycle.term}`;
  const penggal_link = `${parlimen_link}-penggal-${cycle.session}`;
  const mesyuarat_link = `${penggal_link}-mesyuarat-${cycle.meeting}`;

  // Legacy direct URL retained for props expecting a base path; actual downloads now proxy via /downloads.
  const hansard_url = `${process.env.NEXT_PUBLIC_DOWNLOAD_URL}${
    IS_KK ? "kamarkhas" : IS_DR ? "dewanrakyat" : "dewannegara"
  }/${filename}`;

  // Unified download handler (no old CSV restrictions per current requirement).
  const { download: handleDownload } = useDownload({
    filename,
    analyticsId: hansard_id,
  });

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
                <div className="flex w-[calc(100%-78px)] flex-col justify-center gap-y-1">
                  <h1
                    className="text-3xl font-bold leading-[38px] text-txt-black-900"
                    data-testid="hero-header"
                  >
                    {t("header", {
                      context: IS_KK ? "kk" : IS_DR ? "dr" : "dn",
                    })}
                  </h1>
                  <div className="flex items-center gap-x-2">
                    <div>
                      <Tag
                        variant={DEWAN_TAG[dewanKey].variant}
                        className={DEWAN_TAG[dewanKey].className}
                        mode="pill"
                        size="small"
                      >
                        {DEWAN_TAG[dewanKey].label}
                      </Tag>
                    </div>

                    {is_final !== undefined &&
                      (is_final ? (
                        <span className="me-2 inline-flex w-fit items-center rounded-sm border border-green-500 bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-700 dark:bg-opacity-20 dark:text-green-300">
                          <CheckCircleFillIcon className="size-4" />
                          &nbsp; {t("final")}
                        </span>
                      ) : (
                        <span className="me-2 inline-flex w-fit items-center rounded-sm border border-orange-500 bg-orange-100 bg-opacity-40 px-2.5 py-0.5 text-xs font-medium text-orange-900 dark:bg-orange-500 dark:bg-opacity-10 dark:text-orange-200">
                          <DocumentFilledIcon className="size-4" />
                          &nbsp; {t("draft")}
                        </span>
                      ))}
                  </div>
                  {view >= 0 || share >= 0 || download >= 0 ? (
                    <p
                      className="flex flex-wrap items-center gap-1.5 whitespace-nowrap text-sm text-txt-black-500"
                      data-testid="hero-views"
                    >
                      <span>{`${numFormat(view, "compact")} ${t("views", {
                        ns: "common",
                        count: view,
                      })}`}</span>
                      •
                      <span>{`${numFormat(share, "compact")} ${t("share", {
                        count: share,
                      })}`}</span>
                      •
                      <span>{`${numFormat(download, "compact")} ${t(
                        "downloads",
                        {
                          ns: "common",
                          count: download,
                        }
                      )}`}</span>
                    </p>
                  ) : (
                    <div className="h-1 w-full" />
                  )}
                </div>
              </div>
            </div>
          </Hero>

          <div className="sticky top-14 z-20 flex w-full flex-wrap items-center justify-between gap-1 border-b border-b-border bg-background pr-3 sm:flex-nowrap lg:gap-3 lg:px-8">
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
                    onSelect={() => handleDownload(filetype as "pdf" | "csv")}
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
                      onSelect={() => handleDownload(filetype as "pdf" | "csv")}
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
            {isDesktop && (
              <Button
                variant="default-outline"
                onClick={togglePdf}
                disabled={!filename}
                aria-expanded={pdfOpen}
                aria-controls="hansard-pdf"
                className="shrink-0 whitespace-nowrap border-border hover:border-border-hover dark:hover:border-gray-400"
              >
                <PdfFileIcon className="size-4" />
                {t(pdfOpen ? "pdf_viewer.hide" : "pdf_viewer.open")}
              </Button>
            )}
          </div>

          <div
            ref={readingRef}
            className="relative w-full scroll-mt-40 sm:scroll-mt-28"
          >
            <div
              className={cn(
                "w-full",
                splitOpen &&
                  "grid h-[calc(100dvh-10rem)] min-h-[320px] grid-cols-1 sm:h-[calc(100dvh-7rem)] lg:grid-cols-2"
              )}
            >
              <div
                ref={transcriptRef}
                onClick={event => {
                  const transcript = transcriptRef.current;
                  const scrollTop = transcript?.scrollTop ?? 0;
                  const page = Number(
                    (event.target as HTMLElement).closest<HTMLElement>(
                      "[data-pdf-page]"
                    )?.dataset.pdfPage
                  );
                  if (page > 0) {
                    setPdfPage(page);
                    requestAnimationFrame(() => {
                      if (transcript) transcript.scrollTop = scrollTop;
                    });
                  }
                }}
                className={cn(
                  "relative flex h-full flex-col gap-y-6 bg-background px-3 pb-8 pt-3 md:px-4.5 lg:max-w-[1048px] lg:px-6 lg:py-12",
                  open && "mx-auto",
                  splitOpen &&
                    "hidden min-h-0 w-full overflow-y-auto overscroll-contain lg:flex lg:max-w-none lg:py-0"
                )}
              >
                <MobileButton onClick={handleClick} />
                {recurSpeech(speeches, undefined, is_final)}
              </div>
              {splitOpen && pdfSession && (
                <PdfViewer
                  key={filename}
                  filename={filename}
                  page={pdfPage}
                  onPageChange={setPdfPage}
                  session={pdfSession}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </Sidebar>
  );
};

export default Hansard;
