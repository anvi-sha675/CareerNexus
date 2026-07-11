import { Link } from "react-router-dom";
import Card from "../common/Card";

export default function RecentJobsList({
  jobs = [],
  title = "Recommended for you",
}) {
  return (
    <Card>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
          {title}
        </h3>
        <Link
          to="/jobs"
          className="text-xs font-medium text-primary-600 hover:underline"
        >
          View all
        </Link>
      </div>
      <ul className="divide-y divide-slate-100 dark:divide-slate-700">
        {jobs.map((job) => (
          <li
            key={job.id}
            className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-500/10 text-xs font-bold text-primary-700 dark:text-primary-500">
                {job.logo}
              </div>
              <div className="min-w-0">
                <Link
                  to={`/jobs/${job.id}`}
                  className="truncate block text-sm font-medium text-slate-700 hover:text-primary-600 dark:text-slate-200"
                >
                  {job.title}
                </Link>
                <p className="text-xs text-slate-400">
                  {job.company} · {job.location}
                </p>
              </div>
            </div>
            <span className="shrink-0 text-xs font-semibold text-success">
              {job.matchScore}%
            </span>
          </li>
        ))}
      </ul>
    </Card>
  );
}
