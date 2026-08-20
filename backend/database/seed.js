/* eslint-disable no-console */
import "dotenv/config";
import mongoose from "mongoose";
import { connectDB, disconnectDB } from "../config/db.js";
import {
  User,
  StudentProfile,
  RecruiterProfile,
  Company,
  Job,
  Application,
  Interview,
  Notification,
  Skill,
  Education,
  Experience,
  Project,
  Certification,
  SystemSetting,
} from "../models/index.js";
import {
  ROLES,
  COMPANY_VERIFICATION_STATUS,
  APPLICATION_STATUS,
} from "../constants/index.js";

const SEED_PASSWORD = "Password123!";

const shouldDestroy = process.argv.includes("--destroy");

async function destroyAll() {
  const collections = [
    User,
    StudentProfile,
    RecruiterProfile,
    Company,
    Job,
    Application,
    Interview,
    Notification,
    Skill,
    Education,
    Experience,
    Project,
    Certification,
    SystemSetting,
  ];
  for (const Model of collections) {
    await Model.deleteMany({});
  }
  console.log("✔ All collections cleared");
}

async function seed() {
  await connectDB();

  if (shouldDestroy) {
    await destroyAll();
    await disconnectDB();
    console.log(
      "Database wiped. Run `npm run seed` (without --destroy) to repopulate.",
    );
    return;
  }

  await destroyAll();

  // ---------- Users ----------
  const admin = await User.create({
    name: "Priya Nair",
    email: "priya.admin@careernexus.io",
    password: SEED_PASSWORD,
    role: ROLES.ADMIN,
    isEmailVerified: true,
  });

  const student = await User.create({
    name: "Anvesha Sharma",
    email: "anvesha.student@example.com",
    password: SEED_PASSWORD,
    role: ROLES.STUDENT,
    isEmailVerified: true,
  });
  const student2 = await User.create({
    name: "Ishaan Verma",
    email: "ishaan.v@example.com",
    password: SEED_PASSWORD,
    role: ROLES.STUDENT,
    isEmailVerified: true,
  });

  const recruiter = await User.create({
    name: "Rohan Mehta",
    email: "rohan@techflowsystems.com",
    password: SEED_PASSWORD,
    role: ROLES.RECRUITER,
    isEmailVerified: true,
  });
  const recruiter2 = await User.create({
    name: "Karan Singh",
    email: "karan@nimbuscloud.io",
    password: SEED_PASSWORD,
    role: ROLES.RECRUITER,
    isEmailVerified: true,
  });

  console.log("✔ Users created");

  // ---------- Companies ----------
  const techflow = await Company.create({
    name: "TechFlow Systems",
    owner: recruiter._id,
    industry: "Software / SaaS",
    size: "51-200",
    website: "https://techflowsystems.com",
    location: "Bengaluru, India",
    about:
      "TechFlow Systems builds developer productivity tools used by thousands of engineering teams worldwide.",
    benefits: [
      "Health insurance",
      "Remote-friendly",
      "Learning stipend",
      "Flexible hours",
    ],
    verificationStatus: COMPANY_VERIFICATION_STATUS.APPROVED,
    verifiedAt: new Date(),
    verifiedBy: admin._id,
  });

  const nimbus = await Company.create({
    name: "NimbusCloud",
    owner: recruiter2._id,
    industry: "Cloud Infrastructure",
    size: "201-500",
    website: "https://nimbuscloud.io",
    location: "Hyderabad, India",
    about:
      "NimbusCloud provides scalable cloud infrastructure for logistics platforms.",
    verificationStatus: COMPANY_VERIFICATION_STATUS.PENDING,
  });

  await RecruiterProfile.create({
    user: recruiter._id,
    company: techflow._id,
    status: "approved",
    approvedAt: new Date(),
    approvedBy: admin._id,
  });
  await RecruiterProfile.create({
    user: recruiter2._id,
    company: nimbus._id,
    status: "pending",
  });

  console.log("✔ Companies created");

  // ---------- Student profiles + sub-resources ----------
  await StudentProfile.create({
    user: student._id,
    headline: "Final Year CS Student · Full-Stack & AI",
    college: "Malaviya National Institute of Technology, Jaipur",
    bio: "Aspiring full-stack developer passionate about building AI-powered products that solve real problems.",
    location: "Jaipur, India",
    languages: ["English", "Hindi"],
    githubUrl: "https://github.com/anvesha",
    preferredRoles: ["Frontend Engineer", "Full-Stack Developer"],
    preferredWorkMode: "Remote",
  });
  await StudentProfile.create({
    user: student2._id,
    headline: "Aspiring Backend Engineer",
    college: "IIIT Hyderabad",
  });

  await Skill.insertMany([
    { student: student._id, name: "React", level: "Expert" },
    { student: student._id, name: "Node.js", level: "Advanced" },
    { student: student._id, name: "Python", level: "Intermediate" },
    { student: student._id, name: "MongoDB", level: "Advanced" },
    { student: student._id, name: "Tailwind CSS", level: "Expert" },
  ]);
  await Education.create({
    student: student._id,
    institution: "Malaviya National Institute of Technology",
    degree: "B.Tech, Computer Science",
    period: "2022 – 2026",
    grade: "CGPA: 8.7/10",
  });
  await Experience.create({
    student: student._id,
    role: "Full-Stack Developer Intern",
    company: "TechFlow Systems",
    period: "May 2026 – Jul 2026",
    description:
      "Built and shipped 3 customer-facing features in a React/Node.js codebase.",
  });
  await Project.insertMany([
    {
      student: student._id,
      title: "AgriAI Advisory System",
      stack: "React, Node.js, Gemini API",
      description: "Full-stack AI agricultural advisory platform.",
    },
    {
      student: student._id,
      title: "RecruitAI",
      stack: "React, FastAPI, ChromaDB",
      description:
        "AI-powered recruitment intelligence platform built for a hackathon.",
    },
  ]);
  await Certification.create({
    student: student._id,
    name: "AWS Certified Cloud Practitioner",
    issuer: "Amazon Web Services",
    date: "March 2026",
  });

  console.log("✔ Student profiles populated");

  // ---------- Jobs ----------
  const job1 = await Job.create({
    title: "Frontend Engineer",
    company: techflow._id,
    postedBy: recruiter._id,
    location: "Bengaluru, IN",
    type: "Full-time",
    experience: "Entry Level",
    remote: true,
    salaryMin: 800000,
    salaryMax: 1400000,
    tags: ["React", "TypeScript", "Tailwind"],
    description:
      "Build delightful, high-performance interfaces for our B2B analytics suite. You'll own features end to end alongside design and backend.",
    requirements: [
      "Strong fundamentals in React and TypeScript",
      "Experience with modern CSS/Tailwind",
      "Excellent communication skills",
    ],
    status: "active",
  });

  const job2 = await Job.create({
    title: "Backend Developer (Node.js)",
    company: nimbus._id,
    postedBy: recruiter2._id,
    location: "Hyderabad, IN",
    type: "Full-time",
    experience: "Mid Level",
    remote: false,
    salaryMin: 900000,
    salaryMax: 1600000,
    tags: ["Node.js", "MongoDB", "AWS"],
    description:
      "Design and scale our core APIs handling millions of daily requests across our logistics platform.",
    status: "active",
  });

  const job3 = await Job.create({
    title: "QA Automation Engineer",
    company: techflow._id,
    postedBy: recruiter._id,
    location: "Bengaluru, IN",
    type: "Contract",
    experience: "Mid Level",
    remote: true,
    salaryMin: 500000,
    salaryMax: 800000,
    tags: ["Cypress", "Playwright"],
    description:
      "6-month contract to build our end-to-end automation suite from scratch.",
    status: "closed",
  });

  console.log("✔ Jobs created");

  // ---------- Applications + Interview ----------
  const application1 = await Application.create({
    job: job1._id,
    student: student._id,
    status: APPLICATION_STATUS.INTERVIEW,
    matchScore: 92,
    matchBreakdown: {
      skillScore: 95,
      experienceScore: 68,
      projectScore: 80,
      matchedSkills: ["react", "typescript", "tailwind"],
      missingSkills: [],
    },
    timeline: [
      {
        status: APPLICATION_STATUS.APPLIED,
        changedAt: new Date(Date.now() - 12 * 86400000),
      },
      {
        status: APPLICATION_STATUS.UNDER_REVIEW,
        changedAt: new Date(Date.now() - 9 * 86400000),
      },
      {
        status: APPLICATION_STATUS.INTERVIEW,
        changedAt: new Date(Date.now() - 3 * 86400000),
      },
    ],
  });
  job1.applicantsCount += 1;
  await job1.save();

  await Interview.create({
    application: application1._id,
    job: job1._id,
    student: student._id,
    recruiter: recruiter._id,
    scheduledDate: new Date(Date.now() + 3 * 86400000),
    time: "11:00 AM",
    mode: "Video Call",
    meetingLink: "https://meet.careernexus.io/tf-anvesha",
    interviewerName: "Rohan Mehta",
    notes: "Bring examples of recent React projects.",
  });

  console.log("✔ Applications & interview seeded");

  // ---------- Notifications ----------
  await Notification.insertMany([
    {
      recipient: student._id,
      title: "Interview scheduled",
      message:
        "TechFlow Systems scheduled your interview for Frontend Engineer.",
      type: "success",
      category: "interview",
    },
    {
      recipient: student._id,
      title: "Profile 78% complete",
      message: "Add a certification to reach 90% profile completion.",
      type: "warning",
      category: "profile",
      read: true,
    },
    {
      recipient: recruiter._id,
      title: "New applicant",
      message: "Anvesha applied for Frontend Engineer",
      type: "info",
      category: "application",
    },
  ]);

  console.log("✔ Notifications seeded");

  // ---------- System settings ----------
  await SystemSetting.insertMany([
    { key: "platformName", value: "CareerNexus" },
    { key: "supportEmail", value: "support@careernexus.io" },
    { key: "allowRecruiterRegistrations", value: true },
    { key: "maintenanceMode", value: false },
  ]);

  console.log("✔ System settings seeded");
  console.log("\n================ SEED COMPLETE ================");
  console.log(`All seeded accounts use the password: ${SEED_PASSWORD}\n`);
  console.log(`  Admin:      priya.admin@careernexus.io`);
  console.log(`  Student:    anvesha.student@example.com`);
  console.log(`  Student 2:  ishaan.v@example.com`);
  console.log(
    `  Recruiter (approved, TechFlow Systems): rohan@techflowsystems.com`,
  );
  console.log(
    `  Recruiter (pending, NimbusCloud):        karan@nimbuscloud.io`,
  );
  console.log("=================================================\n");

  await disconnectDB();
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  mongoose.connection.close();
  process.exit(1);
});
