import PageHeader from "../../components/common/PageHeader";
import SectionEditor from "../../components/profile/SectionEditor";
import Spinner from "../../components/common/Spinner";
import { useSectionSync } from "../../hooks/useSectionSync";
import { projectsService } from "../../services/studentProfileService";

export default function Projects() {
  const {
    entries: projects,
    onChange,
    loading,
  } = useSectionSync(projectsService);

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
      {loading ? (
        <Spinner />
      ) : (
        <SectionEditor
          title="Projects"
          addLabel="Add project"
          emptyLabel="No projects added yet"
          entries={projects}
          onChange={onChange}
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
      )}
    </div>
  );
}
