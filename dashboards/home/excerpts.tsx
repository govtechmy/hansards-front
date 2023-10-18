import { At, Section } from "@components/index";
import ExcerptCard, { Excerpt } from "@components/Card/excerpt-card";
import { useTranslation } from "@hooks/useTranslation";

/**
 * Excerpts
 * @overview Status: In-development
 */

export interface ExcerptsProps {
  count: number;
  excerpts: Excerpt[];
  keyword: string;
}

const Excerpts = ({ count, excerpts, keyword }: ExcerptsProps) => {
  const { t } = useTranslation();

  return (
    <>
      <Section>
        <div className="justify-between flex pb-6 lg:pb-8 flex-wrap gap-3">
          <h4>{t("excerpts", { count: count })}</h4>
          <At
            className="btn btn-border active:bg-slate-100 shadow-button bg-white px-3 py-1.5 text-sm text-zinc-900"
            href="/katalog"
            enableIcon
          >
            {t("see_all", { count: count })}
          </At>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {excerpts.map((excerpt) => (
            <ExcerptCard key={excerpt.id} excerpt={excerpt} keyword={keyword} />
          ))}
        </div>
      </Section>
    </>
  );
};

export default Excerpts;
