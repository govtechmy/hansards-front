import { endOfMonth } from "date-fns";

/**
 * Label tarikh bar graf daripada `api/search-plot/` (hansard-mod-api,
 * `resampleSeries` dalam `src/utils/time/period.util.ts`):
 *
 * - `"yyyy-MM"` apabila backend mengumpul ikut bulan (tempoh 1095 hari atau
 *   lebih, peraturan `isMonthlyResample` backend);
 * - `"yyyy-MM-dd"` apabila ikut hari.
 *
 * Bentuk label itu sendiri menentukan sama ada satu bar ialah sebulan atau
 * sehari. Frontend tidak meneka daripada `tarikh_mula` dan `tarikh_akhir`,
 * kerana tanpa tarikh dalam URL backend memakai tarikh mula lalainya sendiri
 * (`deriveDefaultStartDateDR`) yang frontend tidak tahu.
 */
const MONTH_LABEL = /^(\d{4})-(\d{2})$/;
const DAY_LABEL = /^(\d{4})-(\d{2})-(\d{2})$/;

export type BarPeriod = { from: Date; to: Date };

/**
 * Tempoh yang diwakili oleh satu bar graf.
 *
 * Tarikh dibina dalam waktu tempatan dengan sengaja (`new Date(y, m, d)`,
 * bukan `new Date("2024-03-01")` yang dibaca sebagai UTC), supaya
 * `format(..., "yyyy-MM-dd")` memulangkan tarikh yang sama dengan label.
 *
 * @param label Label paksi-x bar yang diklik
 * @returns `{ from, to }`, atau `null` jika label bukan tarikh yang dikenali
 */
export function barPeriod(label: unknown): BarPeriod | null {
  if (typeof label !== "string") return null;

  const month = MONTH_LABEL.exec(label);
  if (month) {
    const from = new Date(Number(month[1]), Number(month[2]) - 1, 1);
    if (from.getMonth() !== Number(month[2]) - 1) return null;
    return { from, to: endOfMonth(from) };
  }

  const day = DAY_LABEL.exec(label);
  if (day) {
    const date = new Date(Number(day[1]), Number(day[2]) - 1, Number(day[3]));
    // Tolak tarikh mustahil seperti 2024-02-31 (Date akan melimpah ke Mac)
    if (date.getDate() !== Number(day[3])) return null;
    return { from: date, to: date };
  }

  return null;
}

/**
 * Siri dikumpul ikut bulan jika label pertamanya `"yyyy-MM"`. Digunakan untuk
 * paksi carta dan slider supaya sepadan dengan bentuk data sebenar.
 */
export const isMonthlySeries = (dates: ReadonlyArray<unknown>): boolean =>
  typeof dates[0] === "string" && MONTH_LABEL.test(dates[0]);
