import { cn } from "../../utils/cn";
import { initials } from "../../utils/formatters";

const SIZES = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-14 w-14 text-base",
  xl: "h-20 w-20 text-xl",
};

export default function Avatar({ name, src, size = "md", className }) {
  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={cn("rounded-full object-cover", SIZES[size], className)}
      />
    );
  }
  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-full bg-primary-500/10 font-semibold text-primary-700 dark:text-primary-500",
        SIZES[size],
        className,
      )}
      aria-label={name}
    >
      {initials(name || "?")}
    </div>
  );
}
