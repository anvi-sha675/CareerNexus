import { forwardRef } from "react";
import { cn } from "../../utils/cn";

const TextareaField = forwardRef(
  ({ label, error, required, className, id, rows = 4, ...props }, ref) => {
    const fieldId = id || props.name;
    return (
      <div className={className}>
        {label && (
          <label
            htmlFor={fieldId}
            className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200"
          >
            {label} {required && <span className="text-error">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          id={fieldId}
          rows={rows}
          aria-invalid={!!error}
          className={cn(
            "w-full resize-y rounded-xl border bg-white px-3.5 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 dark:bg-slate-800 dark:text-slate-200",
            error
              ? "border-error focus:ring-error/20"
              : "border-slate-200 focus:border-primary-500 focus:ring-primary-500/20 dark:border-slate-700",
          )}
          {...props}
        />
        {error && (
          <p className="mt-1.5 text-xs font-medium text-error">{error}</p>
        )}
      </div>
    );
  },
);
TextareaField.displayName = "TextareaField";
export default TextareaField;
