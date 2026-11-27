import type { PDFDocumentLoadingTask } from "pdfjs-dist";

/** Owns one document load shared by idle prefetch and the visible PDF viewer. */
export function createPdfSession() {
  let task: PDFDocumentLoadingTask | undefined;
  let disposed = false;
  return {
    /** Reuses pending/completed work; releases failures so the next open can retry. */
    load(start: () => PDFDocumentLoadingTask) {
      if (disposed) return Promise.reject(new Error("PDF session closed"));
      if (!task) {
        const started = start();
        task = started;
        void started.promise.catch(() => {
          if (task === started) {
            task = undefined;
            void started.destroy().catch(() => undefined);
          }
        });
      }
      return task.promise;
    },
    /** Cancels document loading and releases its worker when this session ends. */
    dispose() {
      disposed = true;
      void task?.destroy().catch(() => undefined);
    },
  };
}

export type PdfSession = ReturnType<typeof createPdfSession>;
