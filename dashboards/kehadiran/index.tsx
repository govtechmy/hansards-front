import Barmeter, { KehadiranBarMeterProps } from "./kehadiran-barmeter";
import KehadiranDropdown, {
  KehadiranDropdownProps,
} from "./kehadiran-dropdown";
import KehadiranTable, { KehadiranTableProps } from "./kehadiran-table";
import { useData } from "@hooks/useData";
import { useTranslation } from "@hooks/useTranslation";
import { useRouter } from "next/router";
import { useEffect } from "react";

/**
 * Kehadiran Dashboard
 * @overview Status: In-development
 */

const KehadiranDashboard = ({
  barmeter,
  dropdown,
  individual,
  party,
  params,
}: Omit<KehadiranBarMeterProps, "loading"> &
  KehadiranDropdownProps &
  Omit<KehadiranTableProps, "loading">) => {
  const { t } = useTranslation(["kehadiran", "enum"]);
  const { events } = useRouter();
  const { data, setData } = useData({
    loading: false,
  });

  useEffect(() => {
    events.on("routeChangeComplete", () => {
      setData("loading", false);
    });
    return () => {
      events.off("routeChangeComplete", () => {
        setData("loading", false);
      });
    };
  }, []);

  return (
    <>
      <div className="flex h-full w-full justify-center">
        <div className="flex flex-col h-full w-full max-w-screen-2xl px-3 md:px-4.5 lg:px-6 xl:px-0 py-8 lg:py-12 xl:grid xl:grid-cols-12">
          <div className="xl:col-span-10 xl:col-start-2">
            <section>
              <h4 className="text-center">{t("header")}</h4>

              <KehadiranDropdown dropdown={dropdown} params={params} />

              {/* Individual/Party Attendance */}
              <KehadiranTable
                individual={individual}
                loading={data.loading}
                party={party}
              />
            </section>

            {/* A breakdown of attendance by key demographics */}
            <Barmeter barmeter={barmeter} loading={data.loading} />

            <p className="text-zinc-500 text-center">{t("disclaimer")}</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default KehadiranDashboard;
