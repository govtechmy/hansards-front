import { GetServerSideProps } from "next";
import { useEffect, useMemo, useState } from "react";

type EnvStatus = { key: string; isSet: boolean; length?: number };

const PUBLIC_KEYS = [
  "NEXT_PUBLIC_APP_URL",
  "NEXT_PUBLIC_APP_ENV",
  "NEXT_PUBLIC_DOWNLOAD_URL",
  "NEXT_PUBLIC_SEJARAH_URL",
  "NEXT_PUBLIC_TILESERVER_URL",
  "NEXT_PUBLIC_GA_TAG",
  "NEXT_PUBLIC_ASSETS_URL",
] as const;

const SERVER_KEYS = [
  "API_URL",
  "API_AUTH_TOKEN",
  "REVALIDATE_TOKEN",
  "AUTH_TOKEN",
  "CLOUDFLARE_APP_URL",
  "CLOUDFLARE_ZONE_ID",
  "GET_TOKEN",
  "POST_TOKEN",
  "GET_COUNTS",
  "POST_VIEW",
  "POST_SHARE",
  "POST_DL",
  "ENABLE_S3_FALLBACK",
  "ANALYZE",
  "NEXT_OUTPUT",
] as const;

const StatusBadge = ({ ok }: { ok: boolean }) => (
  <span
    className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
      ok
        ? "bg-green-50 text-green-700 ring-1 ring-green-200"
        : "bg-red-50 text-red-700 ring-1 ring-red-200"
    }`}
  >
    {ok ? "set" : "missing"}
  </span>
);

type Props = {
  publicStatus: EnvStatus[];
  serverStatus: EnvStatus[];
  appEnv?: string;
};

export default function EnvCheckPage({
  publicStatus,
  serverStatus,
  appEnv,
}: Props) {
  const [clientStatus, setClientStatus] = useState<Record<string, boolean>>(
    () => {
      const initial: Record<string, boolean> = {};
      PUBLIC_KEYS.forEach(key => {
        // Seed client status with server-observed value to avoid hydration mismatch
        const found = publicStatus.find(s => s.key === key)?.isSet ?? false;
        initial[key] = found;
      });
      return initial;
    }
  );

  useEffect(() => {
    const next: Record<string, boolean> = {};
    PUBLIC_KEYS.forEach(key => {
      const val = (process.env as Record<string, string | undefined>)[key];
      next[key] = Boolean(val);
    });
    setClientStatus(next);
  }, []);

  const publicMap = useMemo(
    () => Object.fromEntries(publicStatus.map(s => [s.key, s])),
    [publicStatus]
  );
  const serverMap = useMemo(
    () => Object.fromEntries(serverStatus.map(s => [s.key, s])),
    [serverStatus]
  );

  return (
    <div className="mx-auto max-w-6xl p-6">
      <div className="mb-6 space-y-2">
        <h1 className="text-2xl font-semibold">Environment Check</h1>
        <p className="text-sm text-gray-600">
          Shows whether known environment keys are present. Values are not
          displayed; only presence is reported. Client bundle check confirms
          NEXT_PUBLIC variables were inlined at build time.
        </p>
        {appEnv && (
          <p className="text-xs text-gray-500">
            Current app env: <span className="font-mono">{appEnv}</span>
          </p>
        )}
      </div>

      <section className="mb-8 rounded-lg border p-4">
        <h2 className="mb-3 text-lg font-semibold">Public (NEXT_PUBLIC_*)</h2>
        <div className="overflow-auto">
          <table className="min-w-full text-sm">
            <thead className="text-left text-xs uppercase text-gray-500">
              <tr>
                <th className="py-2 pr-4">Key</th>
                <th className="py-2 pr-4">Server (build/SSR)</th>
                <th className="py-2 pr-4">Client bundle</th>
                <th className="py-2 pr-4">Value length</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {PUBLIC_KEYS.map(key => {
                const server = publicMap[key];
                const client = clientStatus[key];
                return (
                  <tr key={key} className="align-middle">
                    <td className="py-2 pr-4 font-mono text-xs">{key}</td>
                    <td className="py-2 pr-4">
                      <StatusBadge ok={Boolean(server?.isSet)} />
                    </td>
                    <td className="py-2 pr-4">
                      <StatusBadge ok={Boolean(client)} />
                    </td>
                    <td className="py-2 pr-4 text-gray-600">
                      {server?.isSet ? (server?.length ?? 0) : "-"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-lg border p-4">
        <h2 className="mb-3 text-lg font-semibold">Server-only</h2>
        <div className="overflow-auto">
          <table className="min-w-full text-sm">
            <thead className="text-left text-xs uppercase text-gray-500">
              <tr>
                <th className="py-2 pr-4">Key</th>
                <th className="py-2 pr-4">Server (build/SSR)</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {SERVER_KEYS.map(key => {
                const server = serverMap[key];
                return (
                  <tr key={key} className="align-middle">
                    <td className="py-2 pr-4 font-mono text-xs">{key}</td>
                    <td className="py-2 pr-4">
                      <StatusBadge ok={Boolean(server?.isSet)} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps<Props> = async () => {
  const publicStatus: EnvStatus[] = PUBLIC_KEYS.map(key => {
    const val = process.env[key];
    return { key, isSet: Boolean(val), length: val ? val.length : 0 };
  });

  const serverStatus: EnvStatus[] = SERVER_KEYS.map(key => ({
    key,
    isSet: Boolean(process.env[key]),
  }));

  return {
    props: {
      publicStatus,
      serverStatus,
      appEnv: process.env.NEXT_PUBLIC_APP_ENV,
    },
  };
};
