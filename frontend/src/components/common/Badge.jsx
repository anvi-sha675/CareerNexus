import { cn } from "../../utils/cn";
import { STATUS_COLORS } from "../../utils/constants";

export default function Badge({ children, tone, className }) {
  const toneClass =
    STATUS_COLORS[children] ||
    STATUS_COLORS[tone] ||
    "bg-slate-100 text-slate-600";
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium whitespace-nowrap",
        toneClass,
        className,
      )}
    >
      {children}
    </span>
  );
}
