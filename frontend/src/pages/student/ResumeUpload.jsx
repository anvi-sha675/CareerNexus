import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle2, AlertTriangle } from "lucide-react";
import PageHeader from "../../components/common/PageHeader";
import Card from "../../components/common/Card";
import FileUpload from "../../components/common/FileUpload";
import ResumePreview from "../../components/common/ResumePreview";
import Button from "../../components/common/Button";
import { useToast } from "../../context/ToastContext";

const ATS_CHECKS = [
  { label: "Standard section headings detected", pass: true },
  { label: "Contact information found", pass: true },
  { label: "No tables or columns that confuse parsers", pass: true },
  { label: "Quantified achievements present", pass: false },
];

export default function ResumeUpload() {
  const [file, setFile] = useState(null);
  const [uploaded, setUploaded] = useState({
    name: "Anvesha_Resume.pdf",
    updatedAt: "Jul 4, 2026",
  });
  const [uploading, setUploading] = useState(false);
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setUploaded({ name: file.name, updatedAt: "Just now" });
    const fileName = file.name;
    setFile(null);
    setUploading(false);
    showToast("Resume uploaded — parsing now.", { type: "success" });
    navigate("/student/resume-parser-result", { state: { fileName } });
  };

  return (
    <div>
      <PageHeader
        title="Resume Upload"
        description="Upload your resume to power AI matching and one-click applications."
        breadcrumbs={[{ label: "Resume Upload" }]}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <h3 className="mb-4 text-sm font-semibold text-slate-800 dark:text-slate-100">
              Upload new resume
            </h3>
            <FileUpload
              file={file}
              onFileSelect={setFile}
              accept=".pdf,.doc,.docx"
              maxSizeMB={5}
            />
            <Button
              className="mt-4"
              onClick={handleUpload}
              loading={uploading}
              disabled={!file}
            >
              Upload & parse resume
            </Button>
          </Card>

          <Card>
            <h3 className="mb-4 text-sm font-semibold text-slate-800 dark:text-slate-100">
              Current resume
            </h3>
            {uploaded ? (
              <ResumePreview
                fileName={uploaded.name}
                updatedAt={uploaded.updatedAt}
                onView={() => showToast("Opening preview…", { type: "info" })}
                onDownload={() =>
                  showToast("Downloading resume…", { type: "info" })
                }
              />
            ) : (
              <p className="text-sm text-slate-400">No resume uploaded yet.</p>
            )}
          </Card>
        </div>

        <Card className="h-fit">
          <h3 className="mb-1 text-sm font-semibold text-slate-800 dark:text-slate-100">
            ATS compatibility
          </h3>
          <p className="mb-4 text-xs text-slate-400">
            Automated checks against common parsing issues.
          </p>
          <ul className="space-y-3">
            {ATS_CHECKS.map((check) => (
              <li key={check.label} className="flex items-start gap-2 text-sm">
                {check.pass ? (
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                ) : (
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
                )}
                <span className="text-slate-600 dark:text-slate-300">
                  {check.label}
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-5 rounded-xl bg-primary-50 p-4 text-center dark:bg-primary-500/10">
            <p className="text-2xl font-bold text-primary-700 dark:text-primary-400">
              84/100
            </p>
            <p className="text-xs text-primary-600 dark:text-primary-400">
              ATS score
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
