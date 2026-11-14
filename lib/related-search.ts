import type { RelatedSearch } from "./types";

// A phrase wrapped in double quotes, e.g. "akta kanak-kanak".
// Same test as `isExactMatch` in dashboards/home/keyword/index.tsx.
const QUOTED_PHRASE = /^".+"$/;

/**
 * Decides whether the page should show the "Adakah anda maksudkan" chip.
 *
 * Every input is `unknown` on purpose: `q` comes from the URL and
 * `correctedQuery` comes from the backend, so neither is guaranteed to be a
 * string. Each rule below checks the type before using the value.
 *
 * Returns `null` (never `undefined`, Next.js cannot serialise `undefined`
 * props) when there is nothing to suggest.
 *
 * @param q What the user typed (`query.q`)
 * @param correctedQuery `corrected_query` from the `api/search/` response
 * @param exactSearch True when the URL has `tepat=1` (user rejected the suggestion)
 */
export function buildRelatedSearch(
  q: unknown,
  correctedQuery: unknown,
  exactSearch: boolean
): RelatedSearch | null {
  // The user asked for exactly what they typed: never suggest anything
  if (exactSearch) return null;

  // `q` must be a single string (it is an array if `?q=a&q=b`)
  if (typeof q !== "string") return null;
  const typed = q.trim();
  if (!typed) return null;

  // Quoted phrases already have their own exact-match behaviour
  if (QUOTED_PHRASE.test(typed)) return null;

  // "minyak subsidi:Ali" is the speaker syntax, not a misspelled word
  if (typed.includes(":")) return null;

  // The backend may omit the field, send null, a number, an object...
  if (typeof correctedQuery !== "string") return null;
  const corrected = correctedQuery.trim();
  if (!corrected) return null;

  // Same word with a different letter case is not a correction
  if (corrected.toLowerCase() === typed.toLowerCase()) return null;

  // `original` keeps `q` exactly as it is in the URL
  return { original: q, corrected };
}
