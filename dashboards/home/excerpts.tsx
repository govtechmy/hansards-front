import { Button, Section, Skeleton } from "@components/index";
import ExcerptCard, { Excerpt } from "@components/Card/excerpt-card";
import { useTranslation } from "@hooks/useTranslation";
import { useState } from "react";
import { get } from "@lib/api";
import { ParsedUrlQuery } from "querystring";

/**
 * Excerpts
 * @overview Status: In-development
 */

export interface ExcerptsProps {
  count: number;
  excerpts: Excerpt[];
  keyword: string;
  query: ParsedUrlQuery;
}

const Excerpts = ({ count, excerpts, keyword, query }: ExcerptsProps) => {
  const { t } = useTranslation("home");
  const [loading, setLoading] = useState(false);
  const [_excerpts, setExcerpts] = useState(excerpts);

  const { q, dewan, ...dates } = query;

  return (
    <>
      <Section className="space-y-6 lg:space-y-8">
        <h2 className="header">{t("excerpts", { count: count })}</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {_excerpts.map((excerpt, i) => (
            <ExcerptCard key={i} excerpt={excerpt} keyword={keyword} />
          ))}
        </div>

        <div className="flex w-full justify-center gap-6">
          {count > excerpts.length && loading ? (
            <Skeleton />
          ) : (
            <Button
              variant="default"
              onClick={() => {
                setLoading(true);
                get("api/search/", {
                  q: q,
                  house: dewan ?? "dewan-rakyat",
                  window_size: 30,
                  page: 1,
                  ...dates,
                })
                  .then(({ data }) =>
                    setExcerpts((prev_data) => [prev_data, ...data])
                  )
                  .catch((e) => console.error(e));
                setTimeout(() => setLoading(false), 500);
              }}
            >
              {t("load_more")}
            </Button>
          )}
        </div>
      </Section>
    </>
  );
};

export default Excerpts;
