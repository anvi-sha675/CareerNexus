import PageHeader from "../../components/common/PageHeader";
import Card from "../../components/common/Card";
import Avatar from "../../components/common/Avatar";
import Table from "../../components/common/Table";
import ChartCard from "../../components/charts/ChartCard";
import { useAsync } from "../../hooks/useAsync";
import * as applicationsService from "../../services/applicationsService";
import { ResponsiveContainer, RadialBarChart, RadialBar } from "recharts";

const MISSING_SKILLS = [
  { skill: "GraphQL", frequency: 34 },
  { skill: "Kubernetes", frequency: 28 },
  { skill: "System Design", frequency: 22 },
  { skill: "Terraform", frequency: 17 },
];

export default function MatchingDashboard() {
  const { data: applicants, loading } = useAsync(
    () => applicationsService.getApplicantsForJob("j1"),
    [],
  );
  const ranked = (applicants || [])
    .slice()
    .sort((a, b) => b.matchScore - a.matchScore);

  const columns = [
    { key: "rank", header: "#", render: (row) => row.rank },
    {
      key: "name",
      header: "Candidate",
      render: (row) => (
        <div className="flex items-center gap-2.5">
          <Avatar name={row.name} size="sm" />
          <span className="font-medium text-slate-800 dark:text-slate-100">
            {row.name}
          </span>
        </div>
      ),
    },
    {
      key: "matchScore",
      header: "Overall match",
      render: (row) => (
        <span className="font-semibold text-success">{row.matchScore}%</span>
      ),
    },
    {
      key: "recommendation",
      header: "Recommendation",
      render: (row) => (
        <span
          className={
            row.matchScore >= 80
              ? "text-success"
              : row.matchScore >= 60
                ? "text-warning"
                : "text-slate-400"
          }
        >
          {row.matchScore >= 80
            ? "Strong fit"
            : row.matchScore >= 60
              ? "Worth a look"
              : "Below threshold"}
        </span>
      ),
    },
  ];

  const avgMatch = ranked.length
    ? Math.round(ranked.reduce((s, a) => s + a.matchScore, 0) / ranked.length)
    : 0;

  return (
    <div>
      <PageHeader
        title="Matching Dashboard"
        description="AI-ranked candidates for your open roles."
        breadcrumbs={[{ label: "Matching Dashboard" }]}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <ChartCard title="Average match score" loading={loading} height={220}>
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart
              innerRadius="70%"
              outerRadius="100%"
              data={[{ name: "Match", value: avgMatch, fill: "#2563EB" }]}
              startAngle={90}
              endAngle={-270}
            >
              <RadialBar background dataKey="value" cornerRadius={12} />
            </RadialBarChart>
          </ResponsiveContainer>
        </ChartCard>

        <Card className="lg:col-span-2">
          <h3 className="mb-4 text-sm font-semibold text-slate-800 dark:text-slate-100">
            Most common missing skills
          </h3>
          <div className="space-y-3">
            {MISSING_SKILLS.map((s) => (
              <div key={s.skill}>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600 dark:text-slate-300">
                    {s.skill}
                  </span>
                  <span className="text-slate-400">
                    {s.frequency}% of candidates
                  </span>
                </div>
                <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700">
                  <div
                    className="h-full rounded-full bg-warning"
                    style={{ width: `${s.frequency}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="mt-6">
        <h3 className="mb-4 text-sm font-semibold text-slate-800 dark:text-slate-100">
          Ranked candidates
        </h3>
        <Table
          columns={columns}
          rows={ranked.map((r, i) => ({ ...r, rank: i + 1 }))}
          loading={loading}
          emptyProps={{ title: "No candidates to rank yet" }}
        />
      </Card>
    </div>
  );
}
