import { Database, HardDrive, Link2, Activity } from "lucide-react";
import PageHeader from "../../components/common/PageHeader";
import Card from "../../components/common/Card";
import Table from "../../components/common/Table";
import Badge from "../../components/common/Badge";
import StatCard from "../../components/common/StatCard";

const COLLECTIONS = [
  { name: "users", documents: "8,832", sizeMb: 42 },
  { name: "jobs", documents: "1,204", sizeMb: 18 },
  { name: "applications", documents: "24,610", sizeMb: 96 },
  { name: "notifications", documents: "51,204", sizeMb: 34 },
  { name: "companies", documents: "420", sizeMb: 6 },
];

export default function DatabaseStatus() {
  const columns = [
    {
      key: "name",
      header: "Collection",
      render: (row) => (
        <span className="font-medium text-slate-800 dark:text-slate-100">
          {row.name}
        </span>
      ),
    },
    { key: "documents", header: "Documents" },
    { key: "sizeMb", header: "Size", render: (row) => `${row.sizeMb} MB` },
  ];

  return (
    <div>
      <PageHeader
        title="Database Status"
        description="Read-only view — connect this to your database provider's metrics API."
        breadcrumbs={[{ label: "Database Status" }]}
      />

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Connection status"
          value="Connected"
          icon={Link2}
          tone="success"
        />
        <StatCard
          label="Total collections"
          value={COLLECTIONS.length}
          icon={Database}
          tone="primary"
        />
        <StatCard
          label="Storage used"
          value="196 MB"
          icon={HardDrive}
          tone="accent"
        />
        <StatCard
          label="Avg. query time"
          value="38ms"
          icon={Activity}
          tone="warning"
        />
      </div>

      <Card className="mt-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
            Collections
          </h3>
          <Badge tone="Active">Healthy</Badge>
        </div>
        <Table
          columns={columns}
          rows={COLLECTIONS}
          emptyProps={{ title: "No collections found" }}
        />
      </Card>
    </div>
  );
}
