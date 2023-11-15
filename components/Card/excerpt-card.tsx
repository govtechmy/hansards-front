import DateCard from "./date-card";
import Card from "@components/Card";
import Markdown from "@components/Markdown";
import ArrowUpRightIcon from "@heroicons/react/24/solid/ArrowUpRightIcon";
import { useTranslation } from "@hooks/useTranslation";

export type Excerpt = {
  id: number;
  speaker: string;
  trimmed_speech: string;
  sitting: {
    date: string;
    term: number;
    session: number;
    meeting: number;
  };
};

interface ExcerptCardProps {
  excerpt: Excerpt;
  keyword: string;
}

const ExcerptCard = ({ excerpt, keyword }: ExcerptCardProps) => {
  const { t } = useTranslation("enum");
  const TERM_YEARS = [
    "1959 - 1964",
    "1964 - 1969",
    "1971 - 1974",
    "1974 - 1978",
    "1978 - 1981",
    "1982 - 1986",
    "1986 - 1990",
    "1990 - 1994",
    "1995 - 1999",
    "1999 - 2003",
    "2004 - 2007",
    "2008 - 2012",
    "2013 - 2018",
    "2018 - 2022",
    `2022 - ${t("now", { ns: "enum" })}`,
  ];

  const quotes = excerpt.trimmed_speech.split("==");
  const [name, title] = excerpt.speaker.split("[");

  return (
    <>
      <Card className="shadow-button p-6 max-w-3xl group hover:border-slate-400 hover:bg-slate-50 dark:hover:border-zinc-700 dark:hover:bg-zinc-800/50">
        <div className="flex flex-col gap-3 relative h-full">
          <ArrowUpRightIcon className="absolute right-2 h-5 w-5 text-dim opacity-0 transition-[opacity_transform] duration-0 group-hover:translate-x-2 group-hover:opacity-100 group-hover:duration-300" />
          <div className="flex gap-3 lg:gap-6">
            <DateCard date={excerpt.sitting.date} size="sm" />

            <div className="flex flex-col w-[calc(100%-110px)] justify-evenly">
              <p className="text-zinc-900 dark:text-white font-bold truncate">
                {name}
              </p>
              <p className="text-zinc-500 font-medium truncate">
                {title ? title.slice(0, -1) : ""}
              </p>
            </div>
          </div>
          <div className="text-zinc-900 dark:text-white flex-grow">
            <span>...</span>
            {quotes.map((q) => {
              if (!q) return;
              return (
                <>
                  {q.toLowerCase() === keyword.toLowerCase() ? (
                    <span className="bg-blue-600 text-white w-fit rounded-md px-[3px] py-0.5 inline mx-[2px]">
                      {q}
                    </span>
                  ) : (
                    <Markdown className="" components={{ p: "span" }}>
                      {q}
                    </Markdown>
                  )}
                </>
              );
            })}
            <span>...</span>
          </div>
          <span className="flex text-zinc-500 text-xs gap-1 pt-3 border-t dark:border-zinc-800">
            <span>
              {t("parlimen", {
                ordinal: true,
                count: excerpt.sitting.term,
              })}
            </span>
            /
            <span>
              {t("penggal", {
                ordinal: true,
                count: excerpt.sitting.meeting,
              })}
            </span>
            /
            <span>
              {t("mesyuarat", {
                ordinal: true,
                count: excerpt.sitting.session,
              })}
            </span>
          </span>
        </div>
      </Card>
    </>
  );
};

export default ExcerptCard;
