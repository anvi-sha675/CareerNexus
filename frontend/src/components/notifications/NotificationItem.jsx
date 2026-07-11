import { CheckCircle2, AlertTriangle, XCircle, Info } from "lucide-react";
import { cn } from "../../utils/cn";
import { timeAgo } from "../../utils/formatters";

const ICONS = {
  success: <CheckCircle2 className="h-4 w-4 text-success" />,
  warning: <AlertTriangle className="h-4 w-4 text-warning" />,
  error: <XCircle className="h-4 w-4 text-error" />,
  info: <Info className="h-4 w-4 text-primary-500" />,
};

export default function NotificationItem({ notification, onClick }) {
  return (
    <button
      onClick={() => onClick?.(notification)}
      className={cn(
        "flex w-full items-start gap-3 rounded-lg px-3 py-2.5 text-left hover:bg-slate-50 dark:hover:bg-slate-700/60",
        !notification.read && "bg-primary-50/50 dark:bg-primary-500/5",
      )}
    >
      <span className="mt-0.5 shrink-0">{ICONS[notification.type]}</span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-medium text-slate-700 dark:text-slate-200">
          {notification.title}
        </span>
        <span className="block text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
          {notification.message}
        </span>
        <span className="mt-0.5 block text-[11px] text-slate-400">
          {timeAgo(notification.createdAt)}
        </span>
      </span>
      {!notification.read && (
        <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary-500" />
      )}
    </button>
  );
}
