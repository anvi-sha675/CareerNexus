import { useMemo, useState } from "react";
import { Flag, Briefcase, Check, Trash2 } from "lucide-react";
import PageHeader from "../../components/common/PageHeader";
import Table from "../../components/common/Table";
import Badge from "../../components/common/Badge";
import SearchInput from "../../components/common/SearchInput";
import Tabs from "../../components/common/Tabs";
import Button from "../../components/common/Button";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import { useAsync } from "../../hooks/useAsync";
import * as jobsService from "../../services/jobsService";
import { formatDate } from "../../utils/formatters";
import { useToast } from "../../context/ToastContext";

export default function JobModeration() {
  const { data: jobs, loading, setData } = useAsync(jobsService.getJobs, []);
  const [query, setQuery] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const { showToast } = useToast();

  const filtered = useMemo(
    () =>
      (jobs || []).filter((j) =>
        j.title.toLowerCase().includes(query.toLowerCase()),
      ),
    [jobs, query],
  );
  const flagged = filtered.filter((j) => j.applicants > 150);

  const removeJob = async () => {
    await jobsService.deleteJob(deleteTarget.id);
    setData((prev) => prev.filter((j) => j.id !== deleteTarget.id));
    showToast("Job removed from platform.", { type: "success" });
    setDeleteTarget(null);
  };

  const columns = (showApprove) => [
    {
      key: "title",
      header: "Job title",
      render: (row) => (
        <span className="font-medium text-slate-800 dark:text-slate-100">
          {row.title}
        </span>
      ),
    },
    { key: "company", header: "Company" },
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
          {showApprove && (
            <Button
              size="sm"
              variant="ghost"
              icon={Check}
              className="text-success!"
              aria-label="Approve job"
            />
          )}
          <Button
            size="sm"
            variant="ghost"
            icon={Trash2}
            className="text-error!"
            aria-label="Remove job"
            onClick={() => setDeleteTarget(row)}
          />
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Job Moderation"
        description="Review flagged listings and moderate all active job posts."
        breadcrumbs={[{ label: "Job Moderation" }]}
      />

      <SearchInput
        value={query}
        onChange={setQuery}
        placeholder="Search jobs..."
        className="mb-5 max-w-sm"
      />

      <Tabs
        tabs={[
          {
            key: "flagged",
            label: `Flagged (${flagged.length})`,
            content: (
              <Table
                columns={columns(true)}
                rows={flagged}
                loading={loading}
                emptyProps={{ icon: Flag, title: "No flagged jobs" }}
              />
            ),
          },
          {
            key: "all",
            label: "All jobs",
            content: (
              <Table
                columns={columns(false)}
                rows={filtered}
                loading={loading}
                emptyProps={{ icon: Briefcase, title: "No jobs found" }}
              />
            ),
          },
        ]}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={removeJob}
        title="Remove this job listing?"
        description={`"${deleteTarget?.title}" will be removed from the platform immediately.`}
        confirmLabel="Remove job"
      />
    </div>
  );
}
