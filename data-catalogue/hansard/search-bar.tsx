import { Search } from "@components/index";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  XMarkIcon,
} from "@heroicons/react/20/solid";
import { useContext, useEffect, useState } from "react";
import { SearchContext, SearchEventContext } from "./search/context";
import { useRouter } from "next/router";
import { setSearchParams } from "@lib/utils";
import { Button } from "@govtechmy/myds-react/button";

/**
 * Hansard Search Bar
 */

export default function HansardSearchBar() {
  const [query, setQuery] = useState<string>("");
  const { searchValue, activeCount, totalCount } = useContext(SearchContext);
  const { onSearchChange, onPrev, onNext } = useContext(SearchEventContext);

  // adds `?search={value} to URL`
  // const param = "search";
  // const router = useRouter();
  // const asPath = router.asPath;

  // useEffect(() => {
  //   const hash = asPath.lastIndexOf("#");
  //   const url = hash !== -1 ? asPath.slice(0, hash) : asPath;

  //   const rx = new RegExp("[?&]" + param + "=([^&]+).*$");
  //   const query_str = url.match(rx);
  //   if (query_str !== null)
  //     setQuery(query_str ? decodeURIComponent(query_str[1]) : "");
  // }, [asPath]);

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
            // router.push(asPath.slice(0, asPath.indexOf("?")), undefined, {
            //   scroll: false,
            // });
          }}
          iconOnly
        >
          <XMarkIcon className="size-5 text-txt-black-500 group-hover:text-txt-black-900" />
        </Button>
      )}
      {searchValue && searchValue.length > 1 && (
        <>
          <p className="whitespace-nowrap text-sm text-txt-black-500">{`${activeCount} / ${totalCount}`}</p>
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
