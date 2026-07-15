import { useMemo, useState } from "react";
import { ClipboardList } from "lucide-react";
import PageHeader from "../../components/common/PageHeader";
import Table from "../../components/common/Table";
import Badge from "../../components/common/Badge";
import SearchInput from "../../components/common/SearchInput";
import SelectField from "../../components/forms/SelectField";
import Pagination from "../../components/common/Pagination";
import { useAsync } from "../../hooks/useAsync";
import { usePagination } from "../../hooks/usePagination";
import * as applicationsService from "../../services/applicationsService";
import { formatDate } from "../../utils/formatters";
import { APPLICATION_STATUS } from "../../utils/constants";

const STATUS_OPTIONS = [
  { value: "", label: "All statuses" },
  ...Object.values(APPLICATION_STATUS).map((s) => ({ value: s, label: s })),
];

export default function Applications() {
  const {
    data: applications,
    loading,
    error,
    refetch,
  } = useAsync(applicationsService.getMyApplications, []);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");

  const filtered = useMemo(() => {
    let result = applications || [];
    if (query)
      result = result.filter(
        (a) =>
          a.jobTitle.toLowerCase().includes(query.toLowerCase()) ||
          a.company.toLowerCase().includes(query.toLowerCase()),
      );
    if (status) result = result.filter((a) => a.status === status);
    return result;
  }, [applications, query, status]);

  const { page, setPage, totalPages, pageItems } = usePagination(filtered, 8);

  const columns = [
    {
      key: "jobTitle",
      header: "Role",
      sortable: true,
      render: (row) => (
        <span className="font-medium text-slate-800 dark:text-slate-100">
          {row.jobTitle}
        </span>
      ),
    },
    { key: "company", header: "Company" },
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
        title="My Applications"
        description="Track every application in one place."
        breadcrumbs={[{ label: "Applications" }]}
      />

      <div className="mb-5 flex flex-col gap-3 sm:flex-row">
        <SearchInput
          value={query}
          onChange={setQuery}
          placeholder="Search applications..."
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
        {error ? (
          <p className="py-10 text-center text-sm text-error">
            Failed to load applications.{" "}
            <button onClick={refetch} className="underline">
              Retry
            </button>
          </p>
        ) : (
          <>
            <Table
              columns={columns}
              rows={pageItems}
              loading={loading}
              emptyProps={{
                icon: ClipboardList,
                title: "No applications yet",
                description: "Jobs you apply to will appear here.",
              }}
            />
            <Pagination
              page={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </>
        )}
      </div>
    </div>
  );
}
