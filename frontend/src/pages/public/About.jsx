import { motion } from "framer-motion";
import { Target, Heart, Rocket, Users } from "lucide-react";
import Card from "../../components/common/Card";

const VALUES = [
  {
    icon: Target,
    title: "Signal over noise",
    desc: "We optimize for genuinely good matches, not application volume.",
  },
  {
    icon: Heart,
    title: "Fair by design",
    desc: "Match scores are explainable and auditable — no black-box ranking.",
  },
  {
    icon: Rocket,
    title: "Move fast for candidates",
    desc: "Every feature is judged by whether it shortens someone's job search.",
  },
  {
    icon: Users,
    title: "Built with the community",
    desc: "Students and recruiters shape our roadmap through direct feedback.",
  },
];

const TEAM = [
  { name: "Priya Nair", role: "Co-founder & CEO" },
  { name: "Aditya Kulkarni", role: "Co-founder & CTO" },
  { name: "Sneha Reddy", role: "Head of Product" },
  { name: "Farhan Ali", role: "Head of Partnerships" },
];

export default function About() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-center"
      >
        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">
          We're building the hiring layer for early careers
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600 dark:text-slate-300">
          CareerNexus started with a simple frustration: job boards optimize for
          clicks, not careers. So we built a platform where match quality is the
          whole product.
        </p>
      </motion.div>

      <div className="mt-16 grid gap-6 sm:grid-cols-2">
        {VALUES.map((v) => (
          <Card key={v.title} className="flex gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-500/10 text-primary-600">
              <v.icon className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-800 dark:text-slate-100">
                {v.title}
              </h3>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {v.desc}
              </p>
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-20">
        <h2 className="text-center text-2xl font-bold text-slate-800 dark:text-slate-100">
          Meet the team
        </h2>
        <div className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-4">
          {TEAM.map((member) => (
            <div key={member.name} className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary-500/10 text-lg font-bold text-primary-700 dark:text-primary-500">
                {member.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
              <p className="mt-3 text-sm font-semibold text-slate-800 dark:text-slate-100">
                {member.name}
              </p>
              <p className="text-xs text-slate-400">{member.role}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
