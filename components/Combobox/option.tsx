import { cn } from "@lib/helpers";
import { OptionType } from "@lib/types";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import { CSSProperties, ForwardedRef, forwardRef, ReactNode } from "react";
import { useId } from "@floating-ui/react";

export type ComboOptionProp<T extends unknown> = OptionType & T;

export type ComboOptionProps<T> = {
  option: ComboOptionProp<T>;
  format?: (option: ComboOptionProp<T>) => ReactNode;
  onClick?: () => void;
  icon?: (value: string) => ReactNode;
  isSelected: boolean;
  active: boolean;
  index: number;
  total: number;
  style?: CSSProperties;
};

function ComboOptionInner<T>(
  {
    option,
    format,
    icon,
    onClick,
    isSelected,
    active,
    index,
    total,
    style,
    ...rest
  }: ComboOptionProps<T>,
  ref: ForwardedRef<HTMLDivElement>
) {
  const id = useId();

  return (
    <div
      id={id}
      ref={ref}
      role="option"
      aria-selected={active}
      onClick={onClick}
      {...rest}
      // As the list is virtualized, this lets the assistive tech know
      // how many options there are total without looking at the DOM.
      aria-setsize={total}
      aria-posinset={index + 1}
      className={cn(
        "px-4 py-2 absolute top-0 left-0 w-full cursor-pointer select-none",
        "hover:bg-slate-100 hover:dark:bg-zinc-800",
        active && "bg-slate-100 dark:bg-zinc-800"
      )}
      style={style}
    >
      <div className="relative flex flex-row gap-2">
        {format ? (
          <p
            className={cn(
              "flex gap-x-1 truncate",
              isSelected ? "font-medium" : "font-normal"
            )}
          >
            {format(option)}
          </p>
        ) : (
          <>
            {icon && icon(option.value)}
            <p
              className={cn(
                "block grow self-center",
                isSelected ? "font-medium" : "font-normal"
              )}
            >
              {option.label}
            </p>
          </>
        )}
        {isSelected && (
          <span className="absolute inset-y-0 right-0 flex items-center">
            <CheckCircleIcon className="text-primary dark:text-secondary h-4 w-4" />
          </span>
        )}
      </div>
    </div>
  );
}

// Solution variant #2: Wrapping to make forwardRef work with generics
// https://stackoverflow.com/questions/58469229/react-with-typescript-generics-while-using-react-forwardref
const ComboOption = forwardRef(ComboOptionInner) as <T>(
  props: ComboOptionProps<T> & { ref?: ForwardedRef<HTMLDivElement> }
) => ReturnType<typeof ComboOptionInner>;

export default ComboOption;
