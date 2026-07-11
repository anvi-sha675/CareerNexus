import { cn } from "../../utils/cn";

export default function Card({
  className,
  children,
  padding = "p-6",
  hover = false,
  ...props
}) {
  return (
    <div
      className={cn(
        "rounded-xl bg-card card-shadow dark:bg-slate-800/60 dark:border dark:border-slate-700/60",
        hover && "transition-shadow hover:card-shadow-lg",
        padding,
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
