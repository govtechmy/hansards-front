import { useTranslation } from "@hooks/useTranslation";
import { cn } from "@lib/helpers";
import { ComponentProps, useEffect, useRef, useState } from "react";
import { Page, pdfjs } from "react-pdf";
import type { PdfSession } from "./pdf-session";
import { Button } from "@govtechmy/myds-react/button";
import type { PDFDocumentProxy } from "pdfjs-dist";

// Keep this local worker matched to react-pdf's pinned PDF.js version.
pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

const singlePageOptions = { disableAutoFetch: true, disableStream: true };
const pdfControlClassName =
  "border-border hover:border-border-hover dark:hover:border-gray-400";

/** Uses the same-origin proxy so PDF.js can request document byte ranges. */
const getPdfUrl = (filename: string) =>
  `/api/pdf?filename=${encodeURIComponent(filename)}`;

/** Starts or reuses the session's document without fetching extra pages eagerly. */
const loadPdf = (filename: string, session: PdfSession) =>
  session.load(() =>
    pdfjs.getDocument({
      url: getPdfUrl(filename),
      ...singlePageOptions,
    })
  );

/** Warms the hash-linked page without rendering a hidden canvas. */
export const prefetchPdfPage = (
  filename: string,
  page: number,
  session: PdfSession
) => loadPdf(filename, session).then(pdf => pdf.getPage(page));

interface PdfViewerProps {
  filename: string;
  page: number;
  onPageChange: (page: number) => void;
  session: PdfSession;
  open: boolean;
}

