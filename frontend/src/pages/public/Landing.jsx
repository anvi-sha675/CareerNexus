import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Sparkles,
  Target,
  ShieldCheck,
  Zap,
  BarChart3,
  Users2,
  Star,
  CheckCircle2,
  FileSearch,
  CalendarClock,
  LineChart,
} from "lucide-react";
import Button from "../../components/common/Button";
import Card from "../../components/common/Card";
import Accordion from "../../components/common/Accordion";

const STATS = [
  { label: "Active students", value: "8,400+" },
  { label: "Partner companies", value: "420+" },
  { label: "Jobs matched", value: "12,600+" },
  { label: "Avg. match accuracy", value: "91%" },
];

const FEATURES = [
  {
    icon: Target,
    title: "AI Match Scoring",
    desc: "Every job is ranked against your profile with a transparent, explainable match score.",
  },
  {
    icon: FileSearch,
    title: "Resume Intelligence",
    desc: "Upload your resume once — we parse it, score it, and keep your profile current automatically.",
  },
  {
    icon: CalendarClock,
    title: "Interview Scheduling",
    desc: "Recruiters and candidates coordinate interviews without the email back-and-forth.",
  },
  {
    icon: BarChart3,
    title: "Hiring Analytics",
    desc: "Recruiters get a real-time pipeline view from application to offer.",
  },
  {
    icon: ShieldCheck,
    title: "Verified Recruiters",
    desc: "Every company on CareerNexus is manually reviewed before they can post a role.",
  },
  {
    icon: Zap,
    title: "Real-time Updates",
    desc: "Status changes, interview invites, and messages land instantly — no refreshing required.",
  },
];

const STEPS = [
  {
    title: "Build your profile",
    desc: "Import your resume or build one from scratch with our guided editor.",
  },
  {
    title: "Get matched",
    desc: "Our AI ranks open roles by fit, not just keywords.",
  },
  {
    title: "Apply & track",
    desc: "Apply in one click and track every application from a single dashboard.",
  },
  {
    title: "Land the offer",
    desc: "Schedule interviews, get feedback, and close out your search.",
  },
];

const TESTIMONIALS = [
  {
    name: "Ananya Iyer",
    role: "SDE, NimbusCloud",
    quote:
      "The match scores actually mean something — I stopped wasting time on roles that were never a fit.",
  },
  {
    name: "Karthik Menon",
    role: "Talent Lead, TechFlow Systems",
    quote:
      "Our pipeline visibility improved overnight. We fill roles about 30% faster now.",
  },
  {
    name: "Rhea Kapoor",
    role: "New Grad, Loopwork",
    quote:
      "Uploading my resume once and having it work across every application saved me hours.",
  },
];

const FAQS = [
  {
    key: "f1",
    question: "Is CareerNexus free for students?",
    answer:
      "Yes — creating a profile, applying to jobs, and using resume tools is completely free for students.",
  },
  {
    key: "f2",
    question: "How does the match score work?",
    answer:
      "We compare your skills, experience, and preferences against a role's requirements using a weighted model, then explain the score in plain language.",
  },
  {
    key: "f3",
    question: "How are recruiters verified?",
    answer:
      "Every company account is reviewed by our team before it can publish live roles, and we monitor for policy violations continuously.",
  },
  {
    key: "f4",
    question: "Can I use CareerNexus on mobile?",
    answer:
      "Yes, the entire platform is fully responsive and works well on phones, tablets, and desktops.",
  },
];

