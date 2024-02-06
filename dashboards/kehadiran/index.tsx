import Barmeter, { KehadiranBarMeterProps } from "./kehadiran-barmeter";
import KehadiranDropdown, {
  KehadiranDropdownProps,
} from "./kehadiran-dropdown";
import KehadiranTable, { KehadiranTableProps } from "./kehadiran-table";
import Container from "@components/Container";
import { useTranslation } from "@hooks/useTranslation";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

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
  Omit<KehadiranDropdownProps, "onLoad"> &
  Omit<KehadiranTableProps, "loading">) => {
  const { t } = useTranslation(["kehadiran", "enum"]);
  const { events } = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    events.on("routeChangeComplete", () => {
      setLoading(false);
    });
    return () => {
      events.off("routeChangeComplete", () => {
        setLoading(false);
      });
    };
  }, []);

  return (
    <>
      <Container className="xl:px-0 py-8 lg:py-12 xl:grid xl:grid-cols-12">
        <div className="xl:col-span-10 xl:col-start-2">
          <section>
            <h2 className="header text-center">{t("header")}</h2>

            <KehadiranDropdown
              dropdown={dropdown}
              onLoad={() => setLoading(true)}
              params={params}
            />

            {/* Individual/Party Attendance */}
            <KehadiranTable
              individual={individual}
              loading={loading}
              party={party}
            />
          </section>

          {/* A breakdown of attendance by key demographics */}
          <Barmeter barmeter={barmeter} loading={loading} />
        </div>
      </Container>
    </>
  );
};

export default KehadiranDashboard;
