import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPortal } from "react-dom";
import { Search, ArrowRight } from "lucide-react";

const ACTIONS = [
  { label: "Go to Jobs", to: "/jobs" },
  { label: "Go to Dashboard", to: "/student/dashboard" },
  { label: "View Applications", to: "/student/applications" },
  { label: "Open Settings", to: "/settings" },
];

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  if (!open) return null;

  const filtered = ACTIONS.filter((a) =>
    a.label.toLowerCase().includes(query.toLowerCase()),
  );

  return createPortal(
    <div
      className="fixed inset-0 z-110 flex items-start justify-center pt-24"
      role="dialog"
      aria-modal="true"
      aria-label="Command palette"
    >
      <div
        className="absolute inset-0 bg-slate-900/50"
        onClick={() => setOpen(false)}
      />
      <div className="relative z-10 w-full max-w-lg overflow-hidden rounded-2xl bg-white card-shadow-lg dark:bg-slate-800">
        <div className="flex items-center gap-2 border-b border-slate-100 px-4 py-3 dark:border-slate-700">
          <Search className="h-4 w-4 text-slate-400" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or search..."
            className="w-full bg-transparent text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none dark:text-slate-200"
          />
          <kbd className="rounded border border-slate-200 px-1.5 py-0.5 text-[10px] text-slate-400 dark:border-slate-600">
            ESC
          </kbd>
        </div>
        <ul className="max-h-72 overflow-y-auto p-2">
          {filtered.map((action) => (
            <li key={action.to}>
              <button
                onClick={() => {
                  navigate(action.to);
                  setOpen(false);
                  setQuery("");
                }}
                className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-700"
              >
                {action.label}
                <ArrowRight className="h-3.5 w-3.5 text-slate-300" />
              </button>
            </li>
          ))}
          {filtered.length === 0 && (
            <li className="px-3 py-6 text-center text-sm text-slate-400">
              No matching commands
            </li>
          )}
        </ul>
      </div>
    </div>,
    document.body,
  );
}
