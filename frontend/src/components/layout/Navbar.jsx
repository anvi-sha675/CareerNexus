import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X, Briefcase } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import ThemeSwitch from "./ThemeSwitch";
import Button from "../common/Button";
import { cn } from "../../utils/cn";
import { ROLES } from "../../utils/constants";

const BASE_LINKS = [
  { to: "/", label: "Home" },
  { to: "/features", label: "Features" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

const JOBS_LINK = { to: "/jobs", label: "Jobs" };

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { isAuthenticated, user } = useAuth();
  const dashboardPath = user ? `/${user.role}/dashboard` : "/login";
  const canSeeJobs = !isAuthenticated || user?.role === ROLES.STUDENT;
  const links = canSeeJobs
    ? [BASE_LINKS[0], BASE_LINKS[1], JOBS_LINK, ...BASE_LINKS.slice(2)]
    : BASE_LINKS;

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/80 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/80">
      <nav
        className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8"
        aria-label="Main navigation"
      >
        <Link
          to="/"
          className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-100"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-500 text-white">
            <Briefcase className="h-4 w-4" />
          </span>
          CareerNexus
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/"}
              className={({ isActive }) =>
                cn(
                  "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "text-primary-600"
                    : "text-slate-600 hover:text-primary-600 dark:text-slate-300",
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <ThemeSwitch />
          {isAuthenticated ? (
            <Link to={dashboardPath}>
              <Button size="sm">Dashboard</Button>
            </Link>
          ) : (
            <>
              <Link to="/login">
                <Button size="sm" variant="ghost">
                  Log in
                </Button>
              </Link>
              <Link to="/register">
                <Button size="sm">Get started</Button>
              </Link>
            </>
          )}
        </div>

        <button
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          className="rounded-lg p-2 text-slate-600 md:hidden dark:text-slate-300"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-slate-100 px-4 py-4 md:hidden dark:border-slate-800">
          <div className="flex flex-col gap-1">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === "/"}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  cn(
                    "rounded-lg px-3 py-2.5 text-sm font-medium",
                    isActive
                      ? "bg-primary-50 text-primary-600"
                      : "text-slate-600 dark:text-slate-300",
                  )
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>
          <div className="mt-3 flex items-center gap-2 border-t border-slate-100 pt-3 dark:border-slate-800">
            <ThemeSwitch />
            {isAuthenticated ? (
              <Link
                to={dashboardPath}
                className="flex-1"
                onClick={() => setOpen(false)}
              >
                <Button size="sm" fullWidth>
                  Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="flex-1"
                  onClick={() => setOpen(false)}
                >
                  <Button size="sm" variant="secondary" fullWidth>
                    Log in
                  </Button>
                </Link>
                <Link
                  to="/register"
                  className="flex-1"
                  onClick={() => setOpen(false)}
                >
                  <Button size="sm" fullWidth>
                    Get started
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
