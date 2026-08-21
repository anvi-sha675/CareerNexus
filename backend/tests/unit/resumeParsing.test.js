import { describe, it, expect } from "@jest/globals";
import {
  extractSkills,
  parseResumeText,
  computeAtsScore,
} from "../../services/resumeService.js";

const SAMPLE_RESUME = `Anvesha
anvesha.student@example.com
+91 98765 43210

Education
B.Tech Computer Science, MNIT Jaipur, 2022-2026
CGPA 8.7/10

Experience
Full-Stack Developer Intern, TechFlow Systems
Built React and Node.js features, improved load time by 40%

Projects
AgriAI Advisory System
React and MongoDB based crop advisory platform

Skills
React, Node.js, Python, MongoDB, AWS, Docker`;

describe("extractSkills", () => {
  it("finds known skills mentioned in the resume text", () => {
    const skills = extractSkills(SAMPLE_RESUME);
    expect(skills).toEqual(
      expect.arrayContaining([
        "React",
        "Node.js",
        "Python",
        "MongoDB",
        "AWS",
        "Docker",
      ]),
    );
  });

  it("returns an empty array when no known skills are present", () => {
    expect(extractSkills("I like long walks on the beach")).toEqual([]);
  });
});

describe("parseResumeText", () => {
  it("extracts email and phone", () => {
    const parsed = parseResumeText(SAMPLE_RESUME);
    expect(parsed.email).toBe("anvesha.student@example.com");
    expect(parsed.phone).toBeTruthy();
  });

  it("extracts the first line as a name candidate", () => {
    const parsed = parseResumeText(SAMPLE_RESUME);
    expect(parsed.name).toBe("Anvesha Sharma");
  });

  it("extracts skills", () => {
    const parsed = parseResumeText(SAMPLE_RESUME);
    expect(parsed.skills.length).toBeGreaterThan(0);
  });
});

describe("computeAtsScore", () => {
  it("scores a well-structured resume highly", () => {
    const parsed = parseResumeText(SAMPLE_RESUME);
    const { score, checks } = computeAtsScore(parsed, SAMPLE_RESUME);
    expect(score).toBeGreaterThanOrEqual(50);
    expect(checks).toHaveLength(4);
  });

  it("scores an empty resume poorly", () => {
    const parsed = { email: "", education: [], experience: [], skills: [] };
    const { score } = computeAtsScore(parsed, "");
    expect(score).toBe(0);
  });
});
