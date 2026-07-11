import { Link } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";

export default function Breadcrumbs({ items = [] }) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="mb-4 flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400"
    >
      <Link
        to="/"
        className="flex items-center hover:text-primary-600"
        aria-label="Home"
      >
        <Home className="h-3.5 w-3.5" />
      </Link>
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1.5">
          <ChevronRight className="h-3.5 w-3.5 text-slate-300" />
          {item.to ? (
            <Link to={item.to} className="hover:text-primary-600">
              {item.label}
            </Link>
          ) : (
            <span className="font-medium text-slate-700 dark:text-slate-200">
              {item.label}
            </span>
          )}
        </span>
      ))}
    </nav>
  );
}
