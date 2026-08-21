import { describe, it, expect } from "@jest/globals";
import { computeMatchScores } from "../../services/matchingService.js";

describe("computeMatchScores", () => {
  it("gives a strong-fit score when all job tags are matched by skills, experience, and projects", () => {
    const result = computeMatchScores({
      jobTags: ["React", "TypeScript"],
      studentSkillNames: ["React", "TypeScript", "Node.js"],
      experienceCount: 3,
      projectTextBlob: "Built a React and TypeScript dashboard",
    });
    expect(result.matchScore).toBeGreaterThanOrEqual(80);
    expect(result.recommendation).toBe("Strong fit");
    expect(result.matchBreakdown.matchedSkills).toEqual(
      expect.arrayContaining(["react", "typescript"]),
    );
    expect(result.matchBreakdown.missingSkills).toHaveLength(0);
  });

  it("flags missing skills correctly when the student lacks required tags", () => {
    const result = computeMatchScores({
      jobTags: ["React", "GraphQL", "Kubernetes"],
      studentSkillNames: ["React"],
      experienceCount: 0,
      projectTextBlob: "",
    });
    expect(result.matchBreakdown.missingSkills).toEqual(
      expect.arrayContaining(["graphql", "kubernetes"]),
    );
    expect(result.matchBreakdown.matchedSkills).toEqual(["react"]);
  });

  it("returns 'Below threshold' for a very weak match", () => {
    const result = computeMatchScores({
      jobTags: ["Rust", "WebAssembly"],
      studentSkillNames: ["HTML"],
      experienceCount: 0,
      projectTextBlob: "",
    });
    expect(result.matchScore).toBeLessThan(60);
    expect(result.recommendation).toBe("Below threshold");
  });

  it("caps experience score at 100 regardless of how many entries exist", () => {
    const result = computeMatchScores({
      jobTags: [],
      studentSkillNames: [],
      experienceCount: 10,
      projectTextBlob: "",
    });
    // experienceCount * 34 would be 340 without the cap
    expect(result.matchBreakdown.experienceScore).toBeLessThanOrEqual(100);
  });

  it("never returns a score outside the 0-100 range", () => {
    const result = computeMatchScores({
      jobTags: [],
      studentSkillNames: [],
      experienceCount: 0,
      projectTextBlob: "",
    });
    expect(result.matchScore).toBeGreaterThanOrEqual(0);
    expect(result.matchScore).toBeLessThanOrEqual(100);
  });

  it("is case-insensitive when matching skills to job tags", () => {
    const result = computeMatchScores({
      jobTags: ["react"],
      studentSkillNames: ["REACT"],
      experienceCount: 0,
      projectTextBlob: "",
    });
    expect(result.matchBreakdown.matchedSkills).toContain("react");
  });
});
