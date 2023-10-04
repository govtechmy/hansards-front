import Hero from "@components/Hero";
import { useTranslation } from "@hooks/useTranslation";
import { FunctionComponent } from "react";

/**
 * Sejarah Dashboard
 * @overview Status: In-development
 */

const SejarahDashboard: FunctionComponent = () => {
  const { t } = useTranslation(["common", "sejarah"]);

  return (
    <>
      <Hero
        background="gold"
        category={[t("hero.category", { ns: "sejarah" }), "text-secondary"]}
        header={[t("hero.header", { ns: "sejarah" })]}
        description={[t("hero.description", { ns: "sejarah" })]}
      />
    </>
  );
};

export default SejarahDashboard;
