import debounce from "lodash/debounce";
import { useRouter } from "next/router";
import {
  useReducer,
  useCallback,
  createContext,
  useEffect,
  useMemo,
  ReactNode,
} from "react";

/* React Ctrl F from https://github.com/dbwcooper/react-ctrl-f.git */

enum IActionTypes {
  setSearchValue = "setSearchValue",
  setActiveMatch = "setActiveMatch",
  setMatchList = "setMatchList",
}

interface MatchObjectProps {
  id: string;
  idCount: number;
}

interface IState {
  searchValue: string;
  totalCount: number;
  activeCount: number;
  activeId: string;
  matchedList: MatchObjectProps[];
  ignorecase?: boolean;
}

interface EventContextProps {
  onSearchChange: (searchValue: string) => void;
  onNext: (data: any) => void;
  onPrev: (data: any) => void;
  onUpdateMatchList: (matchedList: MatchObjectProps[]) => void;
}

interface IAction1 {
  type: IActionTypes.setSearchValue;
  payload: {
    searchValue: string;
  };
}

interface IAction2 {
  type: IActionTypes.setActiveMatch;
  payload: {
    activeId: string;
    activeCount: number;
  };
}

interface IAction3 {
  type: IActionTypes.setMatchList;
  payload: MatchObjectProps[];
}
type IActions = IAction1 | IAction2 | IAction3;

interface SearchProviderProps {
  children: React.ReactNode;
  value?: {
    fixedHeaderHeight?: number;
    onScroll?: (id: string, fixedHeight?: number) => void;
    ignorecase?: boolean;
  };
}

const scrollToView = (id: string, fixHeaderHeight: number = 0) => {
  const dom = document.getElementById(id);
  if (dom) {
    const topOfElement =
      dom.getBoundingClientRect().bottom + window.pageYOffset - fixHeaderHeight;
    window.scroll({
      top: topOfElement,
      behavior: "smooth",
    });
  }
};

const defaultStore: IState = {
  searchValue: "",
  totalCount: 0,

  activeCount: 0, // active count, less than or equal totalCount
  activeId: "", // active text id
  matchedList: [],
};

const searchEventStore: EventContextProps = {
  onSearchChange: () => {},
  onPrev: () => {},
  onNext: () => {},
  onUpdateMatchList: () => {},
};

const reducer = (state: IState, action: IActions): IState => {
  if (action.type === IActionTypes.setSearchValue) {
    return {
      ...state,
      searchValue: action.payload.searchValue,
    };
  }

  if (action.type === IActionTypes.setActiveMatch) {
    return {
      ...state,
      activeId: action.payload.activeId,
      activeCount: action.payload.activeCount,
    };
  }
  if (action.type === IActionTypes.setMatchList) {
    return {
      ...state,
      matchedList: action.payload,
    };
  }
  return state;
};

export const SearchContext = createContext(defaultStore);
export const SearchEventContext = createContext(searchEventStore);

