import { useTranslation } from "@hooks/useTranslation";
import { buildDownloadPath } from "@lib/downloads";
import { cn } from "@lib/helpers";
import { useEffect, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { Button } from "@govtechmy/myds-react/button";

// Keep this local worker matched to react-pdf's pinned PDF.js version.
pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

const singlePageOptions = { disableAutoFetch: true };
const allPagesOptions = { disableAutoFetch: false };

interface PdfViewerProps {
  filename: string;
  page: number;
  onPageChange: (page: number) => void;
}

export default function PdfViewer({
  filename,
  page,
  onPageChange,
}: PdfViewerProps) {
  const { t } = useTranslation("hansard");
  const container = useRef<HTMLDivElement>(null);
  const pageRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const [width, setWidth] = useState(0);
  const [pages, setPages] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [showAll, setShowAll] = useState(false);
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
    if (!container.current) return;
    const observer = new ResizeObserver(([entry]) =>
      setWidth(entry.contentRect.width)
    );
    observer.observe(container.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const viewer = container.current;
    const target = pageRefs.current[page];
    if (!viewer || !target) return;

    viewer.scrollTo({
      top:
        target.getBoundingClientRect().top -
        viewer.getBoundingClientRect().top +
        viewer.scrollTop,
      behavior: "smooth",
    });
  }, [page, pages, showAll]);

  return (
    <section
      id="hansard-pdf"
      aria-label={t("pdf_viewer.title")}
      className="flex h-full min-h-0 min-w-0 flex-col border-l border-otl-gray-200 bg-background"
    >
      <div className="flex flex-wrap items-center gap-2 border-b p-2 text-sm">
        <Button
          variant="default-outline"
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
            className="w-14 rounded border bg-background p-1 text-center"
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
          disabled={!pages || currentPage >= pages}
          onClick={() => onPageChange(currentPage + 1)}
          aria-label={t("pdf_viewer.next")}
        >
          ›
        </Button>
        <Button
          variant="default-outline"
          disabled={zoom <= 0.5}
          onClick={() => setZoom(zoom - 0.25)}
          aria-label={t("pdf_viewer.zoom_out")}
        >
          −
        </Button>
        <span>{Math.round(zoom * 100)}%</span>
        <Button
          variant="default-outline"
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
          className="whitespace-nowrap"
        >
          {viewLabel}
        </Button>
        {/* <a
          href={buildDownloadPath(filename, "pdf")}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-auto underline"
        >
          {t("pdf_viewer.open_tab")}
        </a> */}
      </div>
      <div
        ref={container}
        className="min-h-0 flex-1 overflow-auto overscroll-contain bg-gray-100 dark:bg-gray-900"
      >
        <Document
          file={`/api/pdf?filename=${encodeURIComponent(filename)}`}
          options={showAll ? allPagesOptions : singlePageOptions}
          onLoadSuccess={({ numPages }) => setPages(numPages)}
          loading={
            <p role="status" className="p-4">
              {t("pdf_viewer.loading")}
            </p>
          }
          error={
            <p role="alert" className="p-4">
              {t("pdf_viewer.error")}
            </p>
          }
        >
          {width > 0 &&
            pageNumbers.map(pageNumber => {
              return (
                <div
                  key={pageNumber}
                  ref={element => {
                    pageRefs.current[pageNumber] = element;
                  }}
                  className="flex justify-center pb-4 first:pt-2"
                  data-page={pageNumber}
                >
                  <Page
                    pageNumber={pageNumber}
                    width={Math.max(1, width - 16)}
                    scale={zoom}
                    renderAnnotationLayer={false}
                    renderTextLayer={false}
                    loading={
                      <p role="status" className="p-4">
                        {t("pdf_viewer.loading")}
                      </p>
                    }
                  />
                </div>
              );
            })}
        </Document>
      </div>
    </section>
  );
}
