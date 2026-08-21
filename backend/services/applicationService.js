import { Application, Job, User } from "../models/index.js";
import { notificationService } from "./notificationService.js";
import { ApiError } from "../utils/ApiError.js";
import { matchingService } from "./matchingService.js";
import { resumeService } from "./resumeService.js";
import { emailService } from "./emailService.js";
import { emitToUser } from "../socket/index.js";
import {
  APPLICATION_STATUS,
  NOTIFICATION_CATEGORY,
} from "../constants/index.js";
import { parsePagination, buildMeta } from "../utils/pagination.js";

export const applicationService = {
  async apply(studentId, jobId) {
    const job = await Job.findById(jobId);
    if (!job) throw ApiError.notFound("Job not found");
    if (job.status !== "active")
      throw ApiError.badRequest("This job is no longer accepting applications");

    const existing = await Application.findOne({
      job: jobId,
      student: studentId,
    });
    if (existing) throw ApiError.conflict("You've already applied to this job");

    const resume = await resumeService.getActiveResume(studentId);
    const { matchScore, matchBreakdown } =
      await matchingService.computeMatchForStudent(studentId, job);

    const application = await Application.create({
      job: jobId,
      student: studentId,
      resume: resume?._id || null,
      matchScore,
      matchBreakdown,
      timeline: [{ status: APPLICATION_STATUS.APPLIED, changedBy: studentId }],
    });

    job.applicantsCount += 1;
    await job.save();

    const student = await User.findById(studentId);
    await notificationService.create({
      recipient: job.postedBy,
      title: "New applicant",
      message: `${student.name} applied for ${job.title}`,
      category: NOTIFICATION_CATEGORY.APPLICATION,
      relatedEntity: { entityType: "Application", entityId: application._id },
    });

    emailService.sendApplicationConfirmation(student, job).catch(() => {});

    emitToUser(job.postedBy, "application:new", {
      applicationId: application._id,
      jobId: job._id,
      jobTitle: job.title,
      studentName: student.name,
      matchScore,
    });

    return application;
  },

  async withdraw(studentId, applicationId) {
    const application = await Application.findOne({
      _id: applicationId,
      student: studentId,
    });
    if (!application) throw ApiError.notFound("Application not found");
    if (["Offered", "Rejected"].includes(application.status)) {
      throw ApiError.badRequest("This application can no longer be withdrawn");
    }
    application.status = APPLICATION_STATUS.WITHDRAWN;
    application.withdrawnAt = new Date();
    application.timeline.push({
      status: APPLICATION_STATUS.WITHDRAWN,
      changedBy: studentId,
    });
    await application.save();
    return application;
  },

  async listForStudent(studentId, query) {
    const { page, limit, skip } = parsePagination(query);
    const filter = { student: studentId };
    if (query.status) filter.status = query.status;

    const [applications, total] = await Promise.all([
      Application.find(filter)
        .populate({
          path: "job",
          populate: { path: "company", select: "name logo" },
        })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Application.countDocuments(filter),
    ]);
    return { applications, meta: buildMeta({ page, limit, total }) };
  },

  async getForStudent(studentId, applicationId) {
    const application = await Application.findOne({
      _id: applicationId,
      student: studentId,
    }).populate({
      path: "job",
      populate: { path: "company", select: "name logo" },
    });
    if (!application) throw ApiError.notFound("Application not found");
    return application;
  },

  async listForJob(recruiterId, jobId, query) {
    const job = await Job.findOne({ _id: jobId, postedBy: recruiterId });
    if (!job) throw ApiError.notFound("Job not found");

    const { page, limit, skip } = parsePagination(query);
    const filter = { job: jobId };
    if (query.status) filter.status = query.status;

    const [applications, total] = await Promise.all([
      Application.find(filter)
        .populate("student", "name email avatar")
        .populate("resume", "fileName fileUrl")
        .sort({ matchScore: -1 })
        .skip(skip)
        .limit(limit),
      Application.countDocuments(filter),
    ]);
    return { applications, meta: buildMeta({ page, limit, total }) };
  },

  async listAllForRecruiter(recruiterId, query) {
    const jobs = await Job.find({ postedBy: recruiterId }).select("_id");
    const jobIds = jobs.map((j) => j._id);

    const { page, limit, skip } = parsePagination(query);
    const filter = { job: { $in: jobIds } };
    if (query.status) filter.status = query.status;

    const [applications, total] = await Promise.all([
      Application.find(filter)
        .populate("student", "name email avatar")
        .populate("job", "title")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Application.countDocuments(filter),
    ]);
    return { applications, meta: buildMeta({ page, limit, total }) };
  },

  async updateStatus(recruiterId, applicationId, status, note) {
    const application =
      await Application.findById(applicationId).populate("job");
    if (!application) throw ApiError.notFound("Application not found");
    if (application.job.postedBy.toString() !== recruiterId.toString()) {
      throw ApiError.forbidden(
        "You don't have permission to update this application",
      );
    }

    application.status = status;
    application.timeline.push({ status, note, changedBy: recruiterId });
    if (note) application.recruiterNotes = note;
    await application.save();

    const student = await User.findById(application.student);
    await notificationService.create({
      recipient: application.student,
      title: "Application update",
      message: `Your application for ${application.job.title} is now ${status}`,
      category: NOTIFICATION_CATEGORY.APPLICATION,
      relatedEntity: { entityType: "Application", entityId: application._id },
    });
    emailService
      .sendApplicationStatusUpdate(student, application.job, status)
      .catch(() => {});

    emitToUser(application.student, "application:updated", {
      applicationId: application._id,
      jobId: application.job._id,
      jobTitle: application.job.title,
      status: application.status,
      timeline: application.timeline,
    });
    emitToUser(recruiterId, "application:updated", {
      applicationId: application._id,
      jobId: application.job._id,
      status: application.status,
    });

    return application;
  },

  async getApplicantDetail(recruiterId, applicationId) {
    const application = await Application.findById(applicationId)
      .populate("student", "name email avatar phone")
      .populate("job")
      .populate("resume");
    if (!application) throw ApiError.notFound("Application not found");
    if (application.job.postedBy.toString() !== recruiterId.toString()) {
      throw ApiError.forbidden(
        "You don't have permission to view this application",
      );
    }
    return application;
  },
};
