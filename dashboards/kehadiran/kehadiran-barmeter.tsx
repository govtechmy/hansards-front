import { BarMeterData } from "@charts/bar-meter";
import Skeleton from "@components/Skeleton";
import { useTranslation } from "@hooks/useTranslation";
import dynamic from "next/dynamic";

/**
 * Kehadiran - BarMeter
 * @overview Status: In-development
 */

const BarMeter = dynamic(() => import("@charts/bar-meter"), {
  loading: () => <Skeleton height="h-[400px] lg:h-[500px]" width="w-auto" />,
  ssr: false,
});

type DemographyKeys = "gender" | "ethnicity" | "age";

export interface KehadiranBarMeterProps {
  barmeter: Record<DemographyKeys, BarMeterData[]>;
  loading: boolean;
}

const KehadiranBarMeter = ({ barmeter, loading }: KehadiranBarMeterProps) => {
  const { t } = useTranslation(["demografi", "kehadiran"]);
  const DEMOGRAPHY = ["gender", "ethnicity", "age"] as DemographyKeys[];

  return (
    <section className="space-y-6 py-8 lg:py-12">
      <h3 className="title">{t("barmeter_title", { ns: "kehadiran" })}</h3>

      {loading ? (
        <Skeleton height="h-[300px]" width="w-auto" />
      ) : (
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
          {DEMOGRAPHY.map(k => {
            return (
              <div className="flex flex-col space-y-6" key={k}>
                <BarMeter
                  relative
                  key={k}
                  title={t(k)}
                  layout="horizontal"
                  unit="%"
                  data={barmeter[k]}
                  sort={k === "age" ? undefined : "desc"}
                  formatX={key => (k === "age" ? key : t(key))}
                />
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default KehadiranBarMeter;
