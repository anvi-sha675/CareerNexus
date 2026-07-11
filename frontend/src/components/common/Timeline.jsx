import { cn } from "../../utils/cn";

export default function Timeline({ items }) {
  return (
    <ol className="relative space-y-6 border-l border-slate-200 pl-6 dark:border-slate-700">
      {items.map((item, i) => (
        <li key={item.id || i} className="relative">
          <span
            className={cn(
              "absolute -left-7.25 flex h-4 w-4 items-center justify-center rounded-full ring-4 ring-white dark:ring-slate-900",
              item.tone === "success"
                ? "bg-success"
                : item.tone === "warning"
                  ? "bg-warning"
                  : item.tone === "error"
                    ? "bg-error"
                    : "bg-primary-500",
            )}
          />
          <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
            {item.title}
          </p>
          {item.description && (
            <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
              {item.description}
            </p>
          )}
          {item.timestamp && (
            <p className="mt-1 text-xs text-slate-400">{item.timestamp}</p>
          )}
        </li>
      ))}
    </ol>
  );
}
