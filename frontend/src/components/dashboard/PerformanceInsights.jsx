import { TrendingUp, Eye, Target, Clock } from "lucide-react";
import Card from "../common/Card";

const DEFAULT_INSIGHTS = [
  {
    icon: TrendingUp,
    tone: "text-success bg-green-50",
    text: "Your application rate is up 18% compared to last month.",
  },
  {
    icon: Eye,
    tone: "text-primary-600 bg-primary-500/10",
    text: "Recruiters viewed your profile 12 times this week.",
  },
  {
    icon: Target,
    tone: "text-warning bg-amber-50",
    text: "Adding a certification could raise your average match score by ~6%.",
  },
  {
    icon: Clock,
    tone: "text-accent-600 bg-accent/10",
    text: "You typically hear back from recruiters within 4 days.",
  },
];

export default function PerformanceInsights({ insights = DEFAULT_INSIGHTS }) {
  return (
    <Card>
      <h3 className="mb-4 text-sm font-semibold text-slate-800 dark:text-slate-100">
        Performance insights
      </h3>
      <ul className="space-y-3">
        {insights.map((insight, i) => (
          <li key={i} className="flex items-start gap-3">
            <span
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${insight.tone}`}
            >
              <insight.icon className="h-4 w-4" />
            </span>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              {insight.text}
            </p>
          </li>
        ))}
      </ul>
    </Card>
  );
}
