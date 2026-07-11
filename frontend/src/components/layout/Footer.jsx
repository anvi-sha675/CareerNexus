import { Link } from "react-router-dom";
import { Briefcase, Globe, Link2, Code2 } from "lucide-react";

const COLUMNS = [
  {
    title: "Product",
    links: [
      { label: "Features", to: "/features" },
      { label: "Jobs", to: "/jobs" },
      { label: "For Recruiters", to: "/register" },
      { label: "Pricing", to: "/features" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", to: "/about" },
      { label: "Contact", to: "/contact" },
      { label: "FAQ", to: "/faq" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", to: "/privacy" },
      { label: "Terms of Service", to: "/terms" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-5">
          <div className="col-span-2">
            <Link
              to="/"
              className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-100"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-500 text-white">
                <Briefcase className="h-4 w-4" />
              </span>
              CareerNexus
            </Link>
            <p className="mt-3 max-w-xs text-sm text-slate-500 dark:text-slate-400">
              AI-powered hiring intelligence connecting ambitious students with
              the companies building the future.
            </p>
            <div className="mt-4 flex gap-3">
              {[Globe, Link2, Code2].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  aria-label="Social link"
                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-500 hover:bg-primary-50 hover:text-primary-600 dark:bg-slate-800 dark:text-slate-400"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                {col.title}
              </h3>
              <ul className="mt-3 space-y-2">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-sm text-slate-500 hover:text-primary-600 dark:text-slate-400"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-slate-100 pt-6 sm:flex-row dark:border-slate-800">
          <p className="text-xs text-slate-400">
            © {new Date().getFullYear()} CareerNexus. All rights reserved.
          </p>
          <p className="text-xs text-slate-400">Built for ambitious careers.</p>
        </div>
      </div>
    </footer>
  );
}
