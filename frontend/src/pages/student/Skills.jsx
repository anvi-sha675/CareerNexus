import PageHeader from "../../components/common/PageHeader";
import SectionEditor from "../../components/profile/SectionEditor";
import Badge from "../../components/common/Badge";
import Spinner from "../../components/common/Spinner";
import { useSectionSync } from "../../hooks/useSectionSync";
import { skillsService } from "../../services/studentProfileService";

const LEVELS = ["Beginner", "Intermediate", "Advanced", "Expert"];

export default function Skills() {
  const { entries: skills, onChange, loading } = useSectionSync(skillsService);

  return (
    <div>
      <PageHeader
        title="Skills"
        description="Keep your skill set current so match scores stay accurate."
        breadcrumbs={[
          { label: "Profile", to: "/student/profile" },
          { label: "Skills" },
        ]}
      />
      {loading ? (
        <Spinner />
      ) : (
        <SectionEditor
          title="Skills"
          addLabel="Add skill"
          emptyLabel="No skills added yet"
          entries={skills}
          onChange={onChange}
          fields={[
            {
              name: "name",
              label: "Skill name",
              required: true,
              placeholder: "e.g. React",
            },
            {
              name: "level",
              label: "Proficiency level",
              type: "select",
              options: LEVELS,
              defaultValue: "Intermediate",
            },
          ]}
          renderItem={(entry) => (
            <div className="flex items-center gap-3">
              <span className="font-medium text-slate-800 dark:text-slate-100">
                {entry.name}
              </span>
              <Badge tone="Active">{entry.level}</Badge>
            </div>
          )}
        />
      )}
    </div>
  );
}
