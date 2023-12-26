import { cn } from "@lib/helpers";
import { FunctionComponent, ReactNode } from "react";

interface CardProps {
  className?: string;
  children: ReactNode;
  onClick?: () => void;
}

const Card: FunctionComponent<CardProps> = ({ children, className, onClick }) => {
  return (
    <div
      className={cn(
        "border-slate-200 dark:border-zinc-800 rounded-xl border transition",
        onClick && "cursor-pointer",
        className
      )}
      tabIndex={onClick ? 0 : -1}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default Card;
