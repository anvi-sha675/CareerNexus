import Card from "../common/Card";
import Skeleton from "../common/Skeleton";

export default function ChartCard({
  title,
  subtitle,
  action,
  children,
  loading,
  height = 280,
}) {
  return (
    <Card>
      <div className="mb-4 flex items-start justify-between">
        <div>
          <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
            {title}
          </h3>
          {subtitle && <p className="text-xs text-slate-400">{subtitle}</p>}
        </div>
        {action}
      </div>
      {loading ? (
        <Skeleton className="w-full" style={{ height }} />
      ) : (
        <div style={{ width: "100%", height }}>{children}</div>
      )}
    </Card>
  );
}
