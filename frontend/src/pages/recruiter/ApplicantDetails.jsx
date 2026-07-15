import { useParams, Link } from "react-router-dom";
import { Mail, FileText, CheckCircle2, User } from "lucide-react";
import PageHeader from "../../components/common/PageHeader";
import Card from "../../components/common/Card";
import Avatar from "../../components/common/Avatar";
import Badge from "../../components/common/Badge";
import Timeline from "../../components/common/Timeline";
import Button from "../../components/common/Button";
import Spinner from "../../components/common/Spinner";
import ErrorState from "../../components/common/ErrorState";
import { useAsync } from "../../hooks/useAsync";
import * as applicationsService from "../../services/applicationsService";
import { formatDate } from "../../utils/formatters";

export default function ApplicantDetails() {
  const { id } = useParams();
  const {
    data: applicants,
    loading,
    error,
    refetch,
  } = useAsync(() => applicationsService.getApplicantsForJob("j1"), []);
  const applicant = applicants?.find((a) => a.id === id) || applicants?.[0];

  if (loading) return <Spinner />;
  if (error || !applicant)
    return (
      <ErrorState
        onRetry={refetch}
        description="We couldn't load this application."
      />
    );

  return (
    <div>
      <PageHeader
        breadcrumbs={[
          { label: "Applicants", to: "/recruiter/applicants" },
          { label: applicant.name },
        ]}
        title={`Application — ${applicant.name}`}
        description={`Applied for ${applicant.jobTitle}`}
        actions={
          <Link to={`/recruiter/candidates/${applicant.id}`}>
            <Button variant="secondary" icon={User}>
              View full profile
            </Button>
          </Link>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card className="flex items-center gap-4">
            <Avatar name={applicant.name} size="lg" />
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-slate-800 dark:text-slate-100">
                {applicant.name}
              </p>
              <p className="flex items-center gap-1 text-sm text-slate-400">
                <Mail className="h-3.5 w-3.5" />
                {applicant.email}
              </p>
            </div>
            <Badge>{applicant.status}</Badge>
          </Card>

          <Card>
            <h3 className="mb-3 text-sm font-semibold text-slate-800 dark:text-slate-100">
              Application activity
            </h3>
            <Timeline
              items={[
                {
                  id: 1,
                  title: "Applied",
                  description: `Applied for ${applicant.jobTitle}`,
                  timestamp: formatDate(applicant.appliedAt),
                  tone: "success",
                },
                {
                  id: 2,
                  title: "Resume reviewed",
                  timestamp: formatDate(applicant.appliedAt),
                  tone: "primary",
                },
                {
                  id: 3,
                  title: `Current stage: ${applicant.status}`,
                  tone: "primary",
                },
              ]}
            />
          </Card>

          <Card>
            <h3 className="mb-2 text-sm font-semibold text-slate-800 dark:text-slate-100">
              Recruiter notes
            </h3>
            <textarea
              rows={4}
              placeholder="Add a private note about this candidate..."
              className="w-full rounded-lg border border-slate-200 p-2.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-slate-700 dark:bg-slate-800"
            />
            <Button size="sm" className="mt-2">
              Save note
            </Button>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Overall match
            </p>
            <p className="mt-1 text-3xl font-bold text-success">
              {applicant.matchScore}%
            </p>
            <div className="mt-4 space-y-2 text-sm">
              {[
                ["Skill match", applicant.matchScore],
                ["Experience match", applicant.matchScore - 8],
                ["Project match", applicant.matchScore - 3],
              ].map(([label, value]) => (
                <div key={label} className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400">
                    {label}
                  </span>
                  <span className="font-medium text-slate-700 dark:text-slate-200">
                    {Math.max(value, 0)}%
                  </span>
                </div>
              ))}
            </div>
          </Card>
          <Card>
            <Button variant="secondary" icon={FileText} fullWidth>
              View resume
            </Button>
            <Button className="mt-2" fullWidth icon={CheckCircle2}>
              Shortlist candidate
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
