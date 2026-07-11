import { ArrowUpDown } from "lucide-react";
import { cn } from "../../utils/cn";
import Skeleton from "./Skeleton";
import EmptyState from "./EmptyState";

export default function Table({
  columns,
  rows,
  loading,
  emptyProps,
  sortKey,
  onSort,
  keyField = "id",
}) {
  if (loading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  if (!rows || rows.length === 0) {
    return <EmptyState {...emptyProps} />;
  }

  return (
    <div className="overflow-x-auto scrollbar-thin">
      <table className="w-full min-w-160 border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-slate-200 dark:border-slate-700">
            {columns.map((col) => (
              <th
                key={col.key}
                scope="col"
                className="px-4 py-3 font-semibold text-slate-500 dark:text-slate-400"
              >
                {col.sortable ? (
                  <button
                    onClick={() => onSort?.(col.key)}
                    className="inline-flex items-center gap-1 hover:text-slate-700 dark:hover:text-slate-200"
                  >
                    {col.header}
                    <ArrowUpDown
                      className={cn(
                        "h-3.5 w-3.5",
                        sortKey === col.key && "text-primary-500",
                      )}
                    />
                  </button>
                ) : (
                  col.header
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={row[keyField]}
              className="border-b border-slate-100 last:border-0 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/60"
            >
              {columns.map((col) => (
                <td
                  key={col.key}
                  className="px-4 py-3.5 align-middle text-slate-700 dark:text-slate-300"
                >
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
