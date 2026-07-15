import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Briefcase,
  Copy,
  Archive,
  Trash2,
  Pencil,
  LayoutGrid,
  List,
  BarChart3,
} from "lucide-react";
import PageHeader from "../../components/common/PageHeader";
import Table from "../../components/common/Table";
import Card from "../../components/common/Card";
import Badge from "../../components/common/Badge";
import SearchInput from "../../components/common/SearchInput";
import SelectField from "../../components/forms/SelectField";
import Button from "../../components/common/Button";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import Drawer from "../../components/common/Drawer";
import StatCard from "../../components/common/StatCard";
import FunnelBarChart from "../../components/charts/FunnelBarChart";
import Pagination from "../../components/common/Pagination";
import { useAsync } from "../../hooks/useAsync";
import { usePagination } from "../../hooks/usePagination";
import * as jobsService from "../../services/jobsService";
import { formatDate } from "../../utils/formatters";
import { useToast } from "../../context/ToastContext";
import { cn } from "../../utils/cn";
import { Eye, Users, TrendingUp } from "lucide-react";

const STATUS_OPTIONS = [
  { value: "", label: "All statuses" },
  { value: "Active", label: "Active" },
  { value: "Closed", label: "Closed" },
];

export default function JobManagement() {
  const { data: jobs, loading, setData } = useAsync(jobsService.getJobs, []);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");
  const [view, setView] = useState("table");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [analyticsTarget, setAnalyticsTarget] = useState(null);
  const { showToast } = useToast();

  const jobFunnel = (job) => {
    const total = job.applicants;
    return [
      { stage: "Applied", count: total },
      { stage: "Reviewed", count: Math.round(total * 0.7) },
      { stage: "Shortlisted", count: Math.round(total * 0.35) },
      { stage: "Interview", count: Math.round(total * 0.15) },
      { stage: "Offered", count: Math.round(total * 0.05) },
    ];
  };

  const filtered = useMemo(() => {
    let result = jobs || [];
    if (query)
      result = result.filter((j) =>
        j.title.toLowerCase().includes(query.toLowerCase()),
      );
    if (status) result = result.filter((j) => j.status === status);
    return result;
  }, [jobs, query, status]);

  const { page, setPage, totalPages, pageItems } = usePagination(filtered, 8);

  const duplicateJob = async (job) => {
    const copy = await jobsService.createJob({
      ...job,
      title: `${job.title} (Copy)`,
    });
    setData((prev) => [copy, ...prev]);
    showToast("Job duplicated.", { type: "success" });
  };

  const archiveJob = async (job) => {
    await jobsService.updateJob(job.id, {
      ...job,
      status: job.status === "Closed" ? "Active" : "Closed",
    });
    setData((prev) =>
      prev.map((j) =>
        j.id === job.id
          ? { ...j, status: j.status === "Closed" ? "Active" : "Closed" }
          : j,
      ),
    );
    showToast(job.status === "Closed" ? "Job reactivated." : "Job archived.", {
      type: "success",
    });
  };

  const confirmDelete = async () => {
    await jobsService.deleteJob(deleteTarget.id);
    setData((prev) => prev.filter((j) => j.id !== deleteTarget.id));
    showToast("Job deleted.", { type: "success" });
    setDeleteTarget(null);
  };

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
    { key: "location", header: "Location" },
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
    {
      key: "actions",
      header: "",
      render: (row) => (
        <div className="flex gap-1">
          <Link to={`/recruiter/edit-job/${row.id}`}>
            <Button
              size="sm"
              variant="ghost"
              icon={Pencil}
              aria-label="Edit job"
            />
          </Link>
          <Button
            size="sm"
            variant="ghost"
            icon={BarChart3}
            aria-label="View job analytics"
            onClick={() => setAnalyticsTarget(row)}
          />
          <Button
            size="sm"
            variant="ghost"
            icon={Copy}
            aria-label="Duplicate job"
            onClick={() => duplicateJob(row)}
          />
          <Button
            size="sm"
            variant="ghost"
            icon={Archive}
            aria-label="Archive job"
            onClick={() => archiveJob(row)}
          />
          <Button
            size="sm"
            variant="ghost"
            icon={Trash2}
            aria-label="Delete job"
            className="text-error!"
            onClick={() => setDeleteTarget(row)}
          />
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Job Management"
        description="Manage every job posting from one place."
        breadcrumbs={[{ label: "Manage Jobs" }]}
        actions={
          <div className="flex overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setView("table")}
              aria-label="Table view"
              className={cn(
                "p-2",
                view === "table"
                  ? "bg-primary-500 text-white"
                  : "text-slate-500",
              )}
            >
              <List className="h-4 w-4" />
            </button>
            <button
              onClick={() => setView("grid")}
              aria-label="Grid view"
              className={cn(
                "p-2",
                view === "grid"
                  ? "bg-primary-500 text-white"
                  : "text-slate-500",
              )}
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
          </div>
        }
      />

      <div className="mb-5 flex flex-col gap-3 sm:flex-row">
        <SearchInput
          value={query}
          onChange={setQuery}
          placeholder="Search jobs..."
          className="flex-1"
        />
        <SelectField
          options={STATUS_OPTIONS}
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full sm:w-52"
        />
      </div>

      {view === "table" ? (
        <div className="rounded-xl bg-card p-2 card-shadow dark:bg-slate-800/60 sm:p-4">
          <Table
            columns={columns}
            rows={pageItems}
            loading={loading}
            emptyProps={{ icon: Briefcase, title: "No jobs found" }}
          />
          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </div>
      ) : (
        <>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {pageItems.map((job) => (
              <Card key={job.id}>
                <div className="flex items-start justify-between">
                  <Link
                    to={`/recruiter/edit-job/${job.id}`}
                    className="font-semibold text-slate-800 hover:text-primary-600 dark:text-slate-100"
                  >
                    {job.title}
                  </Link>
                  <Badge>{job.status}</Badge>
                </div>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  {job.location} · {job.applicants} applicants
                </p>
                <div className="mt-4 flex gap-1">
                  <Link to={`/recruiter/edit-job/${job.id}`}>
                    <Button size="sm" variant="secondary" icon={Pencil}>
                      Edit
                    </Button>
                  </Link>
                  <Button
                    size="sm"
                    variant="ghost"
                    icon={Copy}
                    onClick={() => duplicateJob(job)}
                  />
                  <Button
                    size="sm"
                    variant="ghost"
                    icon={Archive}
                    onClick={() => archiveJob(job)}
                  />
                </div>
              </Card>
            ))}
          </div>
          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        title="Delete this job posting?"
        description={`"${deleteTarget?.title}" will be permanently removed along with its applicant data.`}
        confirmLabel="Delete job"
      />

      <Drawer
        open={!!analyticsTarget}
        onClose={() => setAnalyticsTarget(null)}
        title={
          analyticsTarget
            ? `Analytics — ${analyticsTarget.title}`
            : "Job analytics"
        }
      >
        {analyticsTarget && (
          <div className="space-y-5">
            <div className="grid grid-cols-3 gap-3">
              <StatCard
                label="Views"
                value={analyticsTarget.applicants * 6}
                icon={Eye}
                tone="primary"
              />
              <StatCard
                label="Applicants"
                value={analyticsTarget.applicants}
                icon={Users}
                tone="accent"
              />
              <StatCard
                label="Conversion"
                value={`${Math.round(((analyticsTarget.applicants * 0.05) / Math.max(analyticsTarget.applicants, 1)) * 100)}%`}
                icon={TrendingUp}
                tone="success"
              />
            </div>
            <Card>
              <h3 className="mb-3 text-sm font-semibold text-slate-800 dark:text-slate-100">
                Funnel breakdown
              </h3>
              <div style={{ height: 220 }}>
                <FunnelBarChart data={jobFunnel(analyticsTarget)} />
              </div>
            </Card>
          </div>
        )}
      </Drawer>
    </div>
  );
}
