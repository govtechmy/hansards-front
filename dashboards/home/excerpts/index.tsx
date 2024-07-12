import { Button, Section, Skeleton, toast } from "@components/index";
import ExcerptCard, { Excerpt } from "@dashboards/home/excerpts/excerpt-card";
import { useTranslation } from "@hooks/useTranslation";
import { useEffect, useState } from "react";
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
  query: ParsedUrlQuery;
}

const Excerpts = ({ count, excerpts, query }: ExcerptsProps) => {
  const { t } = useTranslation("home");
  const [loading, setLoading] = useState(false);
  const [_excerpts, setExcerpts] = useState<Excerpt[]>(excerpts);
  const [nextPage, setNextPage] = useState<number>(2);

  const { q, uid, dewan, tarikh_mula, tarikh_akhir, umur, etnik, parti, jantina } = query;

  const HAS_REMAINDER = count > _excerpts.length;

  useEffect(() => setExcerpts(excerpts), [excerpts]);

  const handleClick = () => {
    setLoading(true);
    get("api/search/", {
      q: q,
      uid: uid,
      house: dewan,
      window_size: ("q" in query) ? 40 : 150,
      page: nextPage,
      start_date: tarikh_mula,
      end_date: tarikh_akhir,
      age_group: umur,
      ethnicity: etnik,
      party: parti,
      sex: jantina,
    })
      .then(({ data }) => {
        setExcerpts((prev_data) => prev_data.concat(data.results));
        setNextPage((page) => page + 1);
        setLoading(false);
      })
      .catch((e) => {
        toast.error(
          t("toast.request_failure", { ns: "common" }),
          t("toast.try_again", { ns: "common" })
        );
        console.error(e);
        setLoading(false);
      });
  };

  return (
    <>
      <Section className="space-y-6 lg:space-y-8">
        <h2 className="header">{t("excerpts", { count: count })}</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {_excerpts.map((excerpt, i) => (
            <ExcerptCard
              key={i}
              dewan={(dewan ?? "dewan-rakyat") as Dewan}
              excerpt={excerpt}
              keyword={String(q)}
            />
          ))}
        </div>

        {HAS_REMAINDER && (
          <div className="flex flex-col items-center gap-6">
            <p className="text-zinc-500 text-sm font-medium">
              {t("see_all", { total: count, count: _excerpts.length })}
            </p>
            {loading ? (
              <Skeleton />
            ) : (
              <Button variant="outline" onClick={handleClick}>
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
