# Hansard PDF viewer: architecture and performance notes

This document records the decisions and recommendations for the split PDF viewer so they can be reviewed later.

## Current architecture

The Hansard transcript remains server-rendered by Next.js. The PDF viewer is loaded only in the browser with `ssr: false`, because PDF.js needs browser APIs, a canvas, and a worker.

The current flow is:

1. The transcript and search result are rendered first.
2. The desktop-only **Buka PDF** button opens the split view.
3. The viewer loads one PDF document through `/api/pdf`.
4. The API validates the filename and forwards HTTP byte-range requests to the PDF storage service.
5. The default view renders one PDF page, selected from the speech hash and `pdf_page_start`.
6. **Lihat semua** makes all page positions scrollable, while `IntersectionObserver` renders only pages near the viewport.
7. Zoom and page changes reuse the same PDF document session.

Relevant files:

- [`data-catalogue/hansard/hansard.tsx`](../data-catalogue/hansard/hansard.tsx)
- [`data-catalogue/hansard/pdf-viewer.tsx`](../data-catalogue/hansard/pdf-viewer.tsx)
- [`data-catalogue/hansard/pdf-session.ts`](../data-catalogue/hansard/pdf-session.ts)
- [`pages/api/pdf.ts`](../pages/api/pdf.ts)

## Prefetch decision

The viewer uses conservative prefetching. It does not automatically fetch PDF data when the Hansard page opens. Prefetch starts when the user hovers over the PDF button or focuses it with the keyboard.

The prefetch dynamically loads the viewer module, reuses the existing PDF session, and prepares the page linked by the current hash. Clicking immediately after page load may therefore show a short loading state, but users who show intent to open the PDF usually get a faster response.

This is a small performance tradeoff:

| Choice                     | Benefit                                  | Cost                                              |
| -------------------------- | ---------------------------------------- | ------------------------------------------------- |
| Idle prefetch on page load | Faster first click                       | Uses bandwidth even when the user never opens PDF |
| Hover/focus prefetch       | Lower bandwidth and less background work | Immediate clicks may wait for loading             |
| No prefetch                | Lowest background work                   | Every first open waits for document loading       |

Hover/focus prefetch is the recommended default for this application because it keeps the page lightweight while still improving perceived speed.

## Why not prerender 1,000 pages in the browser?

Do not render all 1,000 pages into canvases or DOM nodes. That creates high CPU, memory, and GPU pressure, can freeze the tab, and is especially risky on mobile devices.

Client-side PDF rendering is still appropriate when it is demand-driven. The important distinction is:

- **Bad:** mount and render every page immediately.
- **Good:** load the document once, render the current page, and render nearby pages only when they approach the viewport.

SSR and PDF rendering solve different problems. SSR delivers the transcript shell, metadata, and searchable content quickly. PDF.js then renders the selected PDF page in the browser. The hybrid model is appropriate.

## Comparison with a larger-scale alternative

The alternative process recommends SSR plus client virtualization, range requests, CDN delivery, PDF linearization, and optional pre-generated page images.

| Area                 | Current implementation                     | Larger-scale alternative                        | Guidance                                                    |
| -------------------- | ------------------------------------------ | ----------------------------------------------- | ----------------------------------------------------------- |
| Initial page         | SSR transcript; PDF opens on demand        | SSR shell plus client viewer                    | Keep current approach                                       |
| Page rendering       | One page by default; nearby pages are lazy | Virtualized list with a small mounted window    | Add full virtualization only after measurement shows a need |
| PDF delivery         | Same-origin Next.js range proxy            | Direct CDN/object-storage URL                   | Consider later if proxy bandwidth or latency is a problem   |
| File structure       | Existing PDFs                              | Linearized PDFs using Fast Web View             | Benchmark a linearized copy                                 |
| Scanned pages        | PDF canvas rendering                       | Pre-generated WebP/PNG pages                    | Consider only if scanned PDFs render poorly at scale        |
| Search/accessibility | Transcript remains HTML                    | Images need a separate text/accessibility layer | Keep transcript as the authoritative searchable view        |

