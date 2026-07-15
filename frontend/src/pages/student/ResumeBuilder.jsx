import { useState } from "react";
import { Plus, Trash2, Download, Eye } from "lucide-react";
import PageHeader from "../../components/common/PageHeader";
import Card from "../../components/common/Card";
import TextField from "../../components/forms/TextField";
import TextareaField from "../../components/forms/TextareaField";
import Button from "../../components/common/Button";
import Tabs from "../../components/common/Tabs";
import { useToast } from "../../context/ToastContext";

const emptyEntry = { title: "", org: "", period: "", desc: "" };

export default function ResumeBuilder() {
  const [summary, setSummary] = useState(
    "Final-year Computer Science student focused on full-stack development and applied AI, with a track record of shipping production-quality hackathon and portfolio projects.",
  );
  const [experience, setExperience] = useState([
    {
      title: "Full-Stack Developer Intern",
      org: "TechFlow Systems",
      period: "May 2026 – Jul 2026",
      desc: "Built and shipped 3 customer-facing features in a React/Node.js codebase.",
    },
  ]);
  const [education, setEducation] = useState([
    {
      title: "B.Tech, Computer Science",
      org: "MNIT Jaipur",
      period: "2022 – 2026",
      desc: "CGPA: 8.7/10",
    },
  ]);
  const { showToast } = useToast();

  const addEntry = (setter) => setter((prev) => [...prev, { ...emptyEntry }]);
  const removeEntry = (setter, index) =>
    setter((prev) => prev.filter((_, i) => i !== index));
  const updateEntry = (setter, index, field, value) =>
    setter((prev) =>
      prev.map((entry, i) =>
        i === index ? { ...entry, [field]: value } : entry,
      ),
    );

  const EntryEditor = ({ entries, setter, labelOrg, labelTitle }) => (
    <div className="space-y-5">
      {entries.map((entry, i) => (
        <div
          key={i}
          className="rounded-xl border border-slate-100 p-4 dark:border-slate-700"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField
              label={labelTitle}
              value={entry.title}
              onChange={(e) => updateEntry(setter, i, "title", e.target.value)}
            />
            <TextField
              label={labelOrg}
              value={entry.org}
              onChange={(e) => updateEntry(setter, i, "org", e.target.value)}
            />
          </div>
          <TextField
            label="Period"
            className="mt-4"
            value={entry.period}
            onChange={(e) => updateEntry(setter, i, "period", e.target.value)}
          />
          <TextareaField
            label="Description"
            className="mt-4"
            rows={2}
            value={entry.desc}
            onChange={(e) => updateEntry(setter, i, "desc", e.target.value)}
          />
          <Button
            variant="ghost"
            size="sm"
            icon={Trash2}
            className="mt-2 text-error!"
            onClick={() => removeEntry(setter, i)}
          >
            Remove
          </Button>
        </div>
      ))}
      <Button
        variant="secondary"
        size="sm"
        icon={Plus}
        onClick={() => addEntry(setter)}
      >
        Add entry
      </Button>
    </div>
  );

  return (
    <div>
      <PageHeader
        title="Resume Builder"
        description="Build a polished resume from structured sections."
        breadcrumbs={[{ label: "Resume Builder" }]}
        actions={
          <>
            <Button variant="secondary" icon={Eye}>
              Preview
            </Button>
            <Button
              icon={Download}
              onClick={() =>
                showToast("Resume exported as PDF.", { type: "success" })
              }
            >
              Export PDF
            </Button>
          </>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <Tabs
              tabs={[
                {
                  key: "summary",
                  label: "Summary",
                  content: (
                    <TextareaField
                      label="Professional summary"
                      rows={5}
                      value={summary}
                      onChange={(e) => setSummary(e.target.value)}
                    />
                  ),
                },
                {
                  key: "experience",
                  label: "Experience",
                  content: (
                    <EntryEditor
                      entries={experience}
                      setter={setExperience}
                      labelTitle="Role"
                      labelOrg="Company"
                    />
                  ),
                },
                {
                  key: "education",
                  label: "Education",
                  content: (
                    <EntryEditor
                      entries={education}
                      setter={setEducation}
                      labelTitle="Degree"
                      labelOrg="Institution"
                    />
                  ),
                },
              ]}
            />
          </Card>
        </div>

        <Card className="h-fit">
          <h3 className="mb-4 text-sm font-semibold text-slate-800 dark:text-slate-100">
            Live preview
          </h3>
          <div className="rounded-lg border border-slate-100 p-4 text-xs dark:border-slate-700">
            <p className="text-sm font-bold text-slate-800 dark:text-slate-100">
              Anvesha
            </p>
            <p className="mt-2 leading-relaxed text-slate-500 dark:text-slate-400">
              {summary}
            </p>
            <p className="mt-3 font-semibold text-slate-700 dark:text-slate-200">
              Experience
            </p>
            {experience.map((e, i) => (
              <p key={i} className="mt-1 text-slate-500 dark:text-slate-400">
                {e.title} · {e.org} ({e.period})
              </p>
            ))}
            <p className="mt-3 font-semibold text-slate-700 dark:text-slate-200">
              Education
            </p>
            {education.map((e, i) => (
              <p key={i} className="mt-1 text-slate-500 dark:text-slate-400">
                {e.title} · {e.org} ({e.period})
              </p>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