export const SearchProvider = (props: SearchProviderProps) => {
  const [store, dispatch] = useReducer(reducer, defaultStore);

  const activeCount = store.activeCount;
  const totalCount = store.matchedList?.length;
  const onSearchChange = useCallback(
    debounce((searchValue: string) => {
      dispatch({ type: IActionTypes.setSearchValue, payload: { searchValue } });
    }, 500),
    []
  );

  // Calculate previous match text
  const onPrev = useCallback(
    (fixedHeaderHeight: ReactNode) => {
      if (activeCount > 0) {
        let prevActiveCount =
          activeCount - 1 < 1 ? store.matchedList.length : activeCount - 1;
        let matchIndex = prevActiveCount - 1;
        let prevActiveId = store.matchedList[matchIndex].id;
        dispatch({
          type: IActionTypes.setActiveMatch,
          payload: { activeId: prevActiveId, activeCount: prevActiveCount },
        });

        // scroll To View
        if (typeof fixedHeaderHeight !== "number") {
          fixedHeaderHeight = props.value?.fixedHeaderHeight;
        }
        if (typeof props.value?.onScroll === "function") {
          props.value?.onScroll(prevActiveId, fixedHeaderHeight);
        } else {
          scrollToView(prevActiveId, fixedHeaderHeight);
        }
      }
    },
    [activeCount, totalCount]
  );

  // Calculate next match text
  const onNext = useCallback(
    (fixedHeaderHeight: ReactNode) => {
      if (activeCount > 0) {
        // update active count
        let nextActiveCount =
          activeCount + 1 > store.matchedList.length ? 1 : activeCount + 1;
        let matchIndex = nextActiveCount - 1;
        let nextActiveId = store.matchedList[matchIndex].id;
        dispatch({
          type: IActionTypes.setActiveMatch,
          payload: { activeId: nextActiveId, activeCount: nextActiveCount },
        });

        // scroll To View
        if (typeof fixedHeaderHeight !== "number") {
          fixedHeaderHeight = props.value?.fixedHeaderHeight;
        }
        if (typeof props.value?.onScroll === "function") {
          props.value?.onScroll(nextActiveId, fixedHeaderHeight);
        } else {
          scrollToView(nextActiveId, fixedHeaderHeight);
        }
      }
    },
    [activeCount, totalCount]
  );

  const onUpdateMatchList = useMemo(
    (cacheList: MatchObjectProps[] = []) =>
      (matchList: MatchObjectProps[] = []) => {
        // cache initialList
        cacheList = cacheList.concat(matchList);
        dispatch({ type: IActionTypes.setMatchList, payload: cacheList });
      },
    [store.searchValue]
  );

  // find matches if `?search=${value}` is present
  // const param = "search";
  // const router = useRouter();
  // const asPath = router.asPath;
  // const rx = new RegExp("[?&]" + param + "=([^&]+).*$");

  // useEffect(() => {
  //   const hash = asPath.lastIndexOf("#");
  //   const url = hash !== -1 ? asPath.slice(0, hash) : asPath;
  //   const query_str = url.match(rx);
  //   const searchValue = query_str ? decodeURIComponent(query_str[1]) : "";

  //   if (searchValue)
  //     dispatch({
  //       type: IActionTypes.setSearchValue,
  //       payload: { searchValue },
  //     });
  // }, [asPath]);

  useEffect(() => {
    // After calculating all match components, calculate activeCount
    if (store.matchedList.length > 0) {
      //   const hash = asPath.lastIndexOf("#");
      //   const url = hash !== -1 ? asPath.slice(0, hash) : asPath;
      //   const query_str = url.match(rx);
      //   const searchValue = query_str ? decodeURIComponent(query_str[1]) : "";

      //   if (searchValue && hash > -1) {
      //     const activeId = `${asPath.slice(hash + 1)}_0`;
      //     const activeCount = store.matchedList.findIndex(
      //       match => match.id === activeId
      //     );
      //     if (activeCount > -1)
      //       dispatch({
      //         type: IActionTypes.setActiveMatch,
      //         payload: { activeId, activeCount: activeCount + 1 },
      //       });
      //   } else
      //     dispatch({
      //       type: IActionTypes.setActiveMatch,
      //       payload: { activeId: store.matchedList[0].id, activeCount: 1 },
      //     });
      // } else {
      dispatch({
        type: IActionTypes.setActiveMatch,
        payload: { activeId: "", activeCount: 0 },
      });
    }
  }, [store.matchedList]);

  return (
    <SearchContext.Provider
      value={{
        ...store,
        totalCount,
        ignorecase: props.value?.ignorecase,
      }}
    >
      <SearchEventContext.Provider
        value={{
          onSearchChange,
          onUpdateMatchList,
          onPrev,
          onNext,
        }}
      >
        {props.children}
      </SearchEventContext.Provider>
    </SearchContext.Provider>
  );
};
