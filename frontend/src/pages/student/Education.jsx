import PageHeader from "../../components/common/PageHeader";
import SectionEditor from "../../components/profile/SectionEditor";
import Spinner from "../../components/common/Spinner";
import { useSectionSync } from "../../hooks/useSectionSync";
import { educationService } from "../../services/studentProfileService";

export default function Education() {
  const {
    entries: education,
    onChange,
    loading,
  } = useSectionSync(educationService);

  return (
    <div>
      <PageHeader
        title="Education"
        description="Your academic background."
        breadcrumbs={[
          { label: "Profile", to: "/student/profile" },
          { label: "Education" },
        ]}
      />
      {loading ? (
        <Spinner />
      ) : (
        <SectionEditor
          title="Education"
          addLabel="Add education"
          emptyLabel="No education added yet"
          entries={education}
          onChange={onChange}
          fields={[
            { name: "institution", label: "Institution", required: true },
            {
              name: "degree",
              label: "Degree / field of study",
              required: true,
            },
            {
              name: "period",
              label: "Period",
              placeholder: "e.g. 2022 – 2026",
            },
            { name: "grade", label: "Grade / CGPA" },
          ]}
          renderItem={(entry) => (
            <div>
              <p className="font-medium text-slate-800 dark:text-slate-100">
                {entry.degree}
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {entry.institution}
              </p>
              <p className="text-xs text-slate-400">
                {entry.period} {entry.grade && `· ${entry.grade}`}
              </p>
            </div>
          )}
        />
      )}
    </div>
  );
}
