import { Briefcase, ClipboardCheck, Eye, TrendingUp } from "lucide-react";
import PageHeader from "../../components/common/PageHeader";
import StatCard from "../../components/common/StatCard";
import RecentJobsList from "../../components/dashboard/RecentJobsList";
import ApplicationTracker from "../../components/dashboard/ApplicationTracker";
import ProfileCompletionWidget from "../../components/profile/ProfileCompletionWidget";
import ResumeStatusCard from "../../components/dashboard/ResumeStatusCard";
import CalendarWidget from "../../components/dashboard/CalendarWidget";
import SkillMatchSummary from "../../components/dashboard/SkillMatchSummary";
import PerformanceInsights from "../../components/dashboard/PerformanceInsights";
import ChartCard from "../../components/charts/ChartCard";
import WeeklyActivityChart from "../../components/charts/WeeklyActivityChart";
import NotificationItem from "../../components/notifications/NotificationItem";
import Card from "../../components/common/Card";
import { useAuth } from "../../context/AuthContext";
import { useAsync } from "../../hooks/useAsync";
import * as jobsService from "../../services/jobsService";
import * as applicationsService from "../../services/applicationsService";
import * as notificationsService from "../../services/notificationsService";
import * as interviewsService from "../../services/interviewsService";
import { weeklyActivity } from "../../services/mock/mockData";

export default function StudentDashboard() {
  const { user } = useAuth();
  const { data: jobs, loading: jobsLoading } = useAsync(
    jobsService.getJobs,
    [],
  );
  const { data: applications, loading: appsLoading } = useAsync(
    applicationsService.getMyApplications,
    [],
  );
  const { data: notifications, loading: notifLoading } = useAsync(
    notificationsService.getNotifications,
    [],
  );
  const { data: interviews } = useAsync(interviewsService.getMyInterviews, []);

  const topJobs = (jobs || [])
    .slice()
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 4);
  const activeApplications =
    applications?.filter((a) => !["Rejected", "Offered"].includes(a.status))
      .length || 0;
  const eventDates = (interviews || []).map((i) => i.date);

  return (
    <div>
      <PageHeader
        title={`Welcome back, ${user?.name?.split(" ")[0] || "there"}`}
        description="Here's what's happening with your job search."
      />

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Applications sent"
          value={applications?.length ?? "—"}
          icon={ClipboardCheck}
          tone="primary"
          loading={appsLoading}
        />
        <StatCard
          label="In progress"
          value={activeApplications}
          icon={TrendingUp}
          tone="accent"
          loading={appsLoading}
        />
        <StatCard
          label="Profile views"
          value="47"
          icon={Eye}
          tone="success"
          loading={false}
          trend={{ positive: true, value: "12%", label: "vs last week" }}
        />
        <StatCard
          label="Matched jobs"
          value={jobs?.length ?? "—"}
          icon={Briefcase}
          tone="warning"
          loading={jobsLoading}
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <ChartCard
            title="Weekly activity"
            subtitle="Profile views vs applications, last 7 days"
            height={220}
          >
            <WeeklyActivityChart data={weeklyActivity} />
          </ChartCard>
          <RecentJobsList jobs={topJobs} />
          <ApplicationTracker applications={applications?.slice(0, 5) || []} />
        </div>
        <div className="space-y-6">
          <CalendarWidget eventDates={eventDates} title="Upcoming interviews" />
          <ProfileCompletionWidget
            percentage={user?.profileCompletion || 78}
            tasks={["Add a project", "Add a certification"]}
          />
          <ResumeStatusCard
            hasResume
            fileName="Anvesha_Sharma_Resume.pdf"
            atsScore={84}
          />
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <SkillMatchSummary />
        <PerformanceInsights />
        <Card>
          <h3 className="mb-3 text-sm font-semibold text-slate-800 dark:text-slate-100">
            Recent notifications
          </h3>
          <div className="space-y-1">
            {!notifLoading &&
              notifications
                ?.slice(0, 3)
                .map((n) => <NotificationItem key={n.id} notification={n} />)}
          </div>
        </Card>
      </div>
    </div>
  );
}
