import { useState } from "react";
import { Download, FileText, Calendar } from "lucide-react";
import PageHeader from "../../components/common/PageHeader";
import Card from "../../components/common/Card";
import SelectField from "../../components/forms/SelectField";
import Button from "../../components/common/Button";
import Table from "../../components/common/Table";
import { useToast } from "../../context/ToastContext";
import { formatDate } from "../../utils/formatters";
import { exportToCSV } from "../../utils/exportCsv";

const REPORTS = [
  {
    id: "rp1",
    name: "Weekly platform summary",
    period: "Jun 30 – Jul 6, 2026",
    generatedAt: "2026-07-07",
  },
  {
    id: "rp2",
    name: "Monthly hiring report",
    period: "June 2026",
    generatedAt: "2026-07-01",
  },
  {
    id: "rp3",
    name: "Recruiter activity report",
    period: "June 2026",
    generatedAt: "2026-07-01",
  },
  {
    id: "rp4",
    name: "Weekly platform summary",
    period: "Jun 23 – Jun 29, 2026",
    generatedAt: "2026-06-30",
  },
];

export default function Reports() {
  const [range, setRange] = useState("weekly");
  const [reports, setReports] = useState(REPORTS);
  const { showToast } = useToast();

  const generateReport = () => {
    const label = {
      weekly: "Weekly summary",
      monthly: "Monthly hiring report",
      custom: "Custom range report",
    }[range];
    const newReport = {
      id: `rp${Date.now()}`,
      name: label,
      period: "Generated just now",
      generatedAt: new Date().toISOString().slice(0, 10),
    };
    setReports((prev) => [newReport, ...prev]);
    showToast("Report generated.", { type: "success" });
  };

  const columns = [
    {
      key: "name",
      header: "Report",
      render: (row) => (
        <span className="flex items-center gap-2 font-medium text-slate-800 dark:text-slate-100">
          <FileText className="h-4 w-4 text-primary-500" />
          {row.name}
        </span>
      ),
    },
    { key: "period", header: "Period" },
    {
      key: "generatedAt",
      header: "Generated",
      render: (row) => formatDate(row.generatedAt),
    },
    {
      key: "actions",
      header: "",
      render: (row) => (
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="ghost"
            icon={Download}
            onClick={() => {
              const ok = exportToCSV(
                row.name.toLowerCase().replace(/\s+/g, "-"),
                [row],
                [
                  { key: "name", header: "Report" },
                  { key: "period", header: "Period" },
                  { key: "generatedAt", header: "Generated" },
                ],
              );
              if (ok)
                showToast(`${row.name} exported as CSV.`, { type: "success" });
            }}
          >
            CSV
          </Button>
          <Button
            size="sm"
            variant="ghost"
            icon={Download}
            onClick={() =>
              showToast(
                `PDF export for "${row.name}" isn't available in demo mode yet.`,
                { type: "info" },
              )
            }
          >
            PDF
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Reports"
        description="Generate and export platform reports."
        breadcrumbs={[{ label: "Reports" }]}
      />

      <Card className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end">
        <SelectField
          label="Report type"
          className="w-full sm:w-56"
          options={[
            { value: "weekly", label: "Weekly summary" },
            { value: "monthly", label: "Monthly hiring report" },
            { value: "custom", label: "Custom range" },
          ]}
          value={range}
          onChange={(e) => setRange(e.target.value)}
        />
        <Button icon={Calendar} onClick={generateReport}>
          Generate report
        </Button>
      </Card>

      <Card>
        <h3 className="mb-4 text-sm font-semibold text-slate-800 dark:text-slate-100">
          Recent reports
        </h3>
        <Table
          columns={columns}
          rows={reports}
          emptyProps={{ title: "No reports generated yet" }}
        />
      </Card>
    </div>
  );
}
