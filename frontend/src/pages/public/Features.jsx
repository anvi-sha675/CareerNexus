import { Link } from "react-router-dom";
import {
  Target,
  FileSearch,
  CalendarClock,
  BarChart3,
  Bell,
  Search,
  LayoutDashboard,
  MessageSquare,
  ArrowRight,
  Check,
} from "lucide-react";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Tabs from "../../components/common/Tabs";

const STUDENT_FEATURES = [
  {
    icon: Target,
    title: "Explainable match scores",
    desc: "See exactly why a job is (or isn't) a fit before you apply.",
  },
  {
    icon: FileSearch,
    title: "One resume, everywhere",
    desc: "Upload once — we parse and reuse it across every application.",
  },
  {
    icon: Search,
    title: "Powerful filters",
    desc: "Filter by type, experience, salary band, and remote preference.",
  },
  {
    icon: Bell,
    title: "Real-time status updates",
    desc: "Know the moment your application moves stages.",
  },
];

const RECRUITER_FEATURES = [
  {
    icon: LayoutDashboard,
    title: "Pipeline dashboard",
    desc: "See every candidate's stage at a glance, from applied to offer.",
  },
  {
    icon: CalendarClock,
    title: "Interview scheduling",
    desc: "Coordinate interviews without leaving the platform.",
  },
  {
    icon: BarChart3,
    title: "Hiring analytics",
    desc: "Track time-to-hire, funnel conversion, and source quality.",
  },
  {
    icon: MessageSquare,
    title: "Candidate messaging",
    desc: "Keep every conversation tied to the application it belongs to.",
  },
];

const PLANS = [
  {
    name: "Starter",
    price: "Free",
    desc: "For students and small teams getting started.",
    features: [
      "Unlimited applications",
      "1 active job post",
      "Basic analytics",
    ],
  },
  {
    name: "Growth",
    price: "₹4,999/mo",
    desc: "For growing teams hiring regularly.",
    features: [
      "Unlimited job posts",
      "Full pipeline analytics",
      "Priority support",
      "Team collaboration",
    ],
    highlight: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    desc: "For organizations with complex hiring needs.",
    features: [
      "Dedicated account manager",
      "SSO & advanced permissions",
      "Custom integrations",
    ],
  },
];

export default function Features() {
  return (
    <div>
      <section className="bg-linear-to-b from-primary-50/60 to-white py-16 dark:from-slate-900 dark:to-slate-950">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">
            Features built for both sides of hiring
          </h1>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">
            Whether you're job hunting or hiring, CareerNexus gives you the
            tools to move faster with more signal.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <Tabs
          tabs={[
            {
              key: "students",
              label: "For Students",
              content: (
                <div className="grid gap-6 sm:grid-cols-2">
                  {STUDENT_FEATURES.map((f) => (
                    <Card key={f.title} className="flex gap-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-500/10 text-primary-600">
                        <f.icon className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-800 dark:text-slate-100">
                          {f.title}
                        </h3>
                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                          {f.desc}
                        </p>
                      </div>
                    </Card>
                  ))}
                </div>
              ),
            },
            {
              key: "recruiters",
              label: "For Recruiters",
              content: (
                <div className="grid gap-6 sm:grid-cols-2">
                  {RECRUITER_FEATURES.map((f) => (
                    <Card key={f.title} className="flex gap-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent-600">
                        <f.icon className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-800 dark:text-slate-100">
                          {f.title}
                        </h3>
                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                          {f.desc}
                        </p>
                      </div>
                    </Card>
                  ))}
                </div>
              ),
            },
          ]}
        />
      </section>

      <section className="bg-slate-50 py-16 dark:bg-slate-900/40">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100">
              Simple, transparent pricing
            </h2>
            <p className="mt-3 text-slate-500 dark:text-slate-400">
              Free for students, always. Recruiters pay only for what they need.
            </p>
          </div>
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {PLANS.map((plan) => (
              <Card
                key={plan.name}
                className={plan.highlight ? "border-2 border-primary-500" : ""}
              >
                <h3 className="font-semibold text-slate-800 dark:text-slate-100">
                  {plan.name}
                </h3>
                <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
                  {plan.price}
                </p>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  {plan.desc}
                </p>
                <ul className="mt-5 space-y-2.5">
                  {plan.features.map((f) => (
                    <li
                      key={f}
                      className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300"
                    >
                      <Check className="h-4 w-4 text-success" /> {f}
                    </li>
                  ))}
                </ul>
                <Link to="/register" className="mt-6 block">
                  <Button
                    fullWidth
                    variant={plan.highlight ? "primary" : "secondary"}
                    iconRight={ArrowRight}
                  >
                    Get started
                  </Button>
                </Link>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
