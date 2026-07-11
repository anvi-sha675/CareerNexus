import { useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Card from "../common/Card";
import { cn } from "../../utils/cn";

const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];

export default function CalendarWidget({
  eventDates = [],
  title = "Calendar",
}) {
  const today = new Date();
  const { year, month } = {
    year: today.getFullYear(),
    month: today.getMonth(),
  };

  const eventSet = useMemo(
    () => new Set(eventDates.map((d) => new Date(d).toDateString())),
    [eventDates],
  );

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOffset = new Date(year, month, 1).getDay();
  const cells = [
    ...Array(firstDayOffset).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  return (
    <Card>
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
          {title}
        </h3>
        <div className="flex items-center gap-1 text-slate-400">
          <button
            aria-label="Previous month"
            className="rounded p-1 hover:bg-slate-100 dark:hover:bg-slate-700"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
          </button>
          <span className="text-xs font-medium text-slate-500">
            {today.toLocaleDateString("en-US", {
              month: "short",
              year: "numeric",
            })}
          </span>
          <button
            aria-label="Next month"
            className="rounded p-1 hover:bg-slate-100 dark:hover:bg-slate-700"
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-[11px] text-slate-400">
        {WEEKDAYS.map((d, i) => (
          <span key={i}>{d}</span>
        ))}
      </div>
      <div className="mt-1 grid grid-cols-7 gap-1">
        {cells.map((day, i) => {
          if (!day) return <span key={i} />;
          const date = new Date(year, month, day);
          const isToday = date.toDateString() === today.toDateString();
          const hasEvent = eventSet.has(date.toDateString());
          return (
            <div
              key={i}
              className="relative flex h-8 items-center justify-center"
            >
              <span
                className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-full text-xs",
                  isToday
                    ? "bg-primary-500 font-semibold text-white"
                    : "text-slate-600 dark:text-slate-300",
                )}
              >
                {day}
              </span>
              {hasEvent && !isToday && (
                <span className="absolute bottom-0.5 h-1 w-1 rounded-full bg-accent" />
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
}
