import { cn } from "../../utils/cn";

export default function Skeleton({ className }) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-slate-200 dark:bg-slate-700",
        className,
      )}
      aria-hidden="true"
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="rounded-xl bg-card p-6 card-shadow dark:bg-slate-800/60">
      <Skeleton className="mb-4 h-5 w-1/3" />
      <Skeleton className="mb-2 h-3 w-full" />
      <Skeleton className="mb-2 h-3 w-5/6" />
      <Skeleton className="h-3 w-2/3" />
    </div>
  );
}

export function StatSkeleton() {
  return (
    <div className="rounded-xl bg-card p-5 card-shadow dark:bg-slate-800/60">
      <Skeleton className="mb-3 h-4 w-1/2" />
      <Skeleton className="h-7 w-2/3" />
    </div>
  );
}
