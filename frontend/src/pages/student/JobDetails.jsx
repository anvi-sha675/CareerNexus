import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  MapPin,
  Briefcase,
  Users,
  Clock,
  CheckCircle2,
  Building2,
} from "lucide-react";
import PageHeader from "../../components/common/PageHeader";
import Card from "../../components/common/Card";
import Badge from "../../components/common/Badge";
import Button from "../../components/common/Button";
import Spinner from "../../components/common/Spinner";
import ErrorState from "../../components/common/ErrorState";
import Modal from "../../components/common/Modal";
import { useAsync } from "../../hooks/useAsync";
import { useAuth } from "../../context/AuthContext";
import * as jobsService from "../../services/jobsService";
import * as applicationsService from "../../services/applicationsService";
import { formatCurrency, formatDate } from "../../utils/formatters";
import { useToast } from "../../context/ToastContext";

export default function JobDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const isStudent = user?.role === "student";
  const {
    data: job,
    loading,
    error,
    refetch,
  } = useAsync(() => jobsService.getJobById(id), [id]);
  const [applyOpen, setApplyOpen] = useState(false);
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);
  const { showToast } = useToast();

  const handleApply = async () => {
    setApplying(true);
    await applicationsService.applyToJob(id);
    setApplying(false);
    setApplyOpen(false);
    setApplied(true);
    showToast("Application submitted successfully!", { type: "success" });
  };

  if (loading) return <Spinner />;
  if (error || !job)
    return (
      <ErrorState
        onRetry={refetch}
        description="We couldn't load this job listing."
      />
    );

  return (
    <div>
      <PageHeader
        breadcrumbs={[{ label: "Jobs", to: "/jobs" }, { label: job.title }]}
        title=""
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-primary-500/10 text-lg font-bold text-primary-700 dark:text-primary-500">
                {job.logo}
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">
                  {job.title}
                </h1>
                <p className="mt-0.5 flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
                  <Building2 className="h-4 w-4" /> {job.company}
                </p>
                <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-sm text-slate-500 dark:text-slate-400">
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {job.location}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Briefcase className="h-4 w-4" />
                    {job.type}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {job.applicants} applicants
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    Posted {formatDate(job.postedAt)}
                  </span>
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <h2 className="mb-3 text-sm font-semibold text-slate-800 dark:text-slate-100">
              About the role
            </h2>
            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              {job.description}
            </p>
          </Card>

          <Card>
            <h2 className="mb-3 text-sm font-semibold text-slate-800 dark:text-slate-100">
              Required skills
            </h2>
            <div className="flex flex-wrap gap-2">
              {job.tags?.map((tag) => (
                <Badge key={tag} tone="Applied">
                  {tag}
                </Badge>
              ))}
            </div>
          </Card>

          <Card>
            <h2 className="mb-3 text-sm font-semibold text-slate-800 dark:text-slate-100">
              What we're looking for
            </h2>
            <ul className="space-y-2">
              {[
                "Strong fundamentals in the listed technologies",
                `${job.experience} of relevant experience`,
                "Excellent communication and collaboration skills",
                "A portfolio demonstrating shipped, working projects",
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300"
                >
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />{" "}
                  {item}
                </li>
              ))}
            </ul>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500 dark:text-slate-400">
                Match score
              </span>
              <span className="text-lg font-bold text-success">
                {job.matchScore}%
              </span>
            </div>
            <p className="mt-1.5 text-sm font-semibold text-slate-800 dark:text-slate-100">
              {formatCurrency(job.salaryMin)} – {formatCurrency(job.salaryMax)}
            </p>
            <p className="text-xs text-slate-400">
              Annual, based on experience
            </p>
            {applied ? (
              <Button fullWidth className="mt-4" disabled>
                Application submitted
              </Button>
            ) : isStudent ? (
              <Button
                fullWidth
                className="mt-4"
                onClick={() => setApplyOpen(true)}
              >
                Apply now
              </Button>
            ) : (
              <p className="mt-4 rounded-xl bg-slate-50 p-3 text-center text-xs text-slate-500 dark:bg-slate-900/40 dark:text-slate-400">
                Only student accounts can apply to roles.
              </p>
            )}
            <Button fullWidth variant="secondary" className="mt-2">
              Save for later
            </Button>
          </Card>

          <Card>
            <h3 className="mb-3 text-sm font-semibold text-slate-800 dark:text-slate-100">
              About {job.company}
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              A growing company hiring across engineering, product, and design.{" "}
              {job.applicants} people have already applied to this role.
            </p>
            <Link
              to="/jobs"
              className="mt-3 inline-block text-sm font-medium text-primary-600 hover:underline"
            >
              View more roles
            </Link>
          </Card>
        </div>
      </div>

      <Modal
        open={applyOpen}
        onClose={() => setApplyOpen(false)}
        title={`Apply to ${job.title}`}
        footer={
          <>
            <Button variant="secondary" onClick={() => setApplyOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleApply} loading={applying}>
              Submit application
            </Button>
          </>
        }
      >
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Your current profile and resume will be shared with {job.company}. You
          can track this application from the Applications page after
          submitting.
        </p>
      </Modal>
    </div>
  );
}
