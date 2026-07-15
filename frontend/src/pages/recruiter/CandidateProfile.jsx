import { useParams, Link } from "react-router-dom";
import { Mail, Phone, Link2, Globe, MapPin, Download } from "lucide-react";
import PageHeader from "../../components/common/PageHeader";
import Card from "../../components/common/Card";
import Avatar from "../../components/common/Avatar";
import Badge from "../../components/common/Badge";
import Button from "../../components/common/Button";
import Spinner from "../../components/common/Spinner";
import ErrorState from "../../components/common/ErrorState";
import { useAsync } from "../../hooks/useAsync";
import * as applicationsService from "../../services/applicationsService";

const SKILLS = ["React", "Node.js", "TypeScript", "MongoDB", "AWS"];
const EDUCATION = [
  {
    degree: "B.Tech, Computer Science",
    institution: "MNIT Jaipur",
    period: "2022 – 2026",
  },
];
const EXPERIENCE = [
  {
    role: "Software Engineering Intern",
    company: "Loopwork",
    period: "May 2025 – Aug 2025",
  },
  {
    role: "Frontend Developer",
    company: "Freelance",
    period: "Jan 2024 – Present",
  },
];
const PROJECTS = [
  { title: "Advisory", stack: "React, Node.js, Gemini API" },
  { title: "System", stack: "React, FastAPI, ChromaDB" },
];

export default function CandidateProfile() {
  const { id } = useParams();
  const {
    data: applicants,
    loading,
    error,
    refetch,
  } = useAsync(() => applicationsService.getApplicantsForJob("j1"), []);
  const candidate = applicants?.find((a) => a.id === id) || applicants?.[0];

  if (loading) return <Spinner />;
  if (error || !candidate)
    return (
      <ErrorState
        onRetry={refetch}
        description="We couldn't load this candidate's profile."
      />
    );

  return (
    <div>
      <PageHeader
        breadcrumbs={[
          { label: "Applicants", to: "/recruiter/applicants" },
          { label: candidate.name },
        ]}
        title={candidate.name}
        description="Full candidate profile"
        actions={
          <Link to={`/recruiter/applicants/${candidate.id}`}>
            <Button variant="secondary">View application</Button>
          </Link>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
            <Avatar name={candidate.name} size="xl" />
            <div className="min-w-0 flex-1">
              <p className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                {candidate.name}
              </p>
              <p className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
                <Mail className="h-3.5 w-3.5" />
                {candidate.email}
              </p>
              <p className="mt-0.5 flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
                <MapPin className="h-3.5 w-3.5" />
                Jaipur, Rajasthan, IN
              </p>
              <div className="mt-2 flex gap-2">
                <Button size="sm" variant="ghost" icon={Link2}>
                  GitHub
                </Button>
                <Button size="sm" variant="ghost" icon={Globe}>
                  LinkedIn
                </Button>
                <Button size="sm" variant="ghost" icon={Phone}>
                  Contact
                </Button>
              </div>
            </div>
          </Card>

          <Card>
            <h3 className="mb-3 text-sm font-semibold text-slate-800 dark:text-slate-100">
              Skills
            </h3>
            <div className="flex flex-wrap gap-2">
              {SKILLS.map((s) => (
                <Badge key={s} tone="Applied">
                  {s}
                </Badge>
              ))}
            </div>
          </Card>

          <Card>
            <h3 className="mb-3 text-sm font-semibold text-slate-800 dark:text-slate-100">
              Experience
            </h3>
            <div className="space-y-3">
              {EXPERIENCE.map((e) => (
                <div key={e.role}>
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                    {e.role} — {e.company}
                  </p>
                  <p className="text-xs text-slate-400">{e.period}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <h3 className="mb-3 text-sm font-semibold text-slate-800 dark:text-slate-100">
              Education
            </h3>
            {EDUCATION.map((e) => (
              <div key={e.degree}>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                  {e.degree}
                </p>
                <p className="text-xs text-slate-400">
                  {e.institution} · {e.period}
                </p>
              </div>
            ))}
          </Card>

          <Card>
            <h3 className="mb-3 text-sm font-semibold text-slate-800 dark:text-slate-100">
              Projects
            </h3>
            <div className="space-y-3">
              {PROJECTS.map((p) => (
                <div key={p.title}>
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                    {p.title}
                  </p>
                  <p className="text-xs text-primary-600 dark:text-primary-400">
                    {p.stack}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Overall match
            </p>
            <p className="mt-1 text-3xl font-bold text-success">
              {candidate.matchScore}%
            </p>
          </Card>
          <Card>
            <Button variant="secondary" icon={Download} fullWidth>
              Download resume
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
