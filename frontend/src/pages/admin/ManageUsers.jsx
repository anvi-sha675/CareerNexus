import { useMemo, useState } from "react";
import { Users, ShieldOff, ShieldCheck, Download } from "lucide-react";
import PageHeader from "../../components/common/PageHeader";
import Table from "../../components/common/Table";
import Badge from "../../components/common/Badge";
import Avatar from "../../components/common/Avatar";
import SearchInput from "../../components/common/SearchInput";
import SelectField from "../../components/forms/SelectField";
import Button from "../../components/common/Button";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import Pagination from "../../components/common/Pagination";
import { useAsync } from "../../hooks/useAsync";
import { usePagination } from "../../hooks/usePagination";
import * as usersService from "../../services/usersService";
import { formatDate } from "../../utils/formatters";
import { useToast } from "../../context/ToastContext";
import { exportToCSV } from "../../utils/exportCsv";

const ROLE_OPTIONS = [
  { value: "", label: "All roles" },
  { value: "student", label: "Student" },
  { value: "recruiter", label: "Recruiter" },
];

export default function ManageUsers() {
  const { data: users, loading, setData } = useAsync(usersService.getUsers, []);
  const [query, setQuery] = useState("");
  const [role, setRole] = useState("");
  const [confirmTarget, setConfirmTarget] = useState(null);
  const { showToast } = useToast();

  const filtered = useMemo(() => {
    let result = users || [];
    if (query)
      result = result.filter(
        (u) =>
          u.name.toLowerCase().includes(query.toLowerCase()) ||
          u.email.toLowerCase().includes(query.toLowerCase()),
      );
    if (role) result = result.filter((u) => u.role === role);
    return result;
  }, [users, query, role]);

  const { page, setPage, totalPages, pageItems } = usePagination(filtered, 8);

  const handleToggleStatus = async () => {
    const newStatus =
      confirmTarget.status === "Suspended" ? "Active" : "Suspended";
    await usersService.updateUserStatus(confirmTarget.id, newStatus);
    setData((prev) =>
      prev.map((u) =>
        u.id === confirmTarget.id ? { ...u, status: newStatus } : u,
      ),
    );
    showToast(`${confirmTarget.name} is now ${newStatus.toLowerCase()}.`, {
      type: "success",
    });
    setConfirmTarget(null);
  };

  const handleExport = () => {
    const ok = exportToCSV("platform-users", filtered, [
      { key: "name", header: "Name" },
      { key: "email", header: "Email" },
      { key: "role", header: "Role" },
      { key: "joinedAt", header: "Joined" },
      { key: "status", header: "Status" },
    ]);
    if (ok)
      showToast(`Exported ${filtered.length} users to CSV.`, {
        type: "success",
      });
  };

  const columns = [
    {
      key: "name",
      header: "User",
      render: (row) => (
        <div className="flex items-center gap-2.5">
          <Avatar name={row.name} size="sm" />
          <div>
            <p className="font-medium text-slate-800 dark:text-slate-100">
              {row.name}
            </p>
            <p className="text-xs text-slate-400">{row.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: "role",
      header: "Role",
      render: (row) => <span className="capitalize">{row.role}</span>,
    },
    {
      key: "joinedAt",
      header: "Joined",
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
        <Button
          size="sm"
          variant="ghost"
          icon={row.status === "Suspended" ? ShieldCheck : ShieldOff}
          className={
            row.status === "Suspended" ? "text-success!" : "text-error!"
          }
          onClick={() => setConfirmTarget(row)}
        >
          {row.status === "Suspended" ? "Reactivate" : "Suspend"}
        </Button>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Manage Users"
        description="Search, filter, and moderate platform users."
        breadcrumbs={[{ label: "Manage Users" }]}
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
          placeholder="Search users..."
          className="flex-1"
        />
        <SelectField
          options={ROLE_OPTIONS}
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full sm:w-52"
        />
      </div>

      <div className="rounded-xl bg-card p-2 card-shadow dark:bg-slate-800/60 sm:p-4">
        <Table
          columns={columns}
          rows={pageItems}
          loading={loading}
          emptyProps={{ icon: Users, title: "No users found" }}
        />
        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </div>

      <ConfirmDialog
        open={!!confirmTarget}
        onClose={() => setConfirmTarget(null)}
        onConfirm={handleToggleStatus}
        title={
          confirmTarget?.status === "Suspended"
            ? "Reactivate user?"
            : "Suspend user?"
        }
        description={`This will ${confirmTarget?.status === "Suspended" ? "restore" : "revoke"} platform access for ${confirmTarget?.name}.`}
        confirmLabel={
          confirmTarget?.status === "Suspended" ? "Reactivate" : "Suspend"
        }
        tone={confirmTarget?.status === "Suspended" ? "primary" : "danger"}
      />
    </div>
  );
}
