import { useState } from "react";
import { FileCheck2, Check, X, FileText } from "lucide-react";
import PageHeader from "../../components/common/PageHeader";
import Card from "../../components/common/Card";
import Badge from "../../components/common/Badge";
import Button from "../../components/common/Button";
import EmptyState from "../../components/common/EmptyState";
import { CardSkeleton } from "../../components/common/Skeleton";
import { useAsync } from "../../hooks/useAsync";
import * as usersService from "../../services/usersService";
import { useToast } from "../../context/ToastContext";

export default function CompanyVerification() {
  const {
    data: recruiters,
    loading,
    setData,
  } = useAsync(usersService.getRecruiters, []);
  const { showToast } = useToast();
  const [processing, setProcessing] = useState(null);

  const pending = (recruiters || []).filter((r) => r.status === "Pending");

  const decide = async (id, status) => {
    setProcessing(id);
    await usersService.updateRecruiterStatus(id, status);
    setData((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
    setProcessing(null);
    showToast(
      status === "Approved" ? "Company approved." : "Company rejected.",
      { type: status === "Approved" ? "success" : "warning" },
    );
  };

  return (
    <div>
      <PageHeader
        title="Company Verification"
        description="Review documents and approve new recruiter accounts."
        breadcrumbs={[{ label: "Company Verification" }]}
      />

      {loading ? (
        <div className="grid gap-5 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : pending.length === 0 ? (
        <EmptyState
          icon={FileCheck2}
          title="No pending verifications"
          description="New recruiter sign-ups will appear here for review."
        />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2">
          {pending.map((r) => (
            <Card key={r.id}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold text-slate-800 dark:text-slate-100">
                    {r.company}
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {r.contact} · {r.email}
                  </p>
                </div>
                <Badge>{r.status}</Badge>
              </div>
              <div className="mt-4 flex items-center gap-2 rounded-lg border border-slate-100 p-3 text-sm text-slate-600 dark:border-slate-700 dark:text-slate-300">
                <FileText className="h-4 w-4 text-primary-500" />{" "}
                business_registration.pdf
              </div>
              <div className="mt-4 flex gap-2">
                <Button
                  size="sm"
                  icon={Check}
                  loading={processing === r.id}
                  onClick={() => decide(r.id, "Approved")}
                >
                  Approve
                </Button>
                <Button
                  size="sm"
                  variant="danger"
                  icon={X}
                  onClick={() => decide(r.id, "Suspended")}
                >
                  Reject
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
