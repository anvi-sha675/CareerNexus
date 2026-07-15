import PageHeader from "../../components/common/PageHeader";
import StatCard from "../../components/common/StatCard";
import ChartCard from "../../components/charts/ChartCard";
import BarComparisonChart from "../../components/charts/BarComparisonChart";
import FunnelBarChart from "../../components/charts/FunnelBarChart";
import { TrendingUp, Clock, Target, Users } from "lucide-react";
import { useAsync } from "../../hooks/useAsync";
import * as analyticsService from "../../services/analyticsService";

export default function RecruiterAnalytics() {
  const { data, loading } = useAsync(
    analyticsService.getRecruiterAnalytics,
    [],
  );

  return (
    <div>
      <PageHeader
        title="Recruiter Analytics"
        description="Understand how your hiring funnel is performing."
        breadcrumbs={[{ label: "Analytics" }]}
      />

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Avg. time to hire"
          value="18 days"
          icon={Clock}
          tone="primary"
        />
        <StatCard
          label="Conversion rate"
          value="6.8%"
          icon={Target}
          tone="accent"
          trend={{ positive: true, value: "0.9%", label: "vs last month" }}
        />
        <StatCard label="Applicants" value="410" icon={Users} tone="warning" />
        <StatCard
          label="Offer acceptance"
          value="82%"
          icon={TrendingUp}
          tone="success"
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <ChartCard
          title="Applications vs Hires"
          subtitle="Last 6 months"
          loading={loading}
        >
          <BarComparisonChart data={data?.applicationsTrend} />
        </ChartCard>
        <ChartCard
          title="Hiring funnel"
          subtitle="Current open roles"
          loading={loading}
        >
          <FunnelBarChart data={data?.pipelineData} />
        </ChartCard>
      </div>
    </div>
  );
}
