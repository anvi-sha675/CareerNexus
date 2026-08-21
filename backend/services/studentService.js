import {
  StudentProfile,
  Skill,
  Education,
  Experience,
  Project,
  Certification,
  SavedJob,
  Application,
  Notification,
  Job,
} from "../models/index.js";
import { ApiError } from "../utils/ApiError.js";

async function recomputeCompletion(studentId) {
  const [profile, skillsCount, educationCount, experienceCount, projectsCount] =
    await Promise.all([
      StudentProfile.findOne({ user: studentId }),
      Skill.countDocuments({ student: studentId }),
      Education.countDocuments({ student: studentId }),
      Experience.countDocuments({ student: studentId }),
      Project.countDocuments({ student: studentId }),
    ]);
  if (!profile) return null;
  profile.computeCompletion({
    skillsCount,
    educationCount,
    experienceCount,
    projectsCount,
    hasResume: !!profile.resume,
  });
  await profile.save();
  return profile;
}

function makeSectionCrud(Model, ownerField = "student") {
  return {
    list: (studentId) =>
      Model.find({ [ownerField]: studentId }).sort({ createdAt: -1 }),
    create: async (studentId, payload) => {
      const doc = await Model.create({ [ownerField]: studentId, ...payload });
      await recomputeCompletion(studentId);
      return doc;
    },
    update: async (studentId, id, payload) => {
      const doc = await Model.findOneAndUpdate(
        { _id: id, [ownerField]: studentId },
        payload,
        { new: true, runValidators: true },
      );
      if (!doc) throw ApiError.notFound("Entry not found");
      return doc;
    },
    remove: async (studentId, id) => {
      const doc = await Model.findOneAndDelete({
        _id: id,
        [ownerField]: studentId,
      });
      if (!doc) throw ApiError.notFound("Entry not found");
      await recomputeCompletion(studentId);
      return { deleted: true };
    },
  };
}

export const skillsCrud = makeSectionCrud(Skill);
export const educationCrud = makeSectionCrud(Education);
export const experienceCrud = makeSectionCrud(Experience);
export const projectsCrud = makeSectionCrud(Project);
export const certificationsCrud = makeSectionCrud(Certification);

export const studentService = {
  async getProfile(userId) {
    let profile = await StudentProfile.findOne({ user: userId })
      .populate("user", "name email avatar phone")
      .populate("resume");
    if (!profile) profile = await StudentProfile.create({ user: userId });
    return profile;
  },

  async updateProfile(userId, payload) {
    const profile = await StudentProfile.findOneAndUpdate(
      { user: userId },
      payload,
      { new: true, runValidators: true, upsert: true },
    );
    return profile;
  },

  async saveJob(studentId, jobId) {
    const job = await Job.findById(jobId);
    if (!job) throw ApiError.notFound("Job not found");
    const existing = await SavedJob.findOne({ student: studentId, job: jobId });
    if (existing) return existing;
    return SavedJob.create({ student: studentId, job: jobId });
  },

  async unsaveJob(studentId, jobId) {
    await SavedJob.findOneAndDelete({ student: studentId, job: jobId });
    return { removed: true };
  },

  async listSavedJobs(studentId) {
    const saved = await SavedJob.find({ student: studentId }).populate({
      path: "job",
      populate: { path: "company", select: "name logo" },
    });
    return saved.map((s) => s.job).filter(Boolean);
  },

  async getDashboardStats(studentId) {
    const [applications, unreadNotifications, profile] = await Promise.all([
      Application.find({ student: studentId })
        .populate({
          path: "job",
          populate: { path: "company", select: "name logo" },
        })
        .sort({ createdAt: -1 }),
      Notification.countDocuments({ recipient: studentId, read: false }),
      StudentProfile.findOne({ user: studentId }),
    ]);

    const activeApplications = applications.filter(
      (a) => !["Rejected", "Offered", "Withdrawn"].includes(a.status),
    ).length;

    return {
      totalApplications: applications.length,
      activeApplications,
      unreadNotifications,
      profileCompletion: profile?.profileCompletion || 0,
      recentApplications: applications.slice(0, 5),
    };
  },
};
