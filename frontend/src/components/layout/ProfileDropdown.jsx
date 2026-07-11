import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronDown, User, Settings, LogOut } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { useClickOutside } from "../../hooks/useClickOutside";
import Avatar from "../common/Avatar";

export default function ProfileDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  useClickOutside(ref, () => setOpen(false));

  const profilePath =
    user?.role === "student" ? "/student/profile" : "/settings";

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label="Open profile menu"
        className="flex items-center gap-2 rounded-lg p-1 pr-2 hover:bg-slate-100 dark:hover:bg-slate-700"
      >
        <Avatar name={user?.name} src={user?.avatar} size="sm" />
        <span className="hidden text-sm font-medium text-slate-700 sm:block dark:text-slate-200">
          {user?.name?.split(" ")[0]}
        </span>
        <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 z-40 mt-2 w-52 overflow-hidden rounded-xl border border-slate-100 bg-white py-1.5 card-shadow-lg dark:border-slate-700 dark:bg-slate-800"
          >
            <div className="border-b border-slate-100 px-3.5 py-2.5 dark:border-slate-700">
              <p className="truncate text-sm font-semibold text-slate-800 dark:text-slate-100">
                {user?.name}
              </p>
              <p className="truncate text-xs text-slate-400">{user?.email}</p>
            </div>
            <Link
              to={profilePath}
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 px-3.5 py-2 text-sm text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-700"
            >
              <User className="h-4 w-4" /> Profile
            </Link>
            <Link
              to="/settings"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 px-3.5 py-2 text-sm text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-700"
            >
              <Settings className="h-4 w-4" /> Settings
            </Link>
            <button
              onClick={() => {
                logout();
                navigate("/login");
              }}
              className="flex w-full items-center gap-2 px-3.5 py-2 text-sm text-error hover:bg-red-50 dark:hover:bg-red-500/10"
            >
              <LogOut className="h-4 w-4" /> Log out
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
