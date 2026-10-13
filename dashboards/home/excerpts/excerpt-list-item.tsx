import { Dewan } from "@lib/types";
import Link from "next/link";
import { Remarkable } from "remarkable";
import RemarkableReactRenderer from "remarkable-react";

export type Excerpt = {
  index: number;
  speaker: string;
  trimmed_speech: string;
  sitting: {
    date: string;
    term: number;
    session: number;
    meeting: number;
    house?: number;
  };
};

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function markExactPhrase(text: string, keyword: string) {
  const source = text.replace(/==/g, "").replace(/\*/g, "");
  if (!/[\p{L}\p{N}]/u.test(keyword)) return source;

  const phrasePattern = keyword
    .split(/(\s+|[^\p{L}\p{N}\s]+)/u)
    .filter(Boolean)
    .map(part => {
      if (/^\s+$/u.test(part)) return "[ \\t]+";
      if (/^[^\p{L}\p{N}\s]+$/u.test(part)) {
        return `[ \\t]*${escapeRegExp(part)}[ \\t]*`;
      }
      return escapeRegExp(part);
    })
    .join("");
  const exactPhrase = new RegExp(
    `(^|[^\\p{L}\\p{N}])(${phrasePattern})(?![\\p{L}\\p{N}])`,
    "giu"
  );
  return source.replace(
    exactPhrase,
    (_match, prefix: string, phrase: string) => `${prefix}==${phrase}==`
  );
}

interface ExcerptListItemProps {
  dewan: Dewan;
  excerpt: Excerpt;
  keyword: string;
  isExactMatch?: boolean;
}

const ExcerptListItem = ({
  dewan,
  excerpt,
  keyword,
  isExactMatch = false,
}: ExcerptListItemProps) => {
  const { index, sitting, speaker, trimmed_speech } = excerpt;
  const exactKeyword = keyword.trim().replace(/^"(.*)"$/, "$1");
  const speech = isExactMatch
    ? markExactPhrase(trimmed_speech, exactKeyword)
    : trimmed_speech;
  // const [name, title] = speaker.split("[");

  const md = new Remarkable();
  md.inline.ruler.enable(["mark"]);
  md.renderer = new RemarkableReactRenderer({
    components: {
      mark: ({ children }: { children: string[] }) => {
        return <mark className="bg-[#DDD6B0] text-black">{children}</mark>;
      },
    },
  }) as any;

  const HOUSE_TO_DEWAN: Record<number, string> = {
    0: "dewan-rakyat",
    1: "dewan-negara",
    2: "kamar-khas",
  };

  const houseDewan =
    sitting.house !== undefined
      ? HOUSE_TO_DEWAN[sitting.house]
      : HOUSE_TO_DEWAN[0];

  return (
    <Link
      href={`hansard/${houseDewan}/${sitting.date}?q=${encodeURIComponent(exactKeyword)}#${index}`}
      prefetch={false}
      className="group p-3 first:rounded-t-xl last:rounded-b-xl hover:bg-slate-50 dark:hover:bg-zinc-800/50 sm:p-4"
    >
      <div className="relative flex h-full flex-col gap-1">
        <p className="line-clamp-1 text-body-sm font-medium">{speaker}</p>
        <div className="line-clamp-2 text-body-xs text-txt-black-700 sm:text-body-sm">
          {md.render(speech)}
        </div>
      </div>
    </Link>
  );
};

export default ExcerptListItem;
