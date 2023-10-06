import { At, Section } from "@components/index";
import { FunctionComponent } from "react";
import ExcerptCard, { Excerpt } from "@components/Card/excerpt-card";
import { useTranslation } from "@hooks/useTranslation";

/**
 * Excerpts
 * @overview Status: In-development
 */

const Excerpts: FunctionComponent = () => {
  const { t } = useTranslation();
  const p_str = `... suasana keadaan ekonomi dunia yang semakin tidak stabil. Kos menjana elektrik contohnya telah naik sebanyak tiga kali ganda dalam tempoh 12 bulan yang lepas. Begitu juga dengan kos petrol.`;
  const excerpts: Excerpt[] = [
    {
      date: "2023-09-19",
      meeting: 0,
      session: 2,
      term: 15,
      quote: p_str,
    },
    {
      date: "2023-09-19",
      meeting: 0,
      session: 2,
      term: 15,
      quote: p_str,
    },
  ];

  return (
    <>
      <Section>
        <div className="justify-between flex pb-6 lg:pb-8 flex-wrap gap-3">
          <h4>{t("excerpts", { count: 1234 })}</h4>
          <At
            className="btn btn-border active:bg-slate-100 shadow-button bg-white px-3 py-1.5 text-sm text-zinc-900"
            href="/katalog"
            enableIcon
          >
            {t("see_all", { count: 1234 })}
          </At>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {excerpts.map((excerpt) => (
            <ExcerptCard excerpt={excerpt} keyword={"petrol"} />
          ))}
        </div>
      </Section>
    </>
  );
};

export default Excerpts;
