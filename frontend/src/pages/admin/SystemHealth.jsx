import { Server, Cpu, Wifi, Mail, HardDrive, Activity } from "lucide-react";
import PageHeader from "../../components/common/PageHeader";
import Card from "../../components/common/Card";
import Badge from "../../components/common/Badge";
import ChartCard from "../../components/charts/ChartCard";
import AreaTrendChart from "../../components/charts/AreaTrendChart";

const SERVICES = [
  { name: "API Server", icon: Server, status: "Operational", latency: "128ms" },
  {
    name: "Socket.io Server",
    icon: Wifi,
    status: "Operational",
    latency: "44ms",
  },
  {
    name: "Email Service",
    icon: Mail,
    status: "Operational",
    latency: "310ms",
  },
  { name: "Background Jobs", icon: Cpu, status: "Degraded", latency: "1.2s" },
];

const RESPONSE_TIME = [
  { month: "Mon", value: 120 },
  { month: "Tue", value: 132 },
  { month: "Wed", value: 118 },
  { month: "Thu", value: 145 },
  { month: "Fri", value: 128 },
  { month: "Sat", value: 110 },
  { month: "Sun", value: 122 },
];

export default function SystemHealth() {
  return (
    <div>
      <PageHeader
        title="System Health"
        description="Live status of platform services (read-only view — wire to your monitoring provider)."
        breadcrumbs={[{ label: "System Health" }]}
      />

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {SERVICES.map((s) => (
          <Card key={s.name}>
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-500/10 text-primary-600">
                <s.icon className="h-5 w-5" />
              </div>
              <Badge tone={s.status === "Operational" ? "Active" : "Pending"}>
                {s.status}
              </Badge>
            </div>
            <p className="mt-3 text-sm font-semibold text-slate-800 dark:text-slate-100">
              {s.name}
            </p>
            <p className="text-xs text-slate-400">Avg. latency: {s.latency}</p>
          </Card>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <ChartCard title="API response time" subtitle="Last 7 days (ms)">
          <AreaTrendChart data={RESPONSE_TIME} color="#2563EB" />
        </ChartCard>
        <Card>
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-success" />
            <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
              Uptime (last 90 days)
            </h3>
          </div>
          <p className="mt-3 text-3xl font-bold text-slate-800 dark:text-slate-100">
            99.94%
          </p>
          <div className="mt-4 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
            <HardDrive className="h-4 w-4" /> Storage usage: 62% of provisioned
            capacity
          </div>
        </Card>
      </div>
    </div>
  );
}
