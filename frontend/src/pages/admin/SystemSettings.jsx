import { Plus, ShieldAlert, LifeBuoy } from "lucide-react";
import PageHeader from "../../components/common/PageHeader";
import Card from "../../components/common/Card";
import Tabs from "../../components/common/Tabs";
import Table from "../../components/common/Table";
import Badge from "../../components/common/Badge";
import Button from "../../components/common/Button";
import TextField from "../../components/forms/TextField";
import Checkbox from "../../components/forms/Checkbox";
import Timeline from "../../components/common/Timeline";
import { useToast } from "../../context/ToastContext";

const ROLES = [
  { id: "role1", name: "Super Admin", users: 2, permissions: "Full access" },
  {
    id: "role2",
    name: "Support Admin",
    users: 4,
    permissions: "Users, Tickets, Reports",
  },
  {
    id: "role3",
    name: "Content Moderator",
    users: 3,
    permissions: "Job Moderation only",
  },
];

const AUDIT_LOGS = [
  {
    id: "l1",
    actor: "Priya Nair",
    action: "Approved recruiter TechFlow Systems",
    timestamp: "2026-07-08T10:12:00",
  },
  {
    id: "l2",
    actor: "System",
    action: "Automatic backup completed",
    timestamp: "2026-07-08T02:00:00",
  },
  {
    id: "l3",
    actor: "Priya Nair",
    action: "Suspended user meera.k@example.com",
    timestamp: "2026-07-07T16:40:00",
  },
  {
    id: "l4",
    actor: "Admin Bot",
    action: "Flagged job posting for review",
    timestamp: "2026-07-07T09:05:00",
  },
];

const TICKETS = [
  {
    id: "t1",
    subject: "Can't upload resume",
    requester: "ishaan.v@example.com",
    priority: "High",
    status: "Open",
  },
  {
    id: "t2",
    subject: "Billing question about Growth plan",
    requester: "karan@nimbuscloud.io",
    priority: "Medium",
    status: "Pending",
  },
  {
    id: "t3",
    subject: "Job listing not showing",
    requester: "divya@agrisenselabs.com",
    priority: "Low",
    status: "Resolved",
  },
];

function GeneralTab() {
  const { showToast } = useToast();
  return (
    <Card>
      <h3 className="mb-4 text-sm font-semibold text-slate-800 dark:text-slate-100">
        General settings
      </h3>
      <div className="space-y-4 max-w-lg">
        <TextField label="Platform name" defaultValue="CareerNexus" />
        <TextField
          label="Support email"
          defaultValue="support@careernexus.io"
        />
        <Checkbox name="maintenance" label="Enable maintenance mode" />
        <Checkbox
          name="registrations"
          label="Allow new recruiter registrations"
          defaultChecked
        />
        <Button
          onClick={() => showToast("Settings saved.", { type: "success" })}
        >
          Save settings
        </Button>
      </div>
    </Card>
  );
}

function RolesTab() {
  const columns = [
    {
      key: "name",
      header: "Role",
      render: (row) => (
        <span className="font-medium text-slate-800 dark:text-slate-100">
          {row.name}
        </span>
      ),
    },
    { key: "users", header: "Users" },
    { key: "permissions", header: "Permissions" },
  ];
  return (
    <Card>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
          Roles & permissions
        </h3>
        <Button size="sm" icon={Plus}>
          Create role
        </Button>
      </div>
      <Table columns={columns} rows={ROLES} />
    </Card>
  );
}

function AuditLogsTab() {
  return (
    <Card>
      <h3 className="mb-4 text-sm font-semibold text-slate-800 dark:text-slate-100">
        Audit logs
      </h3>
      <Timeline
        items={AUDIT_LOGS.map((l) => ({
          id: l.id,
          title: l.action,
          description: `by ${l.actor}`,
          timestamp: new Date(l.timestamp).toLocaleString(),
        }))}
      />
    </Card>
  );
}

function SecurityTab() {
  return (
    <div className="grid gap-6 sm:grid-cols-2">
      <Card>
        <div className="flex items-center gap-2">
          <ShieldAlert className="h-5 w-5 text-warning" />
          <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
            Failed login attempts
          </h3>
        </div>
        <p className="mt-3 text-3xl font-bold text-slate-800 dark:text-slate-100">
          7
        </p>
        <p className="text-xs text-slate-400">in the last 24 hours</p>
      </Card>
      <Card>
        <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
          JWT & session status
        </h3>
        <div className="mt-3 flex items-center justify-between text-sm">
          <span className="text-slate-500 dark:text-slate-400">
            Token service
          </span>
          <Badge tone="Active">Operational</Badge>
        </div>
        <div className="mt-2 flex items-center justify-between text-sm">
          <span className="text-slate-500 dark:text-slate-400">
            Rate limiting
          </span>
          <Badge tone="Active">Enabled</Badge>
        </div>
      </Card>
    </div>
  );
}

function TicketsTab() {
  const columns = [
    {
      key: "subject",
      header: "Subject",
      render: (row) => (
        <span className="font-medium text-slate-800 dark:text-slate-100">
          {row.subject}
        </span>
      ),
    },
    { key: "requester", header: "Requester" },
    { key: "priority", header: "Priority" },
    {
      key: "status",
      header: "Status",
      render: (row) => <Badge>{row.status}</Badge>,
    },
  ];
  return (
    <Card>
      <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-800 dark:text-slate-100">
        <LifeBuoy className="h-4 w-4" /> Support tickets
      </h3>
      <Table columns={columns} rows={TICKETS} />
    </Card>
  );
}

export default function SystemSettings() {
  return (
    <div>
      <PageHeader
        title="System Settings"
        description="Platform configuration, access control, and system health."
        breadcrumbs={[{ label: "System Settings" }]}
      />
      <Tabs
        tabs={[
          { key: "general", label: "General", content: <GeneralTab /> },
          { key: "roles", label: "Roles & Permissions", content: <RolesTab /> },
          { key: "audit", label: "Audit Logs", content: <AuditLogsTab /> },
          {
            key: "security",
            label: "Security Center",
            content: <SecurityTab />,
          },
          { key: "tickets", label: "Support Tickets", content: <TicketsTab /> },
        ]}
      />
    </div>
  );
}