import { Sitting } from "@lib/types";

/**
 * Tag sitting (tugasan B: Majlis Angkat Sumpah)
 *
 * KONTRAK SEMENTARA, UBAH MENGIKUT FID.
 *
 * API tagging Fid (dijadualkan 5 hingga 6 Nov 2026) belum mendarat semasa fail
 * ini ditulis, jadi bentuk data tag masih andaian. Semua andaian itu terkumpul
 * di sini sahaja: bila kontrak sebenar diketahui, biasanya cukup dengan
 * mengubah `OATH_TAG_ALIASES` atau `sittingTags()` tanpa menyentuh komponen UI.
 *
 * Andaian semasa: setiap sitting dalam `catalogue_list` boleh membawa medan
 * `tags`, sama ada satu string atau senarai string.
 *
 * Nota skop: keputusan team (13 Nov 2026) ialah **label sahaja**, tiada
 * penapis di halaman katalog, walaupun timeline asal menyebut "tagging dan
 * filter". Lihat `docs/rancangan-kerja-liza.md` bahagian 2 dan 3.
 */

/** Bentuk kanonik tag Majlis Angkat Sumpah selepas diseragamkan. */
export const OATH_TAG = "majlis_angkat_sumpah";

/**
 * Variasi yang kita terima sebagai Majlis Angkat Sumpah. Teks rasmi yang
 * diputuskan ialah "Majlis Angkat Sumpah", tetapi timeline dan deck pernah
 * menggunakan "Majlis Mengangkat Sumpah", jadi kedua-duanya diterima supaya
 * pilihan perkataan Fid di backend tidak mematahkan paparan.
 */
const OATH_TAG_ALIASES = new Set([
  OATH_TAG,
  "majlis_mengangkat_sumpah",
  "angkat_sumpah",
  "mengangkat_sumpah",
  "oath",
  "oath_taking",
  "oath_taking_ceremony",
]);

/**
 * Seragamkan satu tag supaya perbandingan tidak terjejas oleh huruf besar
 * kecil, ruang, sengkang atau garis bawah. Contoh: "Majlis Angkat Sumpah",
 * "majlis-angkat-sumpah" dan "MAJLIS_ANGKAT_SUMPAH" semuanya menjadi
 * "majlis_angkat_sumpah".
 */
const normalise = (tag: string): string =>
  tag
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");

/**
 * Baca senarai tag sitting dengan selamat. Memulangkan senarai kosong untuk
 * apa-apa yang bukan string atau senarai string, termasuk `undefined` dan
 * `null`, supaya respons lama (tanpa medan `tags`) tidak mematahkan apa-apa.
 */
export const sittingTags = (sitting: Pick<Sitting, "tags">): string[] => {
  const raw = sitting.tags;
  if (typeof raw === "string") {
    const tag = raw.trim();
    return tag ? [tag] : [];
  }
  if (Array.isArray(raw))
    return raw.filter(
      (tag): tag is string => typeof tag === "string" && tag.trim().length > 0
    );
  return [];
};

/**
 * Adakah sitting ini sebuah Majlis Angkat Sumpah?
 */
export const isOathCeremony = (sitting: Pick<Sitting, "tags">): boolean =>
  sittingTags(sitting).some(tag => OATH_TAG_ALIASES.has(normalise(tag)));
