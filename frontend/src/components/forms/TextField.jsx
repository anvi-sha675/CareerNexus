import { forwardRef, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "../../utils/cn";

const TextField = forwardRef(
  (
    {
      label,
      error,
      hint,
      type = "text",
      icon: Icon,
      required,
      className,
      id,
      ...props
    },
    ref,
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const inputType = type === "password" && showPassword ? "text" : type;
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
          {Icon && (
            <Icon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          )}
          <input
            ref={ref}
            id={fieldId}
            type={inputType}
            aria-invalid={!!error}
            aria-describedby={
              error ? `${fieldId}-error` : hint ? `${fieldId}-hint` : undefined
            }
            className={cn(
              "w-full rounded-xl border bg-white py-2.5 text-sm text-slate-700 placeholder:text-slate-400 transition-colors focus:outline-none focus:ring-2 dark:bg-slate-800 dark:text-slate-200",
              Icon ? "pl-9" : "pl-3.5",
              type === "password" ? "pr-10" : "pr-3.5",
              error
                ? "border-error focus:ring-error/20"
                : "border-slate-200 focus:border-primary-500 focus:ring-primary-500/20 dark:border-slate-700",
            )}
            {...props}
          />
          {type === "password" && (
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          )}
        </div>
        {error && (
          <p
            id={`${fieldId}-error`}
            className="mt-1.5 text-xs font-medium text-error"
          >
            {error}
          </p>
        )}
        {!error && hint && (
          <p id={`${fieldId}-hint`} className="mt-1.5 text-xs text-slate-400">
            {hint}
          </p>
        )}
      </div>
    );
  },
);
TextField.displayName = "TextField";
export default TextField;
