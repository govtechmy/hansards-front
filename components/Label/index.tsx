export interface LabelProps {
  name?: string;
  label?: string;
  className?: string;
}

const Label = ({
  name,
  label,
  className = "text-sm font-medium text-zinc-900 dark:text-white block",
}: LabelProps) => {
  return (
    <label htmlFor={name} className={className}>
      {label}
    </label>
  );
};

export default Label;