/** Displays the shared document with page navigation, zoom, and lazy page rendering. */
export default function PdfViewer({
  filename,
  page,
  onPageChange,
  session,
  open,
}: PdfViewerProps) {
  const { t } = useTranslation("hansard");
  const container = useRef<HTMLDivElement>(null);
  const pageRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const [width, setWidth] = useState(0);
  const [pages, setPages] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [showAll, setShowAll] = useState(false);
  const [pdf, setPdf] = useState<PDFDocumentProxy>();
  const [failed, setFailed] = useState(false);
  const currentPage = Math.min(page, pages || page);
  const pageNumbers = showAll
    ? Array.from({ length: pages }, (_, index) => index + 1)
    : [currentPage];
  const viewKey = cn(
    showAll && "pdf_viewer.view_one",
    !showAll && "pdf_viewer.view_all"
  );
  const viewLabel = t(viewKey);

  useEffect(() => {
    if (!open || pdf) return;
    let active = true;
    setFailed(false);
    loadPdf(filename, session)
      .then(document => {
        if (active) {
          setPdf(document);
          setPages(document.numPages);
        }
      })
      .catch(() => {
        if (active) setFailed(true);
      });
    return () => {
      active = false;
    };
  }, [filename, session, open, pdf]);

  useEffect(() => {
    if (!container.current) return;
    const observer = new ResizeObserver(([entry]) => {
      // Preserve the rendered canvas while the closed viewer is hidden.
      if (entry.contentRect.width > 0)
        setWidth(Math.floor(entry.contentRect.width));
    });
    observer.observe(container.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const viewer = container.current;
    const target = pageRefs.current[page];
    if (!viewer || !target || !showAll) return;

    viewer.scrollTo({
      top:
        target.getBoundingClientRect().top -
        viewer.getBoundingClientRect().top +
        viewer.scrollTop,
      behavior: "instant",
    });
  }, [page, pages, showAll]);

  /** Keeps scroll targets for every page while limiting nearby canvas rendering. */
  const renderPages = (pdf?: PDFDocumentProxy) =>
    width > 0 &&
    pageNumbers.map(pageNumber => {
      return (
        <div
          key={pageNumber}
          ref={element => {
            pageRefs.current[pageNumber] = element;
          }}
          className="flex min-w-max justify-center pb-4 first:pt-2"
          data-page={pageNumber}
        >
          <LazyPdfPage
            active={!showAll}
            root={container}
            width={Math.max(1, width - 16)}
            zoom={zoom}
          >
            {setRatio => (
              <BufferedPage
                pdf={pdf}
                pageNumber={pageNumber}
                width={Math.max(1, width - 16)}
                scale={zoom}
                onLoadSuccess={page => {
                  const viewport = page.getViewport({ scale: 1 });
                  setRatio(viewport.height / viewport.width);
                }}
                renderAnnotationLayer={false}
                renderTextLayer={false}
                error={
                  <p role="alert" className="p-4">
                    {t("pdf_viewer.error")}
                  </p>
                }
                loading={
                  <p role="status" className="p-4">
                    {t("pdf_viewer.loading")}
                  </p>
                }
              />
            )}
          </LazyPdfPage>
        </div>
      );
    });

  return (
    <section
      id="hansard-pdf"
      aria-label={t("pdf_viewer.title")}
      className="flex h-full min-h-0 min-w-0 flex-col border-l border-otl-gray-200 bg-background"
    >
      <div className="flex flex-wrap items-center gap-2 border-b p-2 text-sm">
        <Button
          variant="default-outline"
          className={pdfControlClassName}
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
          aria-label={t("pdf_viewer.previous")}
        >
          ‹
        </Button>
        <label className="flex items-center gap-1">
          <span className="sr-only">{t("pdf_viewer.page")}</span>
          <input
            type="number"
            min={1}
            max={pages || 1}
            value={currentPage}
            className={cn(
              "w-14 rounded border bg-background p-1 text-center",
              pdfControlClassName
            )}
            onChange={event => {
              const value = Number(event.target.value);
              if (Number.isInteger(value) && value >= 1 && value <= pages)
                onPageChange(value);
            }}
          />
          <span aria-live="polite">/ {pages || "…"}</span>
        </label>
        <Button
          variant="default-outline"
          className={pdfControlClassName}
          disabled={!pages || currentPage >= pages}
          onClick={() => onPageChange(currentPage + 1)}
          aria-label={t("pdf_viewer.next")}
        >
          ›
        </Button>
        <Button
          variant="default-outline"
          className={pdfControlClassName}
          disabled={zoom <= 0.5}
          onClick={() => setZoom(zoom - 0.25)}
          aria-label={t("pdf_viewer.zoom_out")}
        >
          −
        </Button>
        <span>{Math.round(zoom * 100)}%</span>
        <Button
          variant="default-outline"
          className={pdfControlClassName}
          disabled={zoom >= 2}
          onClick={() => setZoom(zoom + 0.25)}
          aria-label={t("pdf_viewer.zoom_in")}
        >
          +
        </Button>
        <Button
          variant="default-outline"
          disabled={!pages}
          onClick={() => setShowAll(value => !value)}
          aria-pressed={showAll}
          aria-label={viewLabel}
          className={cn(pdfControlClassName, "whitespace-nowrap")}
        >
          {viewLabel}
        </Button>
      </div>
      <div
        ref={container}
        className="min-h-0 flex-1 overflow-auto overscroll-contain bg-gray-100 [overflow-anchor:none] [scrollbar-gutter:stable] dark:bg-gray-900"
      >
        {pdf ? (
          renderPages(pdf)
        ) : (
          <p role={failed ? "alert" : "status"} className="p-4">
            {t(failed ? "pdf_viewer.error" : "pdf_viewer.loading")}
          </p>
        )}
      </div>
    </section>
  );
}

/** Keeps the last canvas visible until its replacement finishes rendering. */
function BufferedPage(props: ComponentProps<typeof Page>) {
  const [ratio, setRatio] = useState(1.414);
  const width = Number(props.width) * (props.scale ?? 1);
  const key = `${props.pageNumber}-${props.width}-${props.scale}`;
  const [rendered, setRendered] = useState<{
    key: string;
    props: ComponentProps<typeof Page>;
  }>();
  const replacing = rendered && rendered.key !== key;
  const [failedKey, setFailedKey] = useState<string>();
  const failed = failedKey === key;
  return (
    <div
      className="relative overflow-hidden"
      style={{ width, height: width * ratio }}
    >
      {replacing && !failed && (
        <div key={rendered.key} className="absolute left-0 top-0">
          <Page {...rendered.props} />
        </div>
      )}
      <div
        key={key}
        className={cn(
          "absolute left-0 top-0",
          replacing && !failed && "opacity-0"
        )}
      >
        <Page
          {...props}
          onLoadError={error => {
            setFailedKey(key);
            props.onLoadError?.(error);
          }}
          onRenderError={error => {
            setFailedKey(key);
            props.onRenderError?.(error);
          }}
          onLoadSuccess={page => {
            const viewport = page.getViewport({ scale: 1 });
            setRatio(viewport.height / viewport.width);
            props.onLoadSuccess?.(page);
          }}
          onRenderSuccess={() => {
            setRendered(previous =>
              previous?.key === key ? previous : { key, props }
            );
          }}
        />
      </div>
    </div>
  );
}

/** Mounts nearby canvases and preserves page dimensions when they leave the viewport. */
function LazyPdfPage({
  active,
  root,
  width,
  zoom,
  children,
}: {
  active: boolean;
  root: React.RefObject<HTMLDivElement>;
  width: number;
  zoom: number;
  children: (setRatio: (ratio: number) => void) => React.ReactNode;
}) {
  const element = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [ratio, setRatio] = useState(1.414);
  useEffect(() => {
    if (!element.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { root: root.current, rootMargin: "800px" }
    );
    observer.observe(element.current);
    return () => observer.disconnect();
  }, [root]);
  return (
    <div
      ref={element}
      style={{ width: width * zoom, minHeight: width * zoom * ratio }}
    >
      {active || visible ? children(setRatio) : null}
    </div>
  );
}
