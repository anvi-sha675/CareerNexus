import { Link } from "react-router-dom";
import Card from "../common/Card";
import { ArrowRight } from "lucide-react";

export default function ProfileCompletionWidget({
  percentage = 0,
  tasks = [],
}) {
  return (
    <Card>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
          Profile completion
        </h3>
        <span className="text-sm font-bold text-primary-600">
          {percentage}%
        </span>
      </div>
      <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700">
        <div
          className="h-full rounded-full bg-linear-to-r from-primary-500 to-accent transition-all"
          style={{ width: `${percentage}%` }}
        />
      </div>
      {tasks.length > 0 && (
        <ul className="mt-4 space-y-2">
          {tasks.map((task) => (
            <li
              key={task}
              className="text-xs text-slate-500 dark:text-slate-400"
            >
              • {task}
            </li>
          ))}
        </ul>
      )}
      <Link
        to="/student/profile"
        className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary-600 hover:underline"
      >
        Complete profile <ArrowRight className="h-3.5 w-3.5" />
      </Link>
    </Card>
  );
}
