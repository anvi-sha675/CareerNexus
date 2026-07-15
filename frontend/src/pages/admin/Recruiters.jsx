import { useMemo, useState } from "react";
import { Building2, Check, X } from "lucide-react";
import PageHeader from "../../components/common/PageHeader";
import Table from "../../components/common/Table";
import Badge from "../../components/common/Badge";
import SearchInput from "../../components/common/SearchInput";
import SelectField from "../../components/forms/SelectField";
import Button from "../../components/common/Button";
import Drawer from "../../components/common/Drawer";
import Pagination from "../../components/common/Pagination";
import { useAsync } from "../../hooks/useAsync";
import { usePagination } from "../../hooks/usePagination";
import * as usersService from "../../services/usersService";
import { formatDate } from "../../utils/formatters";
import { useToast } from "../../context/ToastContext";

const STATUS_OPTIONS = [
  { value: "", label: "All statuses" },
  { value: "Pending", label: "Pending" },
  { value: "Approved", label: "Approved" },
  { value: "Suspended", label: "Suspended" },
];

export default function Recruiters() {
  const {
    data: recruiters,
    loading,
    setData,
  } = useAsync(usersService.getRecruiters, []);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");
  const [selected, setSelected] = useState(null);
  const { showToast } = useToast();

  const filtered = useMemo(() => {
    let result = recruiters || [];
    if (query)
      result = result.filter(
        (r) =>
          r.company.toLowerCase().includes(query.toLowerCase()) ||
          r.contact.toLowerCase().includes(query.toLowerCase()),
      );
    if (status) result = result.filter((r) => r.status === status);
    return result;
  }, [recruiters, query, status]);

  const { page, setPage, totalPages, pageItems } = usePagination(filtered, 8);

  const setStatusFor = async (id, newStatus) => {
    await usersService.updateRecruiterStatus(id, newStatus);
    setData((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r)),
    );
    showToast(`Recruiter ${newStatus.toLowerCase()}.`, {
      type: newStatus === "Suspended" ? "warning" : "success",
    });
    setSelected(null);
  };

  const columns = [
    {
      key: "company",
      header: "Company",
      render: (row) => (
        <span className="font-medium text-slate-800 dark:text-slate-100">
          {row.company}
        </span>
      ),
    },
    { key: "contact", header: "Contact" },
    { key: "jobsPosted", header: "Jobs posted" },
    {
      key: "joinedAt",
      header: "Applied",
      render: (row) => formatDate(row.joinedAt),
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
        <Button size="sm" variant="ghost" onClick={() => setSelected(row)}>
          Review
        </Button>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Recruiters"
        description="Verify companies and manage recruiter access."
        breadcrumbs={[{ label: "Recruiters" }]}
      />

      <div className="mb-5 flex flex-col gap-3 sm:flex-row">
        <SearchInput
          value={query}
          onChange={setQuery}
          placeholder="Search companies..."
          className="flex-1"
        />
        <SelectField
          options={STATUS_OPTIONS}
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full sm:w-52"
        />
      </div>

      <div className="rounded-xl bg-card p-2 card-shadow dark:bg-slate-800/60 sm:p-4">
        <Table
          columns={columns}
          rows={pageItems}
          loading={loading}
          emptyProps={{ icon: Building2, title: "No recruiters found" }}
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
        title={selected?.company}
      >
        {selected && (
          <div className="space-y-5">
            <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-900/40">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Contact person
              </p>
              <p className="font-medium text-slate-800 dark:text-slate-100">
                {selected.contact}
              </p>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                Email
              </p>
              <p className="font-medium text-slate-800 dark:text-slate-100">
                {selected.email}
              </p>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                Jobs posted
              </p>
              <p className="font-medium text-slate-800 dark:text-slate-100">
                {selected.jobsPosted}
              </p>
            </div>
            <div className="flex gap-2">
              {selected.status !== "Approved" && (
                <Button
                  icon={Check}
                  fullWidth
                  onClick={() => setStatusFor(selected.id, "Approved")}
                >
                  Approve
                </Button>
              )}
              {selected.status !== "Suspended" && (
                <Button
                  icon={X}
                  variant="danger"
                  fullWidth
                  onClick={() => setStatusFor(selected.id, "Suspended")}
                >
                  Suspend
                </Button>
              )}
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}
