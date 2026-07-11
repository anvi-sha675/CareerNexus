import { FileText, Download, Eye } from "lucide-react";
import Button from "./Button";
import Card from "./Card";

export default function ResumePreview({
  fileName = "resume.pdf",
  updatedAt,
  onView,
  onDownload,
}) {
  return (
    <Card className="flex items-center justify-between gap-4" padding="p-4">
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-500/10 text-primary-600">
          <FileText className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-slate-800 dark:text-slate-100">
            {fileName}
          </p>
          {updatedAt && (
            <p className="text-xs text-slate-400">Updated {updatedAt}</p>
          )}
        </div>
      </div>
      <div className="flex shrink-0 gap-2">
        <Button
          size="sm"
          variant="secondary"
          icon={Eye}
          onClick={onView}
          aria-label="Preview resume"
        >
          View
        </Button>
        <Button
          size="sm"
          variant="ghost"
          icon={Download}
          onClick={onDownload}
          aria-label="Download resume"
        >
          Download
        </Button>
      </div>
    </Card>
  );
}
