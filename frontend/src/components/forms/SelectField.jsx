import { forwardRef } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "../../utils/cn";

const SelectField = forwardRef(
  (
    {
      label,
      error,
      options = [],
      required,
      className,
      id,
      placeholder,
      ...props
    },
    ref,
  ) => {
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
        <div className="relative">
          <select
            ref={ref}
            id={fieldId}
            aria-invalid={!!error}
            className={cn(
              "w-full appearance-none rounded-xl border bg-white py-2.5 pl-3.5 pr-9 text-sm text-slate-700 focus:outline-none focus:ring-2 dark:bg-slate-800 dark:text-slate-200",
              error
                ? "border-error focus:ring-error/20"
                : "border-slate-200 focus:border-primary-500 focus:ring-primary-500/20 dark:border-slate-700",
            )}
            {...props}
          >
            {placeholder && <option value="">{placeholder}</option>}
            {options.map((opt) => (
              <option key={opt.value ?? opt} value={opt.value ?? opt}>
                {opt.label ?? opt}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        </div>
        {error && (
          <p className="mt-1.5 text-xs font-medium text-error">{error}</p>
        )}
      </div>
    );
  },
);
SelectField.displayName = "SelectField";
export default SelectField;