The current lazy renderer already addresses most of the risk described for large documents. Full virtualization would reduce placeholder and observer overhead, but adds complexity around variable page heights, zoom, page jumps, and scroll restoration.

## HTTP range request behavior

Seeing multiple `/api/pdf` requests is expected. A PDF is one file, but the data needed for its pages may be stored at different byte offsets. PDF.js requests those ranges as the user opens or scrolls through pages.

Inspect the browser Network panel:

| Observation                                                | Interpretation                                                                |
| ---------------------------------------------------------- | ----------------------------------------------------------------------------- |
| `206 Partial Content` with different `Range` values        | Expected page/chunk loading                                                   |
| Repeated `200` responses transferring the whole file       | Range support is not working; investigate the storage service or proxy        |
| The same byte ranges repeatedly transferred in one session | Investigate session resets, failed requests, cache headers, or route remounts |

The current PDF.js options are:

```ts
const singlePageOptions = {
  disableAutoFetch: true,
  disableStream: true,
};
```

Using both options is intentional. PDF.js documents that disabling automatic fetching requires disabling streaming as well. This makes loading more demand-driven when the server supports range requests.

## PDF linearization

Linearization, also called Fast Web View, reorganizes a PDF so important data for early access is placed near the beginning of the file. It can improve first-page access, but it is not a guarantee of instant loading, especially when opening an arbitrary page from a hash.

Benchmark it on representative files before adding it to the publishing pipeline:

```bash
qpdf --linearize input.pdf linearized.pdf
```

The output must be checked for visual fidelity, text extraction, page count, range behavior, and file-size changes.

## CDN and storage considerations

The current `/api/pdf` proxy is useful because it keeps the browser request same-origin and centralizes filename validation. A direct CDN or object-storage URL may reduce application-server bandwidth and latency, but requires:

- CORS configuration;
- support for `Range` and `206 Partial Content`;
- correct `Content-Length`, `Content-Range`, and `Accept-Ranges` headers;
- cache policy for public or restricted PDFs;
- access control and URL expiry if documents are not public.

Do not move to direct storage solely because it sounds faster. Measure proxy response time, server bandwidth, cache hit rate, and browser transfer sizes first.

## Production checklist

Before calling the viewer production-ready, verify:

- Desktop split view is disabled on mobile.
- The initial open follows the current `#index`/`pdf_page_start` mapping.
- Closing and reopening keeps the current document session and PDF position.
- Changing Hansard dates resets the document session and does not leave an empty split pane.
- A failed load can be retried without a full route reload.
- A failed zoom or redraw shows a visible error instead of a stale hidden layer.
- Network responses use byte ranges where supported.
- The local PDF.js worker matches the installed PDF.js version.
- Large scanned PDFs are tested at normal zoom and 150–200% zoom.
- Memory and scroll performance are measured on a representative 500–1,000 page document.
- A production build and a live PDF storage request are tested; local tests cannot prove upstream range behavior.

## Recommendation

Keep the current SSR transcript plus client-side, one-page/lazy PDF viewer. Keep hover/focus prefetch because it is a low-impact optimization with less unnecessary network work than idle prefetch.

Only add full list virtualization, direct CDN delivery, pre-generated images, or a PDF conversion pipeline after measurements show that the current implementation is too slow or uses too much memory. Those options are valid scaling paths, but they are not necessary merely because a document can contain 1,000 pages.

References:

- [PDF.js API: document loading and range options](https://mozilla.github.io/pdf.js/api/draft/module-pdfjsLib.html)
- [PDF.js FAQ](https://github.com/mozilla/pdf.js/wiki/Frequently-Asked-Questions)
- [qpdf linearization documentation](https://qpdf.readthedocs.io/en/stable/cli.html#option-linearize)
