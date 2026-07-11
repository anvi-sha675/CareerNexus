import { Link } from "react-router-dom";
import { MapPin, Briefcase, Users, Bookmark } from "lucide-react";
import { motion } from "framer-motion";
import Card from "../common/Card";
import Badge from "../common/Badge";
import { formatCurrency, timeAgo } from "../../utils/formatters";
import { cn } from "../../utils/cn";

export default function JobCard({ job, onSave, saved }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <Card hover className="flex h-full flex-col">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-500/10 text-sm font-bold text-primary-700 dark:text-primary-500">
              {job.logo}
            </div>
            <div>
              <Link
                to={`/jobs/${job.id}`}
                className="font-semibold text-slate-800 hover:text-primary-600 dark:text-slate-100"
              >
                {job.title}
              </Link>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {job.company}
              </p>
            </div>
          </div>
          {typeof job.matchScore === "number" && (
            <div
              className={cn(
                "shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold",
                job.matchScore >= 80
                  ? "bg-green-50 text-success"
                  : job.matchScore >= 60
                    ? "bg-amber-50 text-warning"
                    : "bg-slate-100 text-slate-500",
              )}
            >
              {job.matchScore}% match
            </div>
          )}
        </div>

        <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-slate-500 dark:text-slate-400">
          <span className="inline-flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" />
            {job.location}
          </span>
          <span className="inline-flex items-center gap-1">
            <Briefcase className="h-3.5 w-3.5" />
            {job.type}
          </span>
          <span className="inline-flex items-center gap-1">
            <Users className="h-3.5 w-3.5" />
            {job.applicants} applicants
          </span>
        </div>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {job.tags?.slice(0, 3).map((tag) => (
            <Badge key={tag} tone="Applied">
              {tag}
            </Badge>
          ))}
        </div>

        <div className="mt-4 flex flex-1 items-end justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              {formatCurrency(job.salaryMin)} – {formatCurrency(job.salaryMax)}
            </p>
            <p className="text-xs text-slate-400">
              Posted {timeAgo(job.postedAt)}
            </p>
          </div>
          <button
            onClick={() => onSave?.(job.id)}
            aria-pressed={saved}
            aria-label={saved ? "Remove from saved jobs" : "Save job"}
            className={cn(
              "rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-700",
              saved ? "text-primary-500" : "text-slate-400",
            )}
          >
            <Bookmark
              className="h-4 w-4"
              fill={saved ? "currentColor" : "none"}
            />
          </button>
        </div>
      </Card>
    </motion.div>
  );
}
