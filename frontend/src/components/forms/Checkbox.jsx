import { forwardRef } from "react";

const Checkbox = forwardRef(({ label, id, ...props }, ref) => {
  const fieldId = id || props.name;
  return (
    <label
      htmlFor={fieldId}
      className="flex cursor-pointer items-center gap-2 text-sm text-slate-600 dark:text-slate-300"
    >
      <input
        ref={ref}
        id={fieldId}
        type="checkbox"
        className="h-4 w-4 rounded border-slate-300 text-primary-500 focus:ring-2 focus:ring-primary-500/30 dark:border-slate-600 dark:bg-slate-800"
        {...props}
      />
      {label}
    </label>
  );
});
Checkbox.displayName = "Checkbox";
export default Checkbox;
