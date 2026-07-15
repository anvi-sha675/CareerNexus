import { Link } from "react-router-dom";
import {
  Briefcase,
  Users,
  CalendarClock,
  TrendingUp,
  Plus,
} from "lucide-react";
import PageHeader from "../../components/common/PageHeader";
import StatCard from "../../components/common/StatCard";
import PipelineOverview from "../../components/dashboard/PipelineOverview";
import Table from "../../components/common/Table";
import Badge from "../../components/common/Badge";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import { useAsync } from "../../hooks/useAsync";
import * as jobsService from "../../services/jobsService";
import * as interviewsService from "../../services/interviewsService";
import * as analyticsService from "../../services/analyticsService";
import { formatDate } from "../../utils/formatters";

export default function RecruiterDashboard() {
  const { data: jobs, loading: jobsLoading } = useAsync(
    jobsService.getJobs,
    [],
  );
  const { data: interviews, loading: interviewsLoading } = useAsync(
    interviewsService.getInterviews,
    [],
  );
  const { data: analytics, loading: analyticsLoading } = useAsync(
    analyticsService.getRecruiterAnalytics,
    [],
  );

  const activeJobs = jobs?.filter((j) => j.status === "Active") || [];
  const totalApplicants = jobs?.reduce((sum, j) => sum + j.applicants, 0) || 0;

  const columns = [
    {
      key: "title",
      header: "Job title",
      render: (row) => (
        <Link
          to={`/recruiter/edit-job/${row.id}`}
          className="font-medium text-slate-800 hover:text-primary-600 dark:text-slate-100"
        >
          {row.title}
        </Link>
      ),
    },
    { key: "applicants", header: "Applicants" },
    {
      key: "postedAt",
      header: "Posted",
      render: (row) => formatDate(row.postedAt),
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
        title="Recruiter Dashboard"
        description="Track your hiring pipeline at a glance."
        actions={
          <Link to="/recruiter/create-job">
            <Button icon={Plus}>Post a job</Button>
          </Link>
        }
      />

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Active job posts"
          value={activeJobs.length}
          icon={Briefcase}
          tone="primary"
          loading={jobsLoading}
        />
        <StatCard
          label="Total applicants"
          value={totalApplicants}
          icon={Users}
          tone="accent"
          loading={jobsLoading}
        />
        <StatCard
          label="Interviews scheduled"
          value={interviews?.length ?? "—"}
          icon={CalendarClock}
          tone="warning"
          loading={interviewsLoading}
        />
        <StatCard
          label="Hire rate"
          value="8.4%"
          icon={TrendingUp}
          tone="success"
          loading={false}
          trend={{ positive: true, value: "1.2%", label: "vs last month" }}
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <h3 className="mb-4 text-sm font-semibold text-slate-800 dark:text-slate-100">
              Your job postings
            </h3>
            <Table
              columns={columns}
              rows={jobs?.slice(0, 5)}
              loading={jobsLoading}
              emptyProps={{
                title: "No jobs posted yet",
                actionLabel: "Post your first job",
              }}
            />
          </Card>
        </div>
        <PipelineOverview
          data={analytics?.pipelineData}
          loading={analyticsLoading}
        />
      </div>
    </div>
  );
}
