import Label, { LabelProps } from "../Label";
import { cn } from "@lib/helpers";
import {
  FunctionComponent,
  HTMLInputTypeAttribute,
  ReactElement,
  useEffect,
  useRef,
} from "react";

interface InputProps extends LabelProps {
  className?: string;
  type?: Omit<HTMLInputTypeAttribute, "radio" | "checkbox">;
  placeholder?: string;
  icon?: ReactElement;
  value?: string;
  onChange?: (value: string) => void;
  onKeyDown?: (value: React.KeyboardEvent<HTMLInputElement>) => void;
  min?: string;
  max?: string;
  required?: boolean;
  autoFocus?: boolean;
  spellCheck?: boolean;
  validation?: string;
  disabled?: boolean;
}

const Input: FunctionComponent<InputProps> = ({
  name,
  label,
  className,
  type = "text",
  value,
  placeholder,
  min,
  max,
  icon,
  required = false,
  autoFocus = false,
  spellCheck = false,
  validation = "",
  onChange,
  onKeyDown,
  disabled = false,
}) => {
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (ref.current && autoFocus) ref.current.focus();
  }, []);

  return (
    <div className="relative flex w-full flex-col gap-2">
      {label && <Label name={name} label={label} />}
      <div className="text-zinc-500 absolute left-3 h-full flex items-center">
        {icon && icon}
      </div>

      <input
        id={name}
        ref={ref}
        autoFocus={autoFocus}
        disabled={disabled}
        spellCheck={spellCheck}
        type={type as HTMLInputTypeAttribute}
        min={min}
        max={max}
        className={cn(
          "placeholder:text-zinc-500 w-full rounded-md px-3 py-2 text-sm dark:bg-zinc-900 dark:text-white",
          "focus:ring-2 ring-blue-600 dark:ring-primary-dark focus:outline-none",
          icon ? "pl-10" : "",
          validation
            ? "border-danger border-2"
            : "border-slate-200 dark:border-zinc-800",
          className
        )}
        placeholder={placeholder}
        value={value}
        required={required}
        onChange={(e) => {
          if (onChange) onChange(e.target.value);
        }}
        onKeyDown={onKeyDown}
      />
      {validation && <p className="text-danger text-xs">{validation}</p>}
    </div>
  );
};

export default Input;
