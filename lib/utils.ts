import { Heading, NestedSpeech, Speech } from "./types";

export const isValidUrl = (url: string) => {
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
};

export const getDomainWithoutWWW = (url: string) => {
  if (isValidUrl(url)) {
    return new URL(url).hostname.replace(/^www\./, "");
  }
  try {
    if (url.includes(".") && !url.includes(" ")) {
      return new URL(`https://${url}`).hostname.replace(/^www\./, "");
    }
  } catch (e) {
    return null;
  }
};

export function capitalize(str: string) {
  if (!str || typeof str !== "string") return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function assertFulfilled<T>(
  item: PromiseSettledResult<T>
): item is PromiseFulfilledResult<T> {
  return item.status === "fulfilled";
}

export const isYDP = (author: string) =>
  [
    "Seri Paduka Baginda Yang di-Pertuan Agong",
    "Tuan Yang di-Pertua",
    "Timbalan Yang di-Pertua",
    "Tuan Pengerusi",
  ].some(ydp => author.includes(ydp));

export function formatTimestamp(timestamp: number) {
  const timestring = String(timestamp);
  function formatAMPM(hrs: number, min: string) {
    const ampm = hrs >= 12 ? " PM" : " AM";
    const hours = hrs % 12 ? hrs % 12 : 12; // hour '0' should be '12'
    return hours + ":" + min + ampm;
  }

  const formatted_timestamp = formatAMPM(
    Number(timestring.slice(0, 2)),
    timestring.slice(2)
  );
  return formatted_timestamp;
}

const getQueryString = (url: string) => {
  const hash_idx = url.lastIndexOf("#");
  const q_mark_idx = url.indexOf("?");

  let query_str = url;
  const hasHash = hash_idx > -1;
  if (hasHash) query_str = query_str.slice(0, hash_idx);

  const hasQMark = q_mark_idx > -1;
  if (hasQMark) query_str = query_str.slice(q_mark_idx);
  else query_str = "";

  return query_str;
};

export const setSearchParams = (
  url: string,
  params: Record<string, string | null>
) => {
  const query_str = getQueryString(url);
  const searchParams = new URLSearchParams(query_str);

  Object.keys(params).map(key => {
    const value = params[key];
    if (value) searchParams.set(key, value);
    else searchParams.delete(key);
  });

  return "?" + searchParams.toString();
};

export function isSpeech(speech: Speech | NestedSpeech): speech is Speech {
  const keys = Object.keys(speech);
  return (
    keys.includes("speech") &&
    keys.includes("author") &&
    keys.includes("timestamp")
  );
}
