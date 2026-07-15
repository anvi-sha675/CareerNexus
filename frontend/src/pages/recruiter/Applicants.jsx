import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Users, Mail, FileText, Download, User } from "lucide-react";
import PageHeader from "../../components/common/PageHeader";
import Table from "../../components/common/Table";
import Badge from "../../components/common/Badge";
import Avatar from "../../components/common/Avatar";
import SearchInput from "../../components/common/SearchInput";
import SelectField from "../../components/forms/SelectField";
import Drawer from "../../components/common/Drawer";
import Button from "../../components/common/Button";
import Pagination from "../../components/common/Pagination";
import { useAsync } from "../../hooks/useAsync";
import { usePagination } from "../../hooks/usePagination";
import * as applicationsService from "../../services/applicationsService";
import { formatDate } from "../../utils/formatters";
import { APPLICATION_STATUS } from "../../utils/constants";
import { useToast } from "../../context/ToastContext";
import { exportToCSV } from "../../utils/exportCsv";

const STATUS_OPTIONS = [
  { value: "", label: "All statuses" },
  ...Object.values(APPLICATION_STATUS).map((s) => ({ value: s, label: s })),
];

export default function Applicants() {
  const {
    data: applicants,
    loading,
    setData,
  } = useAsync(() => applicationsService.getApplicantsForJob("j1"), []);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");
  const [selected, setSelected] = useState(null);
  const { showToast } = useToast();

  const filtered = useMemo(() => {
    let result = applicants || [];
    if (query)
      result = result.filter(
        (a) =>
          a.name.toLowerCase().includes(query.toLowerCase()) ||
          a.jobTitle.toLowerCase().includes(query.toLowerCase()),
      );
    if (status) result = result.filter((a) => a.status === status);
    return result;
  }, [applicants, query, status]);

  const { page, setPage, totalPages, pageItems } = usePagination(filtered, 8);

  const updateStatus = async (id, newStatus) => {
    await applicationsService.updateApplicationStatus(id, newStatus);
    setData((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a)),
    );
    showToast(`Status updated to ${newStatus}.`, { type: "success" });
    setSelected(null);
  };

  const handleExport = () => {
    const ok = exportToCSV("applicants", filtered, [
      { key: "name", header: "Candidate" },
      { key: "email", header: "Email" },
      { key: "jobTitle", header: "Applied for" },
      { key: "appliedAt", header: "Applied date" },
      { key: "matchScore", header: "Match score" },
      { key: "status", header: "Status" },
    ]);
    if (ok)
      showToast(`Exported ${filtered.length} applicants to CSV.`, {
        type: "success",
      });
  };

  const columns = [
    {
      key: "name",
      header: "Candidate",
      render: (row) => (
        <button
          onClick={() => setSelected(row)}
          className="flex items-center gap-2.5 text-left"
        >
          <Avatar name={row.name} size="sm" />
          <span className="font-medium text-slate-800 hover:text-primary-600 dark:text-slate-100">
            {row.name}
          </span>
        </button>
      ),
    },
    { key: "jobTitle", header: "Applied for" },
    {
      key: "appliedAt",
      header: "Applied",
      render: (row) => formatDate(row.appliedAt),
    },
    {
      key: "matchScore",
      header: "Match",
      render: (row) => (
        <span className="font-medium text-success">{row.matchScore}%</span>
      ),
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
        title="Applicants"
        description="Review and manage candidates across your open roles."
        breadcrumbs={[{ label: "Applicants" }]}
        actions={
          <Button variant="secondary" icon={Download} onClick={handleExport}>
            Export CSV
          </Button>
        }
      />

      <div className="mb-5 flex flex-col gap-3 sm:flex-row">
        <SearchInput
          value={query}
          onChange={setQuery}
          placeholder="Search candidates..."
          className="flex-1"
        />
        <SelectField
          options={STATUS_OPTIONS}
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full sm:w-56"
        />
      </div>

      <div className="rounded-xl bg-card p-2 card-shadow dark:bg-slate-800/60 sm:p-4">
        <Table
          columns={columns}
          rows={pageItems}
          loading={loading}
          emptyProps={{ icon: Users, title: "No applicants yet" }}
        />
        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </div>

      <Drawer
        open={!!selected}
        onClose={() => setSelected(null)}
        title={selected?.name}
      >
        {selected && (
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <Avatar name={selected.name} size="lg" />
              <div>
                <p className="font-semibold text-slate-800 dark:text-slate-100">
                  {selected.name}
                </p>
                <p className="flex items-center gap-1 text-sm text-slate-400">
                  <Mail className="h-3.5 w-3.5" />
                  {selected.email}
                </p>
              </div>
            </div>
            <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-900/40">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Applied for
              </p>
              <p className="font-medium text-slate-800 dark:text-slate-100">
                {selected.jobTitle}
              </p>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                Match score
              </p>
              <p className="font-semibold text-success">
                {selected.matchScore}%
              </p>
            </div>
            <Button variant="secondary" icon={FileText} fullWidth>
              View resume
            </Button>
            <div className="grid grid-cols-2 gap-2">
              <Link to={`/recruiter/candidates/${selected.id}`}>
                <Button variant="ghost" icon={User} size="sm" fullWidth>
                  Full profile
                </Button>
              </Link>
              <Link to={`/recruiter/applicants/${selected.id}`}>
                <Button variant="ghost" size="sm" fullWidth>
                  Application
                </Button>
              </Link>
            </div>
            <div>
              <p className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-200">
                Update status
              </p>
              <div className="grid grid-cols-2 gap-2">
                {Object.values(APPLICATION_STATUS).map((s) => (
                  <Button
                    key={s}
                    size="sm"
                    variant={selected.status === s ? "primary" : "secondary"}
                    onClick={() => updateStatus(selected.id, s)}
                  >
                    {s}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}
