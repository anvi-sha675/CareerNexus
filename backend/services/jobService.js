import { Job, Company, Application, SavedJob } from "../models/index.js";
import { ApiError } from "../utils/ApiError.js";
import { parsePagination, buildMeta } from "../utils/pagination.js";
import { matchingService } from "./matchingService.js";
import { JOB_STATUS } from "../constants/index.js";

export const jobService = {
  async list(query, viewer) {
    const { page, limit, skip } = parsePagination(query);
    const filter = { status: JOB_STATUS.ACTIVE };

    if (query.search) filter.$text = { $search: query.search };
    if (query.type)
      filter.type = Array.isArray(query.type)
        ? { $in: query.type }
        : query.type;
    if (query.experience)
      filter.experience = Array.isArray(query.experience)
        ? { $in: query.experience }
        : query.experience;
    if (query.remote === "true") filter.remote = true;
    if (query.company) filter.company = query.company;

    let sort = { createdAt: -1 };
    if (query.sort === "salary") sort = { salaryMax: -1 };
    else if (query.sort === "recent") sort = { createdAt: -1 };

    const [jobs, total] = await Promise.all([
      Job.find(filter)
        .populate("company", "name logo location")
        .sort(sort)
        .skip(skip)
        .limit(limit),
      Job.countDocuments(filter),
    ]);

    let enriched = jobs;
    if (viewer && viewer.role === "student") {
      enriched = await Promise.all(
        jobs.map(async (job) => {
          const { matchScore } = await matchingService.computeMatchForStudent(
            viewer._id,
            job,
          );
          return { ...job.toObject(), matchScore };
        }),
      );
    }

    return { jobs: enriched, meta: buildMeta({ page, limit, total }) };
  },

  async getById(id, viewer) {
    const job = await Job.findById(id).populate("company");
    if (!job) throw ApiError.notFound("Job not found");
    job.views += 1;
    await job.save();

    let matchScore = null;
    let matchBreakdown = null;
    if (viewer && viewer.role === "student") {
      const result = await matchingService.computeMatchForStudent(
        viewer._id,
        job,
      );
      matchScore = result.matchScore;
      matchBreakdown = result.matchBreakdown;
    }

    return { ...job.toObject(), matchScore, matchBreakdown };
  },

  async create(recruiterId, payload) {
    const company = await Company.findOne({ owner: recruiterId });
    if (!company)
      throw ApiError.badRequest(
        "Complete your company profile before posting a job",
      );

    const isDraft = !!payload.isDraft;
    if (!isDraft && company.verificationStatus !== "approved") {
      throw ApiError.forbidden(
        "Your company must be verified by an admin before you can publish jobs",
      );
    }

    return Job.create({
      ...payload,
      company: company._id,
      postedBy: recruiterId,
      isDraft,
      status: isDraft ? JOB_STATUS.DRAFT : JOB_STATUS.ACTIVE,
    });
  },

  async publish(recruiterId, jobId) {
    const job = await Job.findOne({ _id: jobId, postedBy: recruiterId });
    if (!job) throw ApiError.notFound("Job not found");
    if (!job.isDraft && job.status === JOB_STATUS.ACTIVE) {
      throw ApiError.badRequest("This job is already published");
    }

    const company = await Company.findById(job.company);
    if (!company || company.verificationStatus !== "approved") {
      throw ApiError.forbidden(
        "Your company must be verified by an admin before you can publish jobs",
      );
    }

    job.isDraft = false;
    job.status = JOB_STATUS.ACTIVE;
    await job.save();
    return job;
  },

  async archive(recruiterId, jobId) {
    const job = await Job.findOneAndUpdate(
      { _id: jobId, postedBy: recruiterId },
      { status: JOB_STATUS.ARCHIVED, isDraft: false },
      { new: true },
    );
    if (!job) throw ApiError.notFound("Job not found");
    return job;
  },

  async update(recruiterId, jobId, payload) {
    const job = await Job.findOne({ _id: jobId, postedBy: recruiterId });
    if (!job)
      throw ApiError.notFound(
        "Job not found or you don't have permission to edit it",
      );
    Object.assign(job, payload);
    await job.save();
    return job;
  },

  async remove(recruiterId, jobId) {
    const job = await Job.findOneAndDelete({
      _id: jobId,
      postedBy: recruiterId,
    });
    if (!job)
      throw ApiError.notFound(
        "Job not found or you don't have permission to delete it",
      );
    await Application.deleteMany({ job: jobId });
    await SavedJob.deleteMany({ job: jobId });
    return { deleted: true };
  },

  async duplicate(recruiterId, jobId) {
    const job = await Job.findOne({ _id: jobId, postedBy: recruiterId }).lean();
    if (!job) throw ApiError.notFound("Job not found");
    delete job._id;
    delete job.createdAt;
    delete job.updatedAt;
    return Job.create({
      ...job,
      title: `${job.title} (Copy)`,
      applicantsCount: 0,
      views: 0,
    });
  },

  async setStatus(recruiterId, jobId, status) {
    const job = await Job.findOneAndUpdate(
      { _id: jobId, postedBy: recruiterId },
      { status },
      { new: true },
    );
    if (!job) throw ApiError.notFound("Job not found");
    return job;
  },

  async listForRecruiter(recruiterId, query) {
    const { page, limit, skip } = parsePagination(query);
    const filter = { postedBy: recruiterId };
    if (query.status) filter.status = query.status;
    if (query.search) filter.title = { $regex: query.search, $options: "i" };

    const [jobs, total] = await Promise.all([
      Job.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Job.countDocuments(filter),
    ]);
    return { jobs, meta: buildMeta({ page, limit, total }) };
  },

  async adminList(query) {
    const { page, limit, skip } = parsePagination(query);
    const filter = {};
    if (query.status) filter.status = query.status;
    if (query.flagged === "true") filter.status = JOB_STATUS.FLAGGED;
    if (query.search) filter.title = { $regex: query.search, $options: "i" };

    const [jobs, total] = await Promise.all([
      Job.find(filter)
        .populate("company", "name")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Job.countDocuments(filter),
    ]);
    return { jobs, meta: buildMeta({ page, limit, total }) };
  },

  async moderate(jobId, action) {
    const job = await Job.findById(jobId);
    if (!job) throw ApiError.notFound("Job not found");
    if (action === "approve") job.status = JOB_STATUS.ACTIVE;
    else if (action === "reject" || action === "remove")
      job.status = JOB_STATUS.ARCHIVED;
    job.flaggedReason = null;
    await job.save();
    return job;
  },
};
