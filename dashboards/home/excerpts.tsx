import { Button, Section, Skeleton } from "@components/index";
import ExcerptCard, { Excerpt } from "@components/Card/excerpt-card";
import { useTranslation } from "@hooks/useTranslation";
import { useState } from "react";
import { get } from "@lib/api";
import { ParsedUrlQuery } from "querystring";
import { Dewan } from "@lib/types";

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
  const [nextPage, setNextPage] = useState<number>(2);

  const { q, dewan, ...dates } = query;

  const HAS_REMAINDER = count > _excerpts.length;
  return (
    <>
      <Section className="space-y-6 lg:space-y-8">
        <h2 className="header">{t("excerpts", { count: count })}</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {_excerpts.map((excerpt, i) => (
            <ExcerptCard
              key={i}
              dewan={(dewan ?? "dewan-rakyat") as Dewan}
              excerpt={excerpt}
              keyword={keyword}
            />
          ))}
        </div>

        {HAS_REMAINDER && (
          <div className="flex w-full justify-center gap-6">
            {loading ? (
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
                    page: nextPage,
                    ...dates,
                  })
                    .then(({ data }) => {
                      setExcerpts((prev_data) =>
                        prev_data.concat(data.results)
                      );
                      setNextPage((page) => page + 1);
                    })
                    .catch((e) => console.error(e));
                  setLoading(false);
                }}
              >
                {t("load_more")}
              </Button>
            )}
          </div>
        )}
      </Section>
    </>
  );
};

export default Excerpts;
