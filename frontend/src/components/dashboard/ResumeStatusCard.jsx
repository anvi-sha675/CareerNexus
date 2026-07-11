import { Link } from "react-router-dom";
import { FileCheck2, FileWarning } from "lucide-react";
import Card from "../common/Card";

export default function ResumeStatusCard({ hasResume, fileName, atsScore }) {
  return (
    <Card>
      <h3 className="mb-3 text-sm font-semibold text-slate-800 dark:text-slate-100">
        Resume status
      </h3>
      {hasResume ? (
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 text-success">
            <FileCheck2 className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-slate-700 dark:text-slate-200">
              {fileName}
            </p>
            <p className="text-xs text-slate-400">ATS score: {atsScore}/100</p>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-warning">
            <FileWarning className="h-5 w-5" />
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            No resume uploaded yet.
          </p>
        </div>
      )}
      <Link
        to="/student/resume-upload"
        className="mt-4 flex w-full items-center justify-center rounded-xl border border-slate-200 bg-white py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
      >
        {hasResume ? "Update resume" : "Upload resume"}
      </Link>
    </Card>
  );
}
