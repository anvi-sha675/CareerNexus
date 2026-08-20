import mongoose from "mongoose";

const studentProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    headline: { type: String, default: "", maxlength: 160 },
    bio: { type: String, default: "", maxlength: 1000 },
    college: { type: String, default: "" },
    location: { type: String, default: "" },
    languages: [{ type: String, trim: true }],
    portfolioUrl: { type: String, default: "" },
    githubUrl: { type: String, default: "" },
    linkedinUrl: { type: String, default: "" },
    preferredRoles: [{ type: String, trim: true }],
    availability: {
      type: String,
      enum: ["Immediately", "2 Weeks", "1 Month", "Not Available"],
      default: "Immediately",
    },
    preferredJobType: { type: String, default: "Full-time" },
    preferredWorkMode: {
      type: String,
      enum: ["Remote", "On-site", "Hybrid"],
      default: "Remote",
    },
    resume: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Resume",
      default: null,
    },
    profileCompletion: { type: Number, default: 0, min: 0, max: 100 },

    resumeSummary: { type: String, default: "", maxlength: 1500 },
    resumeTemplate: {
      type: String,
      enum: ["classic", "modern", "minimal"],
      default: "classic",
    },
    resumeBuilderUpdatedAt: { type: Date, default: null },
  },
  { timestamps: true },
);

studentProfileSchema.methods.computeCompletion = function computeCompletion({
  skillsCount = 0,
  educationCount = 0,
  experienceCount = 0,
  projectsCount = 0,
  hasResume = false,
} = {}) {
  const checks = [
    !!this.headline,
    !!this.bio,
    !!this.college,
    skillsCount > 0,
    educationCount > 0,
    experienceCount > 0,
    projectsCount > 0,
    hasResume,
  ];
  const complete = checks.filter(Boolean).length;
  this.profileCompletion = Math.round((complete / checks.length) * 100);
  return this.profileCompletion;
};

export default mongoose.model("StudentProfile", studentProfileSchema);
