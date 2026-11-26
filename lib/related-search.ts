import type { RelatedSearch } from "./types";

// A phrase wrapped in double quotes, e.g. "akta kanak-kanak".
// Same test as `isExactMatch` in dashboards/home/keyword/index.tsx.
const QUOTED_PHRASE = /^".+"$/;

// Had `q` pada skema `searchSuggestionQuerySchema` backend (hansard-mod-api,
// `z.string().trim().min(1).max(200)`). Lebih daripada ini backend memulangkan
// 400, jadi kita tidak memanggilnya langsung.
const SUGGESTION_MAX_LENGTH = 200;

/**
 * Menentukan sama ada `api/search/suggestion` patut dipanggil untuk `q` ini.
 *
 * Peraturan ini dipisahkan daripada `buildRelatedSearch` supaya pelayan tidak
 * membuat panggilan tambahan (dan menunggu) apabila cadangan pasti tidak akan
 * dipaparkan. Backend sebenar tidak melaksanakan peraturan ini sendiri:
 * `/search/suggestion` akan "membetulkan" teks dalam petikan dan sintaks `:`.
 *
 * @param q What the user typed (`query.q`)
 * @param exactSearch True when the URL has `tepat=1` (user rejected the suggestion)
 * @returns `q` yang sudah di-trim jika boleh dicadangkan, atau `null`
 */
export function suggestableQuery(
  q: unknown,
  exactSearch: boolean
): string | null {
  // The user asked for exactly what they typed: never suggest anything
  if (exactSearch) return null;

  // `q` must be a single string (it is an array if `?q=a&q=b`)
  if (typeof q !== "string") return null;
  const typed = q.trim();
  if (!typed || typed.length > SUGGESTION_MAX_LENGTH) return null;

  // Quoted phrases already have their own exact-match behaviour
  if (QUOTED_PHRASE.test(typed)) return null;

  // "minyak subsidi:Ali" is the speaker syntax, not a misspelled word
  if (typed.includes(":")) return null;

  return typed;
}

/**
 * Decides whether the page should show the "Adakah anda maksudkan" chip.
 *
 * Every input is `unknown` on purpose: `q` comes from the URL and
 * `didYouMean` comes from the backend, so neither is guaranteed to be a
 * string. Each rule below checks the type before using the value.
 *
 * Returns `null` (never `undefined`, Next.js cannot serialise `undefined`
 * props) when there is nothing to suggest.
 *
 * @param q What the user typed (`query.q`)
 * @param didYouMean `did_you_mean` from the `api/search/suggestion` response
 * @param exactSearch True when the URL has `tepat=1` (user rejected the suggestion)
 */
export function buildRelatedSearch(
  q: unknown,
  didYouMean: unknown,
  exactSearch: boolean
): RelatedSearch | null {
  const typed = suggestableQuery(q, exactSearch);
  if (typed === null) return null;

  // The backend may omit the field, send null, a number, an object...
  if (typeof didYouMean !== "string") return null;
  const corrected = didYouMean.trim();
  if (!corrected) return null;

  // Same word with a different letter case is not a correction. Backend
  // memulangkan `did_you_mean` dalam huruf kecil, jadi semakan ini penting.
  if (corrected.toLowerCase() === typed.toLowerCase()) return null;

  // `original` keeps `q` exactly as it is in the URL
  return { original: q as string, corrected };
}