export default function Landing() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-linear-to-b from-primary-50/60 to-white dark:from-slate-900 dark:to-slate-950">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-28">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-500/10 px-3 py-1.5 text-xs font-semibold text-primary-700 dark:text-primary-400">
              <Sparkles className="h-3.5 w-3.5" /> AI-powered career matching
            </span>
            <h1 className="mt-5 text-4xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-5xl lg:text-6xl dark:text-white">
              Land the right role,{" "}
              <span className="text-primary-600">not just any role</span>
            </h1>
            <p className="mt-5 max-w-lg text-lg text-slate-600 dark:text-slate-300">
              CareerNexus matches students to jobs using explainable AI, gives
              recruiters a real hiring pipeline, and cuts the noise out of the
              job search for everyone.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/register">
                <Button size="lg" iconRight={ArrowRight}>
                  Get started free
                </Button>
              </Link>
              <Link to="/features">
                <Button size="lg" variant="secondary">
                  See how it works
                </Button>
              </Link>
            </div>
            <div className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-4">
              {STATS.map((stat) => (
                <div key={stat.label}>
                  <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                    {stat.value}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            <Card className="relative" padding="p-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-700">
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                  Frontend Engineer
                </p>
                <span className="rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-success">
                  92% match
                </span>
              </div>
              <div className="space-y-3 py-4">
                {["React", "TypeScript", "Tailwind CSS"].map((skill) => (
                  <div
                    key={skill}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="text-slate-500 dark:text-slate-400">
                      {skill}
                    </span>
                    <CheckCircle2 className="h-4 w-4 text-success" />
                  </div>
                ))}
              </div>
              <div className="rounded-xl bg-primary-50 p-4 dark:bg-primary-500/10">
                <p className="flex items-center gap-2 text-sm font-medium text-primary-700 dark:text-primary-400">
                  <LineChart className="h-4 w-4" /> Profile trending up 12% this
                  month
                </p>
              </div>
            </Card>
            <Card
              className="absolute -bottom-6 -left-6 hidden sm:block"
              padding="p-4"
            >
              <div className="flex items-center gap-3">
                <Users2 className="h-8 w-8 rounded-lg bg-accent/10 p-1.5 text-accent-600" />
                <div>
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                    134 applicants
                  </p>
                  <p className="text-xs text-slate-400">this week</p>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section
        id="features"
        className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8"
      >
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100">
            Everything a modern hiring platform needs
          </h2>
          <p className="mt-3 text-slate-500 dark:text-slate-400">
            Built for students who want signal over noise, and recruiters who
            want a real pipeline.
          </p>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
            >
              <Card hover className="h-full">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary-500/10 text-primary-600">
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-slate-800 dark:text-slate-100">
                  {f.title}
                </h3>
                <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
                  {f.desc}
                </p>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Workflow */}
      <section className="bg-slate-50 py-20 dark:bg-slate-900/40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100">
              How it works
            </h2>
            <p className="mt-3 text-slate-500 dark:text-slate-400">
              From profile to offer in four steps.
            </p>
          </div>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((step, i) => (
              <div key={step.title} className="relative">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary-500 font-bold text-white">
                  {i + 1}
                </div>
                <h3 className="font-semibold text-slate-800 dark:text-slate-100">
                  {step.title}
                </h3>
                <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100">
            Loved by students and recruiters
          </h2>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <Card key={t.name}>
              <div className="mb-3 flex gap-0.5 text-warning">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4" fill="currentColor" />
                ))}
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                "{t.quote}"
              </p>
              <p className="mt-4 text-sm font-semibold text-slate-800 dark:text-slate-100">
                {t.name}
              </p>
              <p className="text-xs text-slate-400">{t.role}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-slate-50 py-20 dark:bg-slate-900/40">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl font-bold text-slate-800 dark:text-slate-100">
            Frequently asked questions
          </h2>
          <div className="mt-10">
            <Accordion items={FAQS} />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <Card
          className="flex flex-col items-center gap-6 bg-linear-to-br from-primary-600 to-primary-700 p-12 text-center text-white sm:p-16"
          padding=""
        >
          <h2 className="text-3xl font-bold">Ready to find your next role?</h2>
          <p className="max-w-lg text-primary-100">
            Join thousands of students and hundreds of companies already hiring
            smarter with CareerNexus.
          </p>
          <Link to="/register">
            <Button
              size="lg"
              variant="secondary"
              className="bg-white! text-primary-700!"
            >
              Create your free account
            </Button>
          </Link>
        </Card>
      </section>
    </div>
  );
}
