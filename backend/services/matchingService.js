import { Skill, Experience, Project } from "../models/index.js";

const normalize = (s = "") => s.toLowerCase().trim();

export function computeMatchScores({
  jobTags = [],
  studentSkillNames = [],
  experienceCount = 0,
  projectTextBlob = "",
}) {
  const normTags = jobTags.map(normalize);
  const normSkills = studentSkillNames.map(normalize);

  const matchedSkills = normTags.filter((tag) =>
    normSkills.some((skill) => skill.includes(tag) || tag.includes(skill)),
  );
  const missingSkills = normTags.filter((tag) => !matchedSkills.includes(tag));
  const skillScore = normTags.length
    ? Math.round((matchedSkills.length / normTags.length) * 100)
    : 50;

  const experienceScore = Math.min(100, experienceCount * 34);

  const normBlob = normalize(projectTextBlob);
  const projectMatches = normTags.filter((tag) => normBlob.includes(tag));
  const projectScore = normTags.length
    ? Math.round((projectMatches.length / normTags.length) * 100)
    : normBlob.trim()
      ? 60
      : 20;

  const overall = Math.max(
    0,
    Math.min(
      100,
      Math.round(skillScore * 0.5 + experienceScore * 0.3 + projectScore * 0.2),
    ),
  );

  let recommendation = "Below threshold";
  if (overall >= 80) recommendation = "Strong fit";
  else if (overall >= 60) recommendation = "Worth a look";

  return {
    matchScore: overall,
    matchBreakdown: {
      skillScore,
      experienceScore,
      projectScore,
      matchedSkills: [...new Set(matchedSkills)],
      missingSkills: [...new Set(missingSkills)],
    },
    recommendation,
  };
}

export const matchingService = {
  async computeMatchForStudent(studentId, job) {
    const [skills, experience, projects] = await Promise.all([
      Skill.find({ student: studentId }),
      Experience.find({ student: studentId }),
      Project.find({ student: studentId }),
    ]);

    return computeMatchScores({
      jobTags: job.tags || [],
      studentSkillNames: skills.map((s) => s.name),
      experienceCount: experience.length,
      projectTextBlob: projects
        .map((p) => `${p.title} ${p.stack} ${p.description}`)
        .join(" "),
    });
  },
};
