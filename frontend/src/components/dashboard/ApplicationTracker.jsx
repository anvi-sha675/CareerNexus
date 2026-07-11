import Card from "../common/Card";
import Badge from "../common/Badge";
import EmptyState from "../common/EmptyState";
import { formatDate } from "../../utils/formatters";
import { ClipboardList } from "lucide-react";

export default function ApplicationTracker({ applications = [] }) {
  return (
    <Card>
      <h3 className="mb-4 text-sm font-semibold text-slate-800 dark:text-slate-100">
        Application tracker
      </h3>
      {applications.length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          title="No applications yet"
          description="Jobs you apply to will show up here."
        />
      ) : (
        <ul className="divide-y divide-slate-100 dark:divide-slate-700">
          {applications.map((app) => (
            <li
              key={app.id}
              className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-slate-700 dark:text-slate-200">
                  {app.jobTitle}
                </p>
                <p className="text-xs text-slate-400">
                  {app.company} · Applied {formatDate(app.appliedAt)}
                </p>
              </div>
              <Badge>{app.status}</Badge>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
