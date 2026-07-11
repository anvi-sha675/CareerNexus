import { useCallback, useRef, useState } from "react";
import { UploadCloud, FileText, X } from "lucide-react";
import { cn } from "../../utils/cn";

export default function FileUpload({
  accept = ".pdf,.doc,.docx",
  maxSizeMB = 5,
  onFileSelect,
  file,
}) {
  const inputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState("");

  const validateAndSet = useCallback(
    (f) => {
      if (!f) return;
      if (f.size > maxSizeMB * 1024 * 1024) {
        setError(`File must be smaller than ${maxSizeMB}MB`);
        return;
      }
      setError("");
      onFileSelect(f);
    },
    [maxSizeMB, onFileSelect],
  );

  return (
    <div>
      <div
        role="button"
        tabIndex={0}
        aria-label="Upload file"
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          validateAndSet(e.dataTransfer.files?.[0]);
        }}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-10 text-center transition-colors",
          dragOver
            ? "border-primary-500 bg-primary-50 dark:bg-primary-500/10"
            : "border-slate-300 hover:border-primary-400 dark:border-slate-600",
        )}
      >
        <UploadCloud className="mb-3 h-8 w-8 text-primary-500" />
        <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
          Drag & drop your file, or click to browse
        </p>
        <p className="mt-1 text-xs text-slate-400">
          {accept.replaceAll(".", "").toUpperCase()} up to {maxSizeMB}MB
        </p>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={(e) => validateAndSet(e.target.files?.[0])}
        />
      </div>
      {error && <p className="mt-2 text-xs font-medium text-error">{error}</p>}
      {file && (
        <div className="mt-3 flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2 dark:border-slate-700">
          <div className="flex items-center gap-2 min-w-0">
            <FileText className="h-4 w-4 shrink-0 text-primary-500" />
            <span className="truncate text-sm text-slate-700 dark:text-slate-200">
              {file.name}
            </span>
          </div>
          <button
            onClick={() => onFileSelect(null)}
            aria-label="Remove file"
            className="text-slate-400 hover:text-error"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
