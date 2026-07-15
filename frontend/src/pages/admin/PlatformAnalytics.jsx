import PageHeader from "../../components/common/PageHeader";
import StatCard from "../../components/common/StatCard";
import ChartCard from "../../components/charts/ChartCard";
import AreaTrendChart from "../../components/charts/AreaTrendChart";
import BarComparisonChart from "../../components/charts/BarComparisonChart";
import DonutChart from "../../components/charts/DonutChart";
import FunnelBarChart from "../../components/charts/FunnelBarChart";
import { Users, Briefcase, TrendingUp, Building2 } from "lucide-react";
import { useAsync } from "../../hooks/useAsync";
import * as analyticsService from "../../services/analyticsService";

export default function PlatformAnalytics() {
  const { data, loading } = useAsync(analyticsService.getPlatformAnalytics, []);

  return (
    <div>
      <PageHeader
        title="Platform Analytics"
        description="Growth and engagement across the whole platform."
        breadcrumbs={[{ label: "Platform Analytics" }]}
      />

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="User growth (MoM)"
          value="+14.2%"
          icon={Users}
          tone="primary"
        />
        <StatCard
          label="Recruiter growth (MoM)"
          value="+9.8%"
          icon={Building2}
          tone="accent"
        />
        <StatCard
          label="Jobs posted"
          value="1,204"
          icon={Briefcase}
          tone="warning"
        />
        <StatCard
          label="Platform-wide hire rate"
          value="7.3%"
          icon={TrendingUp}
          tone="success"
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <ChartCard
          title="Revenue trend"
          subtitle="₹ thousands, last 6 months"
          loading={loading}
        >
          <AreaTrendChart data={data?.revenueByMonth} color="#2563EB" />
        </ChartCard>
        <ChartCard
          title="Applications vs Hires"
          subtitle="Platform-wide"
          loading={loading}
        >
          <BarComparisonChart data={data?.applicationsTrend} />
        </ChartCard>
        <ChartCard title="User distribution" loading={loading}>
          <DonutChart data={data?.userDistribution || []} />
        </ChartCard>
        <ChartCard
          title="Hiring funnel"
          subtitle="All active roles"
          loading={loading}
        >
          <FunnelBarChart data={data?.pipelineData || []} />
        </ChartCard>
      </div>
    </div>
  );
}
