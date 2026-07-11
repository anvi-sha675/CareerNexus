import { Loader2 } from "lucide-react";
import { cn } from "../../utils/cn";

export default function Spinner({ className, label = "Loading" }) {
  return (
    <div role="status" className="flex items-center justify-center py-10">
      <Loader2
        className={cn("h-6 w-6 animate-spin text-primary-500", className)}
      />
      <span className="sr-only">{label}</span>
    </div>
  );
}
