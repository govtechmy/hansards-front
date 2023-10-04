import Hero from "@components/Hero";
import { useTranslation } from "@hooks/useTranslation";
import { FunctionComponent } from "react";

/**
 * Kehadiran Dashboard
 * @overview Status: In-development
 */

const KehadiranDashboard: FunctionComponent = () => {
  const { t } = useTranslation(["common", "kehadiran"]);

  return (
    <>
      <Hero
        background="gold"
        category={[t("hero.category", { ns: "kehadiran" }), "text-secondary"]}
        header={[t("hero.header", { ns: "kehadiran" })]}
        description={[t("hero.description", { ns: "kehadiran" })]}
      />
    </>
  );
};

export default KehadiranDashboard;
