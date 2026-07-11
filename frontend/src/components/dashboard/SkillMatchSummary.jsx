import Card from "../common/Card";

const DEFAULT_SKILLS = [
  { skill: "React", match: 95 },
  { skill: "Node.js", match: 88 },
  { skill: "MongoDB", match: 82 },
  { skill: "Python", match: 74 },
  { skill: "System Design", match: 58 },
];

export default function SkillMatchSummary({ skills = DEFAULT_SKILLS }) {
  return (
    <Card>
      <h3 className="mb-4 text-sm font-semibold text-slate-800 dark:text-slate-100">
        Skill match summary
      </h3>
      <div className="space-y-3">
        {skills.map((s) => (
          <div key={s.skill}>
            <div className="flex justify-between text-xs">
              <span className="font-medium text-slate-600 dark:text-slate-300">
                {s.skill}
              </span>
              <span className="text-slate-400">{s.match}%</span>
            </div>
            <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${s.match}%`,
                  backgroundColor:
                    s.match >= 80
                      ? "#22C55E"
                      : s.match >= 60
                        ? "#F59E0B"
                        : "#94A3B8",
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
