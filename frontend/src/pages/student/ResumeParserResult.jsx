import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { CheckCircle2, Loader2, FileSearch, Save } from "lucide-react";
import PageHeader from "../../components/common/PageHeader";
import Card from "../../components/common/Card";
import TextField from "../../components/forms/TextField";
import TextareaField from "../../components/forms/TextareaField";
import Button from "../../components/common/Button";
import { useToast } from "../../context/ToastContext";
import { useAuth } from "../../context/AuthContext";

const STEPS = [
  "Reading document structure",
  "Extracting contact details",
  "Identifying education & experience",
  "Detecting skills & keywords",
];

const EXTRACTED_DEFAULT = {
  name: "Anvesha",
  email: "anvesha.student@example.com",
  phone: "+91 98765 43210",
  education: "B.Tech, Computer Science — MNIT Jaipur (2022–2026)",
  experience: "Full-Stack Developer Intern — TechFlow Systems (May–Jul 2026)",
  skills: "React, Node.js, Python, MongoDB, Tailwind CSS",
};

export default function ResumeParserResult() {
  const [stepIndex, setStepIndex] = useState(0);
  const [done, setDone] = useState(false);
  const [saving, setSaving] = useState(false);
  const [extracted, setExtracted] = useState(EXTRACTED_DEFAULT);
  const { showToast } = useToast();
  const { updateProfile } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const fileName = location.state?.fileName || "resume.pdf";

  useEffect(() => {
    if (stepIndex >= STEPS.length) {
      setDone(true);
      return;
    }
    const timeout = setTimeout(() => setStepIndex((i) => i + 1), 700);
    return () => clearTimeout(timeout);
  }, [stepIndex]);

  const handleSave = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 600));
    updateProfile({ headline: extracted.education });
    setSaving(false);
    showToast("Extracted details saved to your profile.", { type: "success" });
    navigate("/student/profile");
  };

  return (
    <div>
      <PageHeader
        title="Resume Parsing"
        description={`Extracting structured data from ${fileName}`}
        breadcrumbs={[
          { label: "Resume Upload", to: "/student/resume-upload" },
          { label: "Parser Result" },
        ]}
      />

      {!done ? (
        <Card className="py-12 text-center">
          <FileSearch className="mx-auto mb-4 h-10 w-10 text-primary-500" />
          <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
            Parsing your resume…
          </p>
          <div className="mx-auto mt-6 max-w-sm space-y-3 text-left">
            {STEPS.map((step, i) => (
              <div key={step} className="flex items-center gap-3 text-sm">
                {i < stepIndex ? (
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-success" />
                ) : i === stepIndex ? (
                  <Loader2 className="h-4 w-4 shrink-0 animate-spin text-primary-500" />
                ) : (
                  <span className="h-4 w-4 shrink-0 rounded-full border-2 border-slate-200 dark:border-slate-600" />
                )}
                <span
                  className={
                    i <= stepIndex
                      ? "text-slate-700 dark:text-slate-200"
                      : "text-slate-400"
                  }
                >
                  {step}
                </span>
              </div>
            ))}
          </div>
        </Card>
      ) : (
        <Card>
          <div className="mb-4 flex items-center gap-2 text-success">
            <CheckCircle2 className="h-5 w-5" />
            <p className="text-sm font-semibold">
              Parsing complete — review and edit before saving
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField
              label="Full name"
              value={extracted.name}
              onChange={(e) =>
                setExtracted((p) => ({ ...p, name: e.target.value }))
              }
            />
            <TextField
              label="Email"
              value={extracted.email}
              onChange={(e) =>
                setExtracted((p) => ({ ...p, email: e.target.value }))
              }
            />
            <TextField
              label="Phone"
              value={extracted.phone}
              onChange={(e) =>
                setExtracted((p) => ({ ...p, phone: e.target.value }))
              }
            />
            <TextField
              label="Education"
              value={extracted.education}
              onChange={(e) =>
                setExtracted((p) => ({ ...p, education: e.target.value }))
              }
            />
          </div>
          <TextareaField
            className="mt-4"
            label="Experience"
            rows={2}
            value={extracted.experience}
            onChange={(e) =>
              setExtracted((p) => ({ ...p, experience: e.target.value }))
            }
          />
          <TextareaField
            className="mt-4"
            label="Skills (comma separated)"
            rows={2}
            value={extracted.skills}
            onChange={(e) =>
              setExtracted((p) => ({ ...p, skills: e.target.value }))
            }
          />
          <Button
            className="mt-5"
            icon={Save}
            loading={saving}
            onClick={handleSave}
          >
            Save to profile
          </Button>
        </Card>
      )}
    </div>
  );
}
