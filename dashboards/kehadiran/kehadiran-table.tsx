import BarPerc from "@charts/bar-perc";
import PartyFlag from "@components/PartyFlag";
import Search from "@components/Search";
import Skeleton from "@components/Skeleton";
import Tabs, { Panel } from "@components/Tabs";
import { FlagIcon, UserIcon } from "@heroicons/react/20/solid";
import { useTranslation } from "@hooks/useTranslation";
import { numFormat } from "@lib/helpers";
import dynamic from "next/dynamic";
import { useState } from "react";

/**
 * Kehadiran - Table
 * @overview Status: In-development
 */

const Table = dynamic(() => import("@charts/table"), {
  loading: () => <Skeleton height="h-[550px]" width="w-auto" />,
  ssr: false,
});

type Kehadiran = {
  party: string;
  total_attended: number;
  attendance_pct: number;
  total: number;
};
type Individual = Kehadiran & {
  rank: number;
  name: string;
  area: string;
  age: number;
  age_group: string;
  sex: string;
  ethnicity: string;
};
type Party = Kehadiran & {
  total_seats: number;
};

export interface KehadiranTableProps {
  loading: boolean;
  individual: Individual[];
  party: Party[];
}

const KehadiranTable = ({
  individual,
  loading,
  party,
}: KehadiranTableProps) => {
  const { t } = useTranslation("kehadiran");
  const [tab_idx, setTabIdx] = useState<number>(0);

  const kehadiranPerc = (value: Kehadiran) => (
    <div className="flex items-center gap-2 md:flex-col md:items-start lg:flex-row lg:items-center">
      <div>
        <BarPerc hidden value={value.attendance_pct} />
      </div>
      <p className="whitespace-nowrap">{`${value.total_attended} / ${
        value.total
      } ${
        value.attendance_pct !== null
          ? ` (${numFormat(value.attendance_pct, "compact", 1)}%)`
          : " (—)"
      }`}</p>
    </div>
  );

  return (
    <Tabs
      title={
        <h5>
          {t("kehadiran", {
            context: tab_idx === 0 ? "ind" : "parti",
          })}
        </h5>
      }
      current={tab_idx}
      onChange={(index) => setTabIdx(index)}
      className="pb-6"
    >
      <Panel name={t("individu")} icon={<UserIcon className="mr-1 h-5 w-5" />}>
        {loading ? (
          <Skeleton height="h-[550px]" width="w-auto" />
        ) : (
          <Table
            className="text-sm"
            config={[
              {
                accessorKey: "rank",
                header: "#",
                className: "text-left",
              },
              {
                accessorKey: "attendance_pct",
                header: t("kehadiran"),
                className: "min-w-[180px]",
                cell: ({ row }) => kehadiranPerc(row.original),
              },
              {
                accessorFn: (row) => `[${row.area}] ${row.name}`,
                id: "name",
                header: t("name"),
                className: "truncate min-w-[320px] max-w-[360px]",
              },
              {
                accessorKey: "party",
                header: t("party"),
                className: "min-w-[240px] max-w-[240px]",
                cell: ({ getValue }) => <PartyFlag value={getValue()} />,
              },
              {
                accessorKey: "age",
                header: t("age"),
                className: "text-left",
              },
              {
                accessorKey: "sex",
                header: t("sex"),
                cell: ({ getValue }) => <>{t(getValue())}</>,
              },
              {
                accessorKey: "ethnicity",
                header: t("ethnicity"),
                className: "min-w-[160px]",
                cell: ({ getValue }) => <>{t(getValue())}</>,
              },
            ]}
            search={(onSearch) => (
              <Search
                className="w-full border-b lg:w-[300px]"
                onChange={(event) => onSearch(event.target.value ?? "")}
              />
            )}
            data={individual}
            enablePagination={10}
          />
        )}
      </Panel>
      <Panel
        name={t("party")}
        icon={<FlagIcon key="map_icon" className="mr-1 h-5 w-5" />}
      >
        {loading ? (
          <Skeleton height="h-[300px]" width="w-auto" />
        ) : (
          <Table
            className="text-sm"
            config={[
              {
                accessorKey: "party",
                header: t("party"),
                className: "min-w-[240px] max-w-[300px]",
                cell: ({ getValue }) => <PartyFlag value={getValue()} />,
              },
              {
                accessorKey: "attendance_pct",
                header: t("kehadiran"),
                className: "min-w-[180px]",
                cell: ({ row }) => kehadiranPerc(row.original),
              },
              {
                accessorKey: "total_seats",
                header: t("total_seats"),
                className: "w-[150px]",
              },
            ]}
            search={(onSearch) => (
              <Search
                className="w-full border-b lg:w-[300px]"
                onChange={(event) => onSearch(event.target.value ?? "")}
              />
            )}
            data={party}
          />
        )}
      </Panel>
    </Tabs>
  );
};

export default KehadiranTable;