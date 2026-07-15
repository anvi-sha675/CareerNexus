import { useParams } from "react-router-dom";
import { CalendarClock, Building2, MessageSquare } from "lucide-react";
import PageHeader from "../../components/common/PageHeader";
import Card from "../../components/common/Card";
import Badge from "../../components/common/Badge";
import Timeline from "../../components/common/Timeline";
import Spinner from "../../components/common/Spinner";
import ErrorState from "../../components/common/ErrorState";
import Button from "../../components/common/Button";
import { useAsync } from "../../hooks/useAsync";
import * as applicationsService from "../../services/applicationsService";
import { formatDate } from "../../utils/formatters";

const STAGE_ORDER = [
  "Applied",
  "Under Review",
  "Shortlisted",
  "Interview",
  "Offered",
];

function buildTimeline(app) {
  const stageIndex = STAGE_ORDER.indexOf(app.status);
  return STAGE_ORDER.map((stage, i) => ({
    id: stage,
    title: stage,
    description:
      i === 0
        ? `Application submitted on ${formatDate(app.appliedAt)}`
        : undefined,
    tone:
      i <= stageIndex
        ? "success"
        : i === stageIndex + 1
          ? "primary"
          : "default",
  })).filter(
    (_, i) => i <= Math.max(stageIndex, 0) || app.status === "Rejected",
  );
}

export default function ApplicationDetails() {
  const { id } = useParams();
  const {
    data: applications,
    loading,
    error,
    refetch,
  } = useAsync(applicationsService.getMyApplications, []);
  const app = applications?.find((a) => a.id === id);

  if (loading) return <Spinner />;
  if (error) return <ErrorState onRetry={refetch} />;
  if (!app)
    return (
      <ErrorState
        title="Application not found"
        description="This application may have been withdrawn."
      />
    );

  return (
    <div>
      <PageHeader
        breadcrumbs={[
          { label: "Applications", to: "/student/applications" },
          { label: app.jobTitle },
        ]}
        title={app.jobTitle}
        description={app.company}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <h3 className="mb-4 text-sm font-semibold text-slate-800 dark:text-slate-100">
              Application timeline
            </h3>
            <Timeline items={buildTimeline(app)} />
          </Card>
          <Card>
            <h3 className="mb-3 text-sm font-semibold text-slate-800 dark:text-slate-100">
              Recruiter notes
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              No notes shared yet. You'll be notified as soon as the recruiter
              adds feedback.
            </p>
          </Card>
        </div>
        <div className="space-y-6">
          <Card>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-500/10 text-primary-600">
                <Building2 className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold text-slate-800 dark:text-slate-100">
                  {app.company}
                </p>
                <p className="text-xs text-slate-400">
                  Applied {formatDate(app.appliedAt)}
                </p>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-sm text-slate-500 dark:text-slate-400">
                Status
              </span>
              <Badge>{app.status}</Badge>
            </div>
            <div className="mt-2 flex items-center justify-between">
              <span className="text-sm text-slate-500 dark:text-slate-400">
                Match score
              </span>
              <span className="text-sm font-semibold text-success">
                {app.matchScore}%
              </span>
            </div>
            {app.status === "Interview" && (
              <div className="mt-4 flex items-center gap-2 rounded-xl bg-primary-50 p-3 text-sm text-primary-700 dark:bg-primary-500/10 dark:text-primary-400">
                <CalendarClock className="h-4 w-4" /> Interview scheduled —
                check Interviews
              </div>
            )}
            <Button
              variant="secondary"
              icon={MessageSquare}
              fullWidth
              className="mt-4"
            >
              Message recruiter
            </Button>
            {!["Rejected", "Offered"].includes(app.status) && (
              <Button variant="danger" fullWidth className="mt-2">
                Withdraw application
              </Button>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
