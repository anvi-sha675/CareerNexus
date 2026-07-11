import { Link, Outlet } from "react-router-dom";
import { Briefcase, ShieldCheck, Zap, Target } from "lucide-react";

const POINTS = [
  { icon: Target, text: "AI-explained match scores on every job" },
  { icon: ShieldCheck, text: "Every recruiter manually verified" },
  { icon: Zap, text: "Real-time application tracking" },
];

export default function AuthLayout() {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="flex flex-col justify-center px-4 py-12 sm:px-6 lg:px-16">
        <Link
          to="/"
          className="mb-10 flex items-center gap-2 font-bold text-slate-800 dark:text-slate-100"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-500 text-white">
            <Briefcase className="h-4 w-4" />
          </span>
          CareerNexus
        </Link>
        <div className="mx-auto w-full max-w-sm">
          <Outlet />
        </div>
      </div>
      <div className="hidden bg-sidebar lg:flex lg:flex-col lg:justify-center lg:px-16">
        <h2 className="text-3xl font-bold text-white">
          Your next role is a match away
        </h2>
        <p className="mt-3 text-slate-300">
          Join thousands of students and recruiters using explainable AI to hire
          smarter.
        </p>
        <div className="mt-10 space-y-5">
          {POINTS.map((p) => (
            <div key={p.text} className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-accent">
                <p.icon className="h-4 w-4" />
              </span>
              <span className="text-sm text-slate-200">{p.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
