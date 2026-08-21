import fs from "fs/promises";
import { Resume } from "../models/index.js";
import { ApiError } from "../utils/ApiError.js";

const KNOWN_SKILLS = [
  "React",
  "Node.js",
  "JavaScript",
  "TypeScript",
  "Python",
  "Java",
  "MongoDB",
  "SQL",
  "PostgreSQL",
  "Express",
  "Next.js",
  "Vue",
  "Angular",
  "Tailwind",
  "CSS",
  "HTML",
  "AWS",
  "Docker",
  "Kubernetes",
  "GraphQL",
  "REST",
  "Git",
  "Redux",
  "Django",
  "Flask",
  "FastAPI",
  "C++",
  "Go",
  "Rust",
  "PHP",
  "Machine Learning",
  "TensorFlow",
  "PyTorch",
  "Data Analysis",
  "Figma",
  "UI/UX",
];

const EMAIL_RE = /[^\s@]+@[^\s@]+\.[^\s@]+/;
const PHONE_RE = /\+?\(?\d{2,4}\)?[\d\s.-]{6,16}\d/;

export function extractSkills(text) {
  const lower = text.toLowerCase();
  return KNOWN_SKILLS.filter((skill) => lower.includes(skill.toLowerCase()));
}

export function extractSection(text, headings) {
  const lines = text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
  const results = [];
  let capturing = false;
  for (const line of lines) {
    const lower = line.toLowerCase();
    if (headings.some((h) => lower === h || lower.startsWith(h))) {
      capturing = true;
      continue;
    }
    if (capturing) {
      // Stop capturing once we hit what looks like the next section heading (short, capitalized line).
      if (
        line.length < 40 &&
        /^[A-Z][A-Za-z /&]+$/.test(line) &&
        !line.includes(",")
      )
        break;
      results.push(line);
      if (results.length >= 6) break;
    }
  }
  return results;
}

export function parseResumeText(text) {
  const emailMatch = text.match(EMAIL_RE);
  const phoneMatch = text.match(PHONE_RE);
  const firstLine =
    text
      .split("\n")
      .map((l) => l.trim())
      .find(Boolean) || "";

  return {
    name: firstLine.length < 60 ? firstLine : "",
    email: emailMatch ? emailMatch[0] : "",
    phone: phoneMatch ? phoneMatch[0] : "",
    skills: extractSkills(text),
    education: extractSection(text, ["education", "academic background"]),
    experience: extractSection(text, [
      "experience",
      "work experience",
      "employment history",
    ]),
    projects: extractSection(text, ["projects", "personal projects"]),
  };
}

export function computeAtsScore(parsed, text) {
  const checks = [
    {
      label: "Standard section headings detected",
      pass: parsed.education.length > 0 || parsed.experience.length > 0,
    },
    { label: "Contact information found", pass: !!parsed.email },
    { label: "Skills section detected", pass: parsed.skills.length > 0 },
    {
      label: "Quantified achievements present",
      pass: /\d+%|\d+x|\$\d+/.test(text),
    },
  ];
  const score = Math.round(
    (checks.filter((c) => c.pass).length / checks.length) * 100,
  );
  return { score, checks };
}

export const resumeService = {
  async uploadAndParse({ studentId, file }) {
    if (!file) throw ApiError.badRequest("No file uploaded");

    let rawText = "";
    const isDocx =
      file.mimetype ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

    if (file.mimetype === "application/pdf") {
      const pdfParse = (await import("pdf-parse")).default;
      const buffer = await fs.readFile(file.path);
      const data = await pdfParse(buffer);
      rawText = data.text || "";
    } else if (isDocx) {
      const mammoth = (await import("mammoth")).default;
      const buffer = await fs.readFile(file.path);
      const { value } = await mammoth.extractRawText({ buffer });
      rawText = value || "";
    } else {
      rawText = "";
    }

    const parsed = rawText
      ? parseResumeText(rawText)
      : {
          name: "",
          email: "",
          phone: "",
          skills: [],
          education: [],
          experience: [],
          projects: [],
        };
    const { score, checks } = computeAtsScore(parsed, rawText);

    await Resume.updateMany({ student: studentId }, { isActive: false });

    const resume = await Resume.create({
      student: studentId,
      fileName: file.originalname,
      fileUrl: `/uploads/resumes/${file.filename}`,
      fileSizeBytes: file.size,
      mimeType: file.mimetype,
      rawText,
      parsed,
      atsScore: score,
      atsChecks: checks,
      isActive: true,
    });

    return resume;
  },

  async getActiveResume(studentId) {
    return Resume.findOne({ student: studentId, isActive: true }).sort({
      createdAt: -1,
    });
  },

  async listResumes(studentId) {
    return Resume.find({ student: studentId }).sort({ createdAt: -1 });
  },

  async updateParsedFields(resumeId, studentId, patch) {
    const resume = await Resume.findOne({ _id: resumeId, student: studentId });
    if (!resume) throw ApiError.notFound("Resume not found");
    resume.parsed = { ...resume.parsed.toObject(), ...patch };
    await resume.save();
    return resume;
  },
};
