import { Search } from "@components/index";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  XMarkIcon,
} from "@heroicons/react/20/solid";
import { useContext, useState } from "react";
import { SearchContext, SearchEventContext } from "./search/context";
import { Button } from "@govtechmy/myds-react/button";

/**
 * Hansard Search Bar
 */

export default function HansardSearchBar() {
  const [query, setQuery] = useState<string>("");
  const { searchValue, activeCount, totalCount } = useContext(SearchContext);
  const { onSearchChange, onPrev, onNext } = useContext(SearchEventContext);

  return (
    <div className="flex w-full items-center gap-3 py-1.5">
      <Search
        className="w-full border-none py-[3.5px]"
        query={query}
        onChange={e => {
          setQuery(e.target.value);
          onSearchChange(e.target.value);
        }}
      />

      {searchValue && searchValue.length > 1 && (
        <Button
          variant="default-ghost"
          onClick={() => {
            setQuery("");
            onSearchChange("");
          }}
          iconOnly
        >
          <XMarkIcon className="size-5 text-dim group-hover:text-foreground" />
        </Button>
      )}
      {searchValue && searchValue.length > 1 && (
        <>
          <p className="whitespace-nowrap text-sm text-zinc-500">{`${activeCount} / ${totalCount}`}</p>
          <div className="flex items-center">
            <Button variant="default-ghost" onClick={onPrev} iconOnly>
              <ChevronUpIcon className="size-5" />
            </Button>
            <Button variant="default-ghost" onClick={onNext} iconOnly>
              <ChevronDownIcon className="size-5" />
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
