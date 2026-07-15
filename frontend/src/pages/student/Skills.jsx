import { useState } from "react";
import PageHeader from "../../components/common/PageHeader";
import SectionEditor from "../../components/profile/SectionEditor";
import Badge from "../../components/common/Badge";

const LEVELS = ["Beginner", "Intermediate", "Advanced", "Expert"];

const INITIAL = [
  { id: "s1", name: "React", level: "Expert" },
  { id: "s2", name: "Node.js", level: "Advanced" },
  { id: "s3", name: "Python", level: "Intermediate" },
  { id: "s4", name: "MongoDB", level: "Advanced" },
  { id: "s5", name: "Tailwind CSS", level: "Expert" },
];

export default function Skills() {
  const [skills, setSkills] = useState(INITIAL);

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
      <SectionEditor
        title="Skills"
        addLabel="Add skill"
        emptyLabel="No skills added yet"
        entries={skills}
        onChange={setSkills}
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
    </div>
  );
}
