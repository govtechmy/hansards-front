import type { GetServerSideProps } from "next";

// Allowed prefixes & extensions
const ALLOWED_PREFIXES = ["dewanrakyat", "dewannegara", "kamarkhas"] as const;
const ALLOWED_EXTS = ["pdf", "csv"] as const;

type AllowedPrefix = (typeof ALLOWED_PREFIXES)[number];
type AllowedExt = (typeof ALLOWED_EXTS)[number];

const mimeFromExt = (ext: AllowedExt): string =>
  ext === "pdf" ? "application/pdf" : "text/csv; charset=utf-8";

const parseFile = (file: string): { name: string; ext: AllowedExt } | null => {
  const match = /^([a-z0-9_\-]+)\.(pdf|csv)$/i.exec(file);
  if (!match) return null;
  const [, name, ext] = match;
  return { name, ext: ext.toLowerCase() as AllowedExt };
};

async function fetchPresignedUrl(key: string): Promise<string> {
  const base = process.env.API_URL;
  if (!base) throw new Error("API_URL not configured");
  const url = base.replace(/\/$/, "") + "/api/file/download";
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  const resp = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify({ key }),
  });
  const bodyText = await resp.text();
  if (!resp.ok) throw new Error(`Backend responded ${resp.status}`);
  let json: any = {};
  try {
    json = JSON.parse(bodyText);
  } catch {
    throw new Error("Invalid JSON from backend");
  }
  const presigned = json?.data?.url;
  if (!presigned || typeof presigned !== "string")
    throw new Error("Invalid backend response shape");
  return presigned;
}

export const getServerSideProps: GetServerSideProps = async ({
  params,
  res,
}) => {
  const parts = params?.key;
  if (!Array.isArray(parts) || parts.length !== 2) {
    res.statusCode = 400;
    res.setHeader("Content-Type", "application/json");
    res.end(
      JSON.stringify({ status: "ERROR", message: "Invalid download path" })
    );
    return { props: {} };
  }
  const [prefix, file] = parts;
  if (!ALLOWED_PREFIXES.includes(prefix as AllowedPrefix)) {
    res.statusCode = 400;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ status: "ERROR", message: "Invalid prefix" }));
    return { props: {} };
  }
  const parsed = parseFile(file);
  if (!parsed || !ALLOWED_EXTS.includes(parsed.ext)) {
    res.statusCode = 400;
    res.setHeader("Content-Type", "application/json");
    res.end(
      JSON.stringify({
        status: "ERROR",
        message: "Invalid filename or extension",
      })
    );
    return { props: {} };
  }
  const key = `${prefix}/${file}`;

  let presigned: string | undefined;
  try {
    presigned = await fetchPresignedUrl(key);
  } catch (e: any) {
    if (process.env.ENABLE_S3_FALLBACK === "1") {
      const legacyBase = process.env.NEXT_PUBLIC_DOWNLOAD_URL || "";
      res.statusCode = 302;
      res.setHeader("Location", `${legacyBase}${key}`);
      res.end();
      return { props: {} };
    }
    res.statusCode = 502;
    res.setHeader("Content-Type", "application/json");
    res.end(
      JSON.stringify({
        status: "ERROR",
        message: e.message || "Failed to fetch presigned URL",
      })
    );
    return { props: {} };
  }

  try {
    const fileResp = await fetch(presigned!);
    if (!fileResp.ok || !fileResp.body)
      throw new Error(`Failed to fetch object (${fileResp.status})`);
    res.statusCode = 200;
    res.setHeader("Content-Type", mimeFromExt(parsed.ext));
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${parsed.name}.${parsed.ext}"`
    );
    res.setHeader("X-Download-Key", key);
    const reader = fileResp.body.getReader();
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      res.write(Buffer.from(value));
    }
    res.end();
  } catch (e: any) {
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json");
    res.end(
      JSON.stringify({ status: "ERROR", message: e.message || "Stream error" })
    );
  }
  return { props: {} };
};

export default function DownloadProxy() {
  return null;
}
