import { Users, Building2, Briefcase, DollarSign } from "lucide-react";
import PageHeader from "../../components/common/PageHeader";
import StatCard from "../../components/common/StatCard";
import ChartCard from "../../components/charts/ChartCard";
import AreaTrendChart from "../../components/charts/AreaTrendChart";
import DonutChart from "../../components/charts/DonutChart";
import Table from "../../components/common/Table";
import Badge from "../../components/common/Badge";
import Card from "../../components/common/Card";
import { useAsync } from "../../hooks/useAsync";
import * as analyticsService from "../../services/analyticsService";
import * as usersService from "../../services/usersService";
import { formatDate } from "../../utils/formatters";

export default function AdminDashboard() {
  const { data: analytics, loading: analyticsLoading } = useAsync(
    analyticsService.getPlatformAnalytics,
    [],
  );
  const { data: recruiters, loading: recruitersLoading } = useAsync(
    usersService.getRecruiters,
    [],
  );

  const pendingRecruiters =
    recruiters?.filter((r) => r.status === "Pending") || [];

  const columns = [
    {
      key: "company",
      header: "Company",
      render: (row) => (
        <span className="font-medium text-slate-800 dark:text-slate-100">
          {row.company}
        </span>
      ),
    },
    { key: "contact", header: "Contact" },
    {
      key: "joinedAt",
      header: "Applied",
      render: (row) => formatDate(row.joinedAt),
    },
    {
      key: "status",
      header: "Status",
      render: (row) => <Badge>{row.status}</Badge>,
    },
  ];

  return (
    <div>
      <PageHeader
        title="Admin Dashboard"
        description="Platform-wide overview and moderation queue."
      />

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total users"
          value="8,832"
          icon={Users}
          tone="primary"
        />
        <StatCard
          label="Verified recruiters"
          value="420"
          icon={Building2}
          tone="accent"
        />
        <StatCard
          label="Active job posts"
          value="1,204"
          icon={Briefcase}
          tone="warning"
        />
        <StatCard
          label="MRR"
          value="₹9.4L"
          icon={DollarSign}
          tone="success"
          trend={{ positive: true, value: "8.2%", label: "vs last month" }}
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ChartCard
            title="Revenue"
            subtitle="Last 6 months (₹ thousands)"
            loading={analyticsLoading}
          >
            <AreaTrendChart data={analytics?.revenueByMonth} />
          </ChartCard>
        </div>
        <ChartCard title="User distribution" loading={analyticsLoading}>
          <DonutChart data={analytics?.userDistribution || []} />
        </ChartCard>
      </div>

      <Card className="mt-6">
        <h3 className="mb-4 text-sm font-semibold text-slate-800 dark:text-slate-100">
          Pending recruiter approvals
        </h3>
        <Table
          columns={columns}
          rows={pendingRecruiters}
          loading={recruitersLoading}
          emptyProps={{ title: "No pending approvals" }}
        />
      </Card>
    </div>
  );
}
