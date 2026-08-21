import { User, StudentProfile, RecruiterProfile } from "../models/index.js";
import { ApiError } from "../utils/ApiError.js";
import { parsePagination, buildMeta } from "../utils/pagination.js";

export const userService = {
  async list(query) {
    const { page, limit, skip } = parsePagination(query);
    const filter = {};
    if (query.role) filter.role = query.role;
    if (query.status) filter.status = query.status;
    if (query.search) {
      filter.$or = [
        { name: { $regex: query.search, $options: "i" } },
        { email: { $regex: query.search, $options: "i" } },
      ];
    }

    const [users, total] = await Promise.all([
      User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      User.countDocuments(filter),
    ]);
    return { users, meta: buildMeta({ page, limit, total }) };
  },

  async getById(id) {
    const user = await User.findById(id);
    if (!user) throw ApiError.notFound("User not found");
    let extra = null;
    if (user.role === "student")
      extra = await StudentProfile.findOne({ user: id });
    else if (user.role === "recruiter")
      extra = await RecruiterProfile.findOne({ user: id }).populate("company");
    return { user, profile: extra };
  },

  async setStatus(id, status) {
    const user = await User.findByIdAndUpdate(id, { status }, { new: true });
    if (!user) throw ApiError.notFound("User not found");
    return user;
  },

  async setRole(id, role) {
    const user = await User.findByIdAndUpdate(id, { role }, { new: true });
    if (!user) throw ApiError.notFound("User not found");
    return user;
  },

  async remove(id) {
    const user = await User.findByIdAndDelete(id);
    if (!user) throw ApiError.notFound("User not found");
    return { deleted: true };
  },

  async listRecruiters(query) {
    const { page, limit, skip } = parsePagination(query);
    const filter = {};
    if (query.status) filter.status = query.status;

    const [recruiters, total] = await Promise.all([
      RecruiterProfile.find(filter)
        .populate("user", "name email createdAt")
        .populate("company", "name")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      RecruiterProfile.countDocuments(filter),
    ]);
    return { recruiters, meta: buildMeta({ page, limit, total }) };
  },

  async setRecruiterStatus(recruiterProfileUserId, status) {
    const profile = await RecruiterProfile.findOneAndUpdate(
      { user: recruiterProfileUserId },
      { status },
      { new: true },
    );
    if (!profile) throw ApiError.notFound("Recruiter not found");
    return profile;
  },
};
