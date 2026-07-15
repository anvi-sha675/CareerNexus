import { useState } from "react";
import PageHeader from "../../components/common/PageHeader";
import SectionEditor from "../../components/profile/SectionEditor";

const INITIAL = [
  {
    id: "p1",
    title: "Advisory System",
    stack: "React, Node.js, Gemini API",
    link: "https://github.com/an/advisory",
    description: "abc",
  },
  {
    id: "p2",
    title: "System",
    stack: "React, FastAPI, ChromaDB, GPT",
    link: "https://github.com/an/system",
    description: "abcd",
  },
];

export default function Projects() {
  const [projects, setProjects] = useState(INITIAL);

  return (
    <div>
      <PageHeader
        title="Projects"
        description="Portfolio projects recruiters will see on your profile."
        breadcrumbs={[
          { label: "Profile", to: "/student/profile" },
          { label: "Projects" },
        ]}
      />
      <SectionEditor
        title="Projects"
        addLabel="Add project"
        emptyLabel="No projects added yet"
        entries={projects}
        onChange={setProjects}
        fields={[
          { name: "title", label: "Project title", required: true },
          {
            name: "stack",
            label: "Tech stack",
            placeholder: "e.g. React, Node.js, MongoDB",
          },
          {
            name: "link",
            label: "Link (GitHub / live demo)",
            placeholder: "https://",
          },
          { name: "description", label: "Description", type: "textarea" },
        ]}
        renderItem={(entry) => (
          <div>
            <p className="font-medium text-slate-800 dark:text-slate-100">
              {entry.title}
            </p>
            {entry.stack && (
              <p className="text-xs text-primary-600 dark:text-primary-400">
                {entry.stack}
              </p>
            )}
            {entry.description && (
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {entry.description}
              </p>
            )}
            {entry.link && (
              <a
                href={entry.link}
                target="_blank"
                rel="noreferrer"
                className="mt-1 inline-block text-xs text-primary-600 hover:underline"
              >
                {entry.link}
              </a>
            )}
          </div>
        )}
      />
    </div>
  );
}
