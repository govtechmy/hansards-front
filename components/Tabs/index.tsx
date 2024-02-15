import { FunctionComponent, ReactElement, ReactNode, useMemo } from "react";
import { Tab } from "@headlessui/react";
import { cn } from "@lib/helpers";

interface TabsProps {
  children: ReactNode;
  hidden?: boolean;
  className?: string;
  current?: number;
  state?: ReactNode;
  title?: ReactNode;
  menu?: ReactNode;
  controls?: ReactNode;
  onChange?: (index: number) => void;
}

interface PanelProps {
  name: string | ReactElement;
  icon?: ReactNode;
  className?: string;
  children?: ReactNode;
}

interface ListProps {
  options: string[];
  icons?: Array<ReactNode>;
  className?: string;
  current: number;
  onChange: (index: number) => void;
}

const Panel: FunctionComponent<PanelProps> = ({
  children,
  className,
  name,
}) => {
  return <div className={className}>{children}</div>;
};

const List: FunctionComponent<ListProps> = ({
  options,
  current,
  onChange,
  icons,
  className,
}) => {
  return (
    <ul className={cn("flex flex-wrap", className)}>
      {options.map((option, index) => (
        <li
          key={option}
          className={cn(
            "flex cursor-pointer select-none self-center whitespace-nowrap rounded-full px-2.5 py-1 text-sm transition-colors",
            current === index
              ? "bg-slate-200 dark:bg-zinc-800 font-medium text-zinc-900 dark:text-white"
              : "text-zinc-500 bg-transparent hover:text-zinc-900 dark:hover:text-white"
          )}
          onClick={() => onChange(index)}
        >
          {icons && icons[index]}
          {option}
        </li>
      ))}
    </ul>
  );
};

const Tabs: FunctionComponent<TabsProps> & {
  Panel: typeof Panel;
  List: typeof List;
} = ({
  className = "",
  hidden,
  children,
  title,
  controls,
  current,
  menu,
  onChange = () => {},
}) => {
  const _children = useMemo(() => {
    return Array.isArray(children) ? children : [children];
  }, [children]);
  return (
    <>
      <Tab.Group selectedIndex={current} onChange={onChange}>
        <div
          className={cn(
            "flex flex-wrap items-end justify-between gap-3",
            className
          )}
        >
          {title && typeof title === "string" ? (
            <span className="text-base font-bold">{title}</span>
          ) : (
            title
          )}

          <Tab.List
            className={cn(
              "flex flex-wrap items-center justify-between gap-2.5",
              hidden && "hidden"
            )}
          >
            {controls}
            <div className="flex flex-wrap">
              {_children.map(({ props: { name, icon } }, index) => (
                <Tab
                  key={index}
                  className={({ selected }) =>
                    cn(
                      "group flex flex-row rounded-full px-[10px] py-1 text-sm transition-colors",
                      selected
                        ? "bg-slate-200 dark:bg-zinc-800 font-medium text-zinc-900 dark:text-white"
                        : "text-zinc-500 bg-transparent hover:text-zinc-900 dark:hover:text-white"
                    )
                  }
                >
                  {icon}
                  {name}
                </Tab>
              ))}
            </div>

            {menu && <div>{menu}</div>}
          </Tab.List>
        </div>

        <Tab.Panels className="w-full">
          {_children.map(({ props: { children } }, index) => (
            <Tab.Panel className="overflow-visible" key={index}>
              {children}
            </Tab.Panel>
          ))}
        </Tab.Panels>
      </Tab.Group>
    </>
  );
};

Tabs.Panel = Panel;
Tabs.List = List;

export { List };
export { Panel };
export default Tabs;
