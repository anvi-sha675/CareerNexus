import { Wrench } from "lucide-react";

export default function Maintenance() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-amber-50 text-warning dark:bg-amber-500/10">
        <Wrench className="h-10 w-10" />
      </div>
      <p className="text-sm font-semibold text-warning">
        Scheduled maintenance
      </p>
      <h1 className="mt-2 text-3xl font-extrabold text-slate-900 dark:text-white">
        We'll be right back
      </h1>
      <p className="mt-3 max-w-md text-slate-500 dark:text-slate-400">
        CareerNexus is undergoing scheduled maintenance to ship improvements. We
        expect to be back online shortly — thanks for your patience.
      </p>
      <p className="mt-6 text-sm text-slate-400">
        Follow @careernexus for live status updates.
      </p>
    </div>
  );
}
