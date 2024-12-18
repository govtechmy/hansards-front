import {
  ComponentProps,
  MouseEventHandler,
  ReactNode,
  forwardRef,
} from "react";
import { cn } from "@lib/helpers";

interface ButtonProps extends ComponentProps<"button"> {
  className?: string;
  type?: "button" | "reset" | "submit";
  variant?: keyof typeof style;
  onClick?: MouseEventHandler<HTMLButtonElement> | (() => void);
  children?: ReactNode;
  icon?: ReactNode;
  disabled?: boolean;
}

const style = {
  base: "flex select-none items-center gap-1.5 rounded-md text-start text-sm font-medium transition disabled:opacity-50 px-3 py-1.5",
  reset: "",
  outline:
    "border border-slate-200 dark:border-zinc-800 hover:border-slate-400 hover:dark:border-zinc-700 active:bg-slate-100 hover:dark:bg-zinc-800/50 active:dark:bg-zinc-800 bg-background text-foreground",
  primary:
    "from-blue-600 to-primary-dark shadow-button bg-gradient-to-t text-white hover:to-[#5B8EFF]",
  ghost:
    "hover:bg-slate-100 dark:hover:bg-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-white",
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    className,
    icon,
    type = "button",
    variant = "base",
    onClick,
    children,
    disabled = false,
    ...props
  },
  ref
) {
  return (
    <button
      ref={ref}
      onClick={onClick}
      disabled={disabled}
      type={type}
      className={cn(
        variant !== "reset" && style.base,
        style[variant],
        className
      )}
      {...props}
    >
      {icon}
      {children}
    </button>
  );
});

export default Button;
