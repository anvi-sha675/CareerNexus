import { cn } from "../../utils/cn";
import { StatSkeleton } from "./Skeleton";

export default function StatCard({
  label,
  value,
  icon: Icon,
  trend,
  tone = "primary",
  loading,
}) {
  if (loading) return <StatSkeleton />;

  const tones = {
    primary: "bg-primary-500/10 text-primary-600",
    accent: "bg-accent/10 text-accent-600",
    success: "bg-green-50 text-success",
    warning: "bg-amber-50 text-warning",
    error: "bg-red-50 text-error",
  };

  return (
    <div className="rounded-xl bg-card p-5 card-shadow transition-shadow hover:card-shadow-lg dark:bg-slate-800/60">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            {label}
          </p>
          <p className="mt-2 text-2xl font-bold text-slate-800 dark:text-slate-100">
            {value}
          </p>
        </div>
        {Icon && (
          <div
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-xl",
              tones[tone],
            )}
          >
            <Icon className="h-5 w-5" />
          </div>
        )}
      </div>
      {trend && (
        <p
          className={cn(
            "mt-3 text-xs font-medium",
            trend.positive ? "text-success" : "text-error",
          )}
        >
          {trend.positive ? "▲" : "▼"} {trend.value}{" "}
          <span className="font-normal text-slate-400">{trend.label}</span>
        </p>
      )}
    </div>
  );
}
