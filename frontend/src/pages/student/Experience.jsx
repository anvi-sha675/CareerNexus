import PageHeader from "../../components/common/PageHeader";
import SectionEditor from "../../components/profile/SectionEditor";
import Spinner from "../../components/common/Spinner";
import { useSectionSync } from "../../hooks/useSectionSync";
import { experienceService } from "../../services/studentProfileService";

export default function Experience() {
  const {
    entries: experience,
    onChange,
    loading,
  } = useSectionSync(experienceService);

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
      {loading ? (
        <Spinner />
      ) : (
        <SectionEditor
          title="Experience"
          addLabel="Add experience"
          emptyLabel="No experience added yet"
          entries={experience}
          onChange={onChange}
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
      )}
    </div>
  );
}
