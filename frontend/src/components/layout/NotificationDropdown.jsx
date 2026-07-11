import { useRef, useState } from "react";
import { Bell } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useClickOutside } from "../../hooks/useClickOutside";
import { useAsync } from "../../hooks/useAsync";
import * as notificationsService from "../../services/notificationsService";
import NotificationItem from "../notifications/NotificationItem";
import Spinner from "../common/Spinner";
import EmptyState from "../common/EmptyState";
import { Link } from "react-router-dom";

export default function NotificationDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useClickOutside(ref, () => setOpen(false));

  const { data: notifications, loading } = useAsync(
    notificationsService.getNotifications,
    [],
  );
  const unreadCount = notifications?.filter((n) => !n.read).length || 0;

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ""}`}
        aria-expanded={open}
        className="relative flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700"
      >
        <Bell className="h-4.5 w-4.5" />
        {unreadCount > 0 && (
          <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-error text-[10px] font-bold text-white">
            {unreadCount}
          </span>
        )}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 z-40 mt-2 w-80 rounded-xl border border-slate-100 bg-white p-2 card-shadow-lg dark:border-slate-700 dark:bg-slate-800"
          >
            <div className="flex items-center justify-between px-2 py-1.5">
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                Notifications
              </p>
              <Link
                to="/student/notifications"
                onClick={() => setOpen(false)}
                className="text-xs font-medium text-primary-600 hover:underline"
              >
                View all
              </Link>
            </div>
            <div className="max-h-80 overflow-y-auto scrollbar-thin">
              {loading ? (
                <Spinner />
              ) : notifications?.length ? (
                notifications
                  .slice(0, 5)
                  .map((n) => <NotificationItem key={n.id} notification={n} />)
              ) : (
                <EmptyState
                  title="You're all caught up"
                  description="No new notifications."
                />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
