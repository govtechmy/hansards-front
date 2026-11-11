import { Button } from "@components/index";
import { Tag } from "@components/Tag";
import { ArrowRightIcon, XMarkIcon } from "@heroicons/react/20/solid";
import { useTranslation } from "@hooks/useTranslation";
import { RelatedSearch } from "@lib/types";
import { capitalize } from "@lib/utils";

/**
 * Related Search Chip
 * @overview "Adakah anda maksudkan: [Ekonomi ->] (x)" shown under the search box
 * when the backend corrected a misspelled keyword.
 *
 * It only displays. It does not know about the router or the search box: the
 * parent (keyword-filter.tsx) decides what the two buttons do.
 */

interface RelatedSearchChipProps {
  relatedSearch: RelatedSearch;
  /** Arrow: put the suggestion in the search box */
  onAccept: () => void;
  /** x: search again for exactly what the user typed */
  onReject: () => void;
}

// Exported from Figma: Icon/outline/AI search (node 40002145-93323), colours switched to currentColor.
const RelatedSearchIcon = ({ className }: { className?: string }) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
    focusable="false"
  >
    <path
      d="M18.3149 18.2927L14.5649 14.5427"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="currentColor"
    />
    <path
      d="M10.8717 3.84424C13.9424 4.23999 16.3149 6.86425 16.3149 10.0426C16.3149 13.4944 13.5167 16.2926 10.0649 16.2926C6.61316 16.2926 3.81494 13.4944 3.81494 10.0426"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="currentColor"
    />
    <path
      d="M6.4262 4.21184C6.50616 3.99575 6.8118 3.99575 6.89176 4.21184C7.39455 5.57061 8.46586 6.64192 9.82463 7.14471C10.0407 7.22467 10.0407 7.53031 9.82463 7.61027C8.46586 8.11306 7.39455 9.18436 6.89176 10.5431C6.8118 10.7592 6.50616 10.7592 6.4262 10.5431C5.92341 9.18436 4.8521 8.11306 3.49333 7.61027C3.27724 7.53031 3.27724 7.22467 3.49334 7.14471C4.8521 6.64192 5.92341 5.57061 6.4262 4.21184Z"
      fill="currentColor"
    />
    <path
      d="M8.72944 1.85724C8.74847 1.80581 8.82121 1.80581 8.84024 1.85724C9.01973 2.3423 9.40217 2.72475 9.88724 2.90424C9.93867 2.92327 9.93867 2.99601 9.88724 3.01504C9.40217 3.19453 9.01973 3.57698 8.84024 4.06205C8.82121 4.11347 8.74847 4.11347 8.72944 4.06205C8.54994 3.57698 8.1675 3.19453 7.68243 3.01504C7.631 2.99601 7.631 2.92327 7.68243 2.90424C8.1675 2.72475 8.54994 2.3423 8.72944 1.85724Z"
      fill="currentColor"
    />
    <path
      d="M3.35514 2.71486C3.38171 2.64307 3.48325 2.64307 3.50982 2.71486C3.76038 3.39199 4.29426 3.92587 4.97139 4.17643C5.04318 4.203 5.04318 4.30454 4.97139 4.3311C4.29426 4.58167 3.76038 5.11555 3.50982 5.79268C3.48325 5.86447 3.38171 5.86447 3.35514 5.79268C3.10458 5.11555 2.5707 4.58167 1.89357 4.3311C1.82178 4.30454 1.82178 4.203 1.89357 4.17643C2.5707 3.92587 3.10458 3.39199 3.35514 2.71486Z"
      fill="currentColor"
    />
  </svg>
);

const RelatedSearchChip = ({
  relatedSearch,
  onAccept,
  onReject,
}: RelatedSearchChipProps) => {
  const { t } = useTranslation("home");
  const { corrected } = relatedSearch;

  return (
    <Tag
      variant="primary"
      mode="pill"
      size="medium"
      className="h-auto max-w-full whitespace-normal py-1"
    >
      <RelatedSearchIcon className="size-5 shrink-0 text-txt-primary" />
      <span>{t("did_you_mean")}</span>
      {/* The user's word is plain JSX text, never passed through t(), so a
          value like "[a](http://x)" cannot turn into a link */}
      <span className="inline-flex min-w-0 items-center gap-0.5 rounded-md border border-border bg-background pl-2 pr-0.5 text-foreground">
        <span className="min-w-0 break-words">{capitalize(corrected)}</span>
        <Button
          variant="ghost"
          className="size-5 shrink-0 justify-center rounded-full p-0"
          aria-label={`${t("did_you_mean_accept")}: ${corrected}`}
          onClick={onAccept}
        >
          <ArrowRightIcon className="size-4" aria-hidden />
        </Button>
      </span>
      <Button
        variant="ghost"
        className="size-6 shrink-0 justify-center rounded-full p-0"
        aria-label={t("search_exact_instead")}
        onClick={onReject}
      >
        <XMarkIcon className="size-4" aria-hidden />
      </Button>
    </Tag>
  );
};

export default RelatedSearchChip;
