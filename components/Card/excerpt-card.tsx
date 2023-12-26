import DateCard from "./date-card";
import Markdown from "@components/Markdown";
import ArrowUpRightIcon from "@heroicons/react/24/solid/ArrowUpRightIcon";
import { useTranslation } from "@hooks/useTranslation";
import { routes } from "@lib/routes";
import Link from "next/link";
import { useMemo } from "react";
import rehypeRaw from "rehype-raw";

export type Excerpt = {
  index: number;
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
  const { index, sitting, speaker, trimmed_speech } = excerpt;
  const [name, title] = speaker.split("[");

  const quotes = trimmed_speech.replaceAll("\n\n", " ").split("==");

  const _quotes = useMemo<string>(() => {
    if (quotes.length === 1) {
      return quotes[0];
    } else {
      let str = "";
      for (let i = 0; i < quotes.length; i++) {
        if (!quotes[i]) continue;
        if (quotes[i].toLowerCase() === keyword)
          str += `<mark>${quotes[i]}</mark>`;
        else str += quotes[i];
      }
      return `...${str}...`;
    }
  }, [quotes]);

  return (
    <>
      <Link
        href={`${routes.HANSARD_DR}/${sitting.date}#${index}`}
        className="shadow-button p-6 max-w-3xl group border-slate-200 dark:border-zinc-800 rounded-xl border transition hover:border-slate-400 hover:bg-slate-50 dark:hover:border-zinc-700 dark:hover:bg-zinc-800/50"
      >
        <div className="flex flex-col gap-3 relative h-full">
          <ArrowUpRightIcon className="absolute right-2 h-5 w-5 text-dim opacity-0 transition-[opacity_transform] duration-0 group-hover:translate-x-2 group-hover:opacity-100 group-hover:duration-300" />
          <div className="flex gap-3 lg:gap-6">
            <DateCard date={sitting.date} size="sm" />

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
            <Markdown
              className=""
              rehypePlugins={[rehypeRaw]}
              components={{
                mark(props) {
                  const { node, ...rest } = props;
                  return (
                    <span className="bg-[#DDD6B0] text-zinc-900" {...rest} />
                  );
                },
              }}
            >
              {_quotes}
            </Markdown>
          </div>
          <span className="flex text-zinc-500 text-xs gap-1 pt-3 border-t dark:border-zinc-800">
            <span>
              {t("parlimen", {
                ordinal: true,
                count: sitting.term,
              })}
            </span>
            /
            <span>
              {t("penggal", {
                ordinal: true,
                count: sitting.meeting,
              })}
            </span>
            /
            <span>
              {t("mesyuarat", {
                ordinal: true,
                count: sitting.session,
              })}
            </span>
          </span>
        </div>
      </Link>
    </>
  );
};

export default ExcerptCard;
