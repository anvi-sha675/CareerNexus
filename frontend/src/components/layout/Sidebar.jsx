import { NavLink } from "react-router-dom";
import { Briefcase } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { NAV_BY_ROLE, COMMON_NAV } from "./navConfig";
import { cn } from "../../utils/cn";

export default function Sidebar({ className }) {
  const { user } = useAuth();
  const items = NAV_BY_ROLE[user?.role] || [];

  return (
    <aside
      className={cn(
        "flex h-full w-64 shrink-0 flex-col bg-sidebar text-slate-300",
        className,
      )}
    >
      <div className="flex h-16 shrink-0 items-center gap-2 px-6 font-bold text-white">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-500">
          <Briefcase className="h-4 w-4" />
        </span>
        CareerNexus
      </div>
      <nav
        className="flex-1 space-y-1 overflow-y-auto px-3 py-4 scrollbar-thin"
        aria-label="Dashboard navigation"
      >
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary-500 text-white"
                  : "text-slate-300 hover:bg-white/5 hover:text-white",
              )
            }
          >
            <item.icon className="h-4.5 w-4.5 shrink-0" />
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="space-y-1 border-t border-white/10 px-3 py-4">
        {COMMON_NAV.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary-500 text-white"
                  : "text-slate-300 hover:bg-white/5 hover:text-white",
              )
            }
          >
            <item.icon className="h-4.5 w-4.5 shrink-0" />
            {item.label}
          </NavLink>
        ))}
      </div>
    </aside>
  );
}
