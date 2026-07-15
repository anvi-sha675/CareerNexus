import { Fragment } from "react";
import { useState } from "react";
import { X, Plus, Trophy } from "lucide-react";
import PageHeader from "../../components/common/PageHeader";
import Card from "../../components/common/Card";
import Avatar from "../../components/common/Avatar";
import Button from "../../components/common/Button";
import Modal from "../../components/common/Modal";
import { useAsync } from "../../hooks/useAsync";
import * as applicationsService from "../../services/applicationsService";

const CRITERIA = [
  { key: "matchScore", label: "Overall match" },
  { key: "skillMatch", label: "Skill match" },
  { key: "experienceMatch", label: "Experience match" },
  { key: "projectMatch", label: "Project match" },
];

export default function CandidateComparison() {
  const { data: applicants, loading } = useAsync(
    () => applicationsService.getApplicantsForJob("j1"),
    [],
  );
  const [selectedIds, setSelectedIds] = useState([]);
  const [pickerOpen, setPickerOpen] = useState(false);

  const enrich = (a) => ({
    ...a,
    skillMatch: Math.min(100, a.matchScore + 4),
    experienceMatch: Math.max(0, a.matchScore - 10),
    projectMatch: Math.max(0, a.matchScore - 2),
  });
  const selected = (applicants || [])
    .filter((a) => selectedIds.includes(a.id))
    .map(enrich);

  const best = (key) =>
    Math.max(...(selected.length ? selected.map((s) => s[key]) : [0]));

  return (
    <div>
      <PageHeader
        title="Candidate Comparison"
        description="Compare shortlisted candidates side by side."
        breadcrumbs={[{ label: "Compare Candidates" }]}
        actions={
          <Button
            icon={Plus}
            onClick={() => setPickerOpen(true)}
            disabled={loading}
          >
            Add candidate
          </Button>
        }
      />

      {selected.length === 0 ? (
        <Card className="py-16 text-center">
          <Trophy className="mx-auto mb-3 h-10 w-10 text-slate-300" />
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Add up to 3 candidates to compare their profiles.
          </p>
          <Button className="mt-4" onClick={() => setPickerOpen(true)}>
            Add candidates
          </Button>
        </Card>
      ) : (
        <div className="overflow-x-auto">
          <div
            className="grid min-w-140 gap-4"
            style={{
              gridTemplateColumns: `160px repeat(${selected.length}, 1fr)`,
            }}
          >
            <div />
            {selected.map((c) => (
              <Card key={c.id} className="text-center">
                <button
                  onClick={() =>
                    setSelectedIds((ids) => ids.filter((i) => i !== c.id))
                  }
                  className="float-right text-slate-400 hover:text-error"
                  aria-label={`Remove ${c.name}`}
                >
                  <X className="h-4 w-4" />
                </button>
                <Avatar name={c.name} size="lg" className="mx-auto" />
                <p className="mt-2 text-sm font-semibold text-slate-800 dark:text-slate-100">
                  {c.name}
                </p>
                <p className="text-xs text-slate-400">{c.jobTitle}</p>
              </Card>
            ))}

            {CRITERIA.map((criteria) => (
              <Fragment key={criteria.key}>
                <div className="flex items-center px-2 text-sm font-medium text-slate-500 dark:text-slate-400">
                  {criteria.label}
                </div>
                {selected.map((c) => (
                  <Card
                    key={c.id + criteria.key}
                    padding="p-4"
                    className="flex items-center justify-center"
                  >
                    <span
                      className={`text-lg font-bold ${c[criteria.key] === best(criteria.key) ? "text-success" : "text-slate-700 dark:text-slate-200"}`}
                    >
                      {c[criteria.key]}%
                    </span>
                  </Card>
                ))}
              </Fragment>
            ))}
          </div>
        </div>
      )}

      <Modal
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        title="Select candidates to compare"
      >
        <div className="max-h-80 space-y-2 overflow-y-auto scrollbar-thin">
          {(applicants || []).map((a) => (
            <button
              key={a.id}
              onClick={() => {
                setSelectedIds((ids) =>
                  ids.includes(a.id)
                    ? ids.filter((i) => i !== a.id)
                    : ids.length < 3
                      ? [...ids, a.id]
                      : ids,
                );
              }}
              className={`flex w-full items-center gap-3 rounded-lg border p-3 text-left ${selectedIds.includes(a.id) ? "border-primary-500 bg-primary-50 dark:bg-primary-500/10" : "border-slate-100 dark:border-slate-700"}`}
            >
              <Avatar name={a.name} size="sm" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-slate-800 dark:text-slate-100">
                  {a.name}
                </p>
                <p className="text-xs text-slate-400">
                  {a.jobTitle} · {a.matchScore}% match
                </p>
              </div>
            </button>
          ))}
        </div>
      </Modal>
    </div>
  );
}
