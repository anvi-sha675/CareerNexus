import { useState } from "react";
import PageHeader from "../../components/common/PageHeader";
import SectionEditor from "../../components/profile/SectionEditor";

const INITIAL = [
  {
    id: "x1",
    role: "Full-Stack Developer Intern",
    company: "TechFlow Systems",
    period: "May 2026 – Jul 2026",
    description:
      "Built and shipped 3 customer-facing features in a React/Node.js codebase.",
  },
];

export default function Experience() {
  const [experience, setExperience] = useState(INITIAL);

  return (
    <div>
      <PageHeader
        title="Experience"
        description="Internships, jobs, and other relevant work."
        breadcrumbs={[
          { label: "Profile", to: "/student/profile" },
          { label: "Experience" },
        ]}
      />
      <SectionEditor
        title="Experience"
        addLabel="Add experience"
        emptyLabel="No experience added yet"
        entries={experience}
        onChange={setExperience}
        fields={[
          { name: "role", label: "Role / title", required: true },
          { name: "company", label: "Company", required: true },
          {
            name: "period",
            label: "Period",
            placeholder: "e.g. May 2026 – Jul 2026",
          },
          { name: "description", label: "Description", type: "textarea" },
        ]}
        renderItem={(entry) => (
          <div>
            <p className="font-medium text-slate-800 dark:text-slate-100">
              {entry.role}
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {entry.company} · {entry.period}
            </p>
            {entry.description && (
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {entry.description}
              </p>
            )}
          </div>
        )}
      />
    </div>
  );
}
