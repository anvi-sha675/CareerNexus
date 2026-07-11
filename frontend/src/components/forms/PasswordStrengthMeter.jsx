import { passwordStrength } from "../../utils/validators";
import { cn } from "../../utils/cn";

const COLORS = [
  "bg-red-400",
  "bg-orange-400",
  "bg-amber-400",
  "bg-teal-400",
  "bg-success",
];

export default function PasswordStrengthMeter({ password }) {
  if (!password) return null;
  const { score, label } = passwordStrength(password);

  return (
    <div className="mt-2" aria-live="polite">
      <div className="flex gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <span
            key={i}
            className={cn(
              "h-1.5 flex-1 rounded-full bg-slate-200 dark:bg-slate-700",
              i < score && COLORS[score - 1],
            )}
          />
        ))}
      </div>
      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
        Password strength: {label}
      </p>
    </div>
  );
}
