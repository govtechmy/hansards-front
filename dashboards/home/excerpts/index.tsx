import { DateCard, Section } from "@components/index";
import ExcerptList, {
  Excerpt,
} from "@dashboards/home/excerpts/excerpt-list-item";
import { useTranslation } from "@hooks/useTranslation";
import { ParsedUrlQuery } from "querystring";
import { Dewan } from "@lib/types";
import groupBy from "lodash/groupBy";
import Link from "next/link";
import { cn } from "@lib/helpers";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@components/MydsSelectFix/MydsSelectFix";
import { Tag } from "@components/Tag";
import { useEffect, useState, useRef } from "react";

export interface ExcerptsProps {
  count: number;
  excerpts: Excerpt[];
  name?: string;
  query: ParsedUrlQuery;
  variant?: "default";
}

const Excerpts = ({
  count: initialCount,
  excerpts,
  name,
  query,
}: ExcerptsProps) => {
  const { t, i18n } = useTranslation(["enum", "home"]);
  const { q, dewan } = query;

  const [currentPage, setCurrentPage] = useState(1);

  // ✅ NEW: store data per page
  const [pageDataMap, setPageDataMap] = useState<{ [page: number]: Excerpt[] }>(
    {
      1: excerpts ?? [],
    }
  );

  // cursor per page
  const [cursorMap, setCursorMap] = useState<{ [page: number]: string | null }>(
    {
      1: null,
    }
  );

  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [count, setCount] = useState(initialCount ?? 0);
  const [loading, setLoading] = useState(false);

  const hasInitialized = useRef(false);

  // ✅ CURRENT PAGE DATA
  const data = pageDataMap[currentPage] || [];

  // --------------------------
  // FETCH SINGLE PAGE
  // --------------------------
  const fetchPage = async (page: number) => {
    setLoading(true);

    try {
      const params = new URLSearchParams();
      if (q) params.append("q", String(q));

      const cursor = cursorMap[page];
      if (cursor) params.append("cursor", cursor);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/search?${params.toString()}`
      );

      const json = await res.json();

      // ✅ store per page
      setPageDataMap(prev => ({
        ...prev,
        [page]: json.results,
      }));

      if (json.next_cursor) {
        setCursorMap(prev => ({
          ...prev,
          [page + 1]: json.next_cursor,
        }));
      }

      setNextCursor(json.next_cursor ?? null);

      if (typeof json.count === "number") {
        setCount(json.count);
      }

      setCurrentPage(page);
    } finally {
      setLoading(false);
    }
  };

  // --------------------------
  // NAVIGATION
  // --------------------------

  const prefetchNextBatch = async (startPage: number) => {
    let cursor = cursorMap[startPage];

    for (let i = startPage; i < startPage + 5; i++) {
      if (!cursor) break;

      const params = new URLSearchParams();
      if (q) params.append("q", String(q));
      params.append("cursor", cursor);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/search?${params.toString()}`
      );

      if (!res.ok) break;

      const json = await res.json();

      setPageDataMap(prev => ({
        ...prev,
        [i]: json.results,
      }));

      setCursorMap(prev => ({
        ...prev,
        [i]: cursor,
        [i + 1]: json.next_cursor,
      }));

      cursor = json.next_cursor;

      setNextCursor(cursor);

      if (!cursor) break;
    }
  };

  const goToPage = async (page: number) => {
    // if already cached → instant
    if (pageDataMap[page]) {
      setCurrentPage(page);

      // 🔥 trigger next batch if at boundary (5, 10, 15...)
      if (page % 5 === 0) {
        prefetchNextBatch(page + 1);
      }

      return;
    }

    // fallback fetch
    if (cursorMap[page] !== undefined) {
      await fetchPage(page);

      // 🔥 also trigger batch after fetch
      if (page % 5 === 0) {
        prefetchNextBatch(page + 1);
      }
    }
  };

  // --------------------------
  // INIT BATCH (1–5 pages)
  // --------------------------
  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    const init = async () => {
      let cursor: string | null = null;

      for (let i = 1; i <= 5; i++) {
        const params = new URLSearchParams();
        if (q) params.append("q", String(q));
        if (cursor) params.append("cursor", cursor);

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/search?${params.toString()}`
        );

        const json = await res.json();

        // ✅ store each page
        setPageDataMap(prev => ({
          ...prev,
          [i]: json.results,
        }));

        setCursorMap(prev => ({
          ...prev,
          [i]: cursor,
          [i + 1]: json.next_cursor,
        }));

        cursor = json.next_cursor;
        setNextCursor(cursor);

        if (typeof json.count === "number") {
          setCount(json.count);
        }

        if (!cursor) break;
      }
    };

    init();
  }, []);

  // pagination window
  const startPage = Math.floor((currentPage - 1) / 5) * 5 + 1;
  const pages = Array.from({ length: 5 }, (_, i) => startPage + i);

  const HOUSE_TO_DEWAN: Record<number, string> = {
    0: "dewan-rakyat",
    1: "dewan-negara",
    2: "kamar-khas",
  };

  const excerptsByDate = groupBy(data, "sitting.date");

  return (
    <Section className="space-y-6 lg:space-y-8">
      <h2 className="header">{t("home:excerpts", { count })}</h2>

      {loading && <div className="py-4 text-center">Loading...</div>}

      <ul className="flex flex-col divide-otl-gray-200 sm:divide-y">
        {Object.keys(excerptsByDate).map(date => {
          const excerpt = excerptsByDate[date];
          const sitting = excerpt[0].sitting;

          const dewanKey =
            HOUSE_TO_DEWAN[sitting.house ?? 0] ?? (dewan as string);

          return (
            <li key={date} className="flex flex-col gap-3 py-4.5 lg:flex-row">
              <div className="flex items-center">
                <Link
                  href={`hansard/${dewanKey}/${sitting.date}?search=${q}`}
                  className="flex items-center gap-3"
                >
                  <DateCard date={date} size="sm" />
                </Link>
              </div>

              <div className="flex w-full flex-col divide-y rounded-xl border">
                {excerpt
                  .sort((a, b) => a.index - b.index)
                  .map((ex, i) => (
                    <ExcerptList
                      key={i}
                      dewan={(dewan ?? "dewan-rakyat") as Dewan}
                      excerpt={ex}
                      keyword={String(q)}
                    />
                  ))}
              </div>
            </li>
          );
        })}
      </ul>

      {/* PAGINATION */}
      {/* PAGINATION */}
      <div className="text-sm text-gray-500">
        About {count.toLocaleString()} results • Page {currentPage} of ~
        {Math.ceil(count / 10)}
      </div>
      <div className="shadow-sm flex items-center gap-2 rounded-lg border border-otl-gray-200 bg-white p-2">
        {/* Previous */}
        <button
          className={cn(
            "rounded-md border px-3 py-2 text-sm font-medium transition",
            currentPage === 1 || loading
              ? "cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400"
              : "border-otl-gray-200 bg-white text-gray-700 hover:bg-gray-100"
          )}
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1 || loading}
        >
          Previous
        </button>

        {/* Page numbers */}
        <div className="flex items-center gap-2">
          {pages.map(page => {
            const isKnown = page in cursorMap;

            return (
              <button
                key={page}
                className={cn(
                  "flex h-9 min-w-[36px] items-center justify-center rounded-md border text-sm font-medium transition",

                  // ACTIVE
                  page === currentPage &&
                    "shadow-sm border-[#DDD6B0] bg-[#DDD6B0] text-black",

                  // CLICKABLE
                  page !== currentPage &&
                    isKnown &&
                    "border-otl-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-100",

                  // DISABLED
                  !isKnown &&
                    "cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400"
                )}
                onClick={() => goToPage(page)}
                disabled={!isKnown || loading}
              >
                {page}
              </button>
            );
          })}
        </div>

        {/* Next */}
        <button
          className={cn(
            "rounded-md border px-3 py-2 text-sm font-medium transition",
            loading || nextCursor === null
              ? "cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400"
              : "border-otl-gray-200 bg-white text-gray-700 hover:bg-gray-100"
          )}
          onClick={() => goToPage(currentPage + 1)}
          disabled={loading || nextCursor === null}
        >
          Next
        </button>
      </div>
    </Section>
  );
};

export default Excerpts;
