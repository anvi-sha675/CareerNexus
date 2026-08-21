import { Interview, Application, User } from "../models/index.js";
import { notificationService } from "./notificationService.js";
import { ApiError } from "../utils/ApiError.js";
import {
  APPLICATION_STATUS,
  INTERVIEW_STATUS,
  NOTIFICATION_CATEGORY,
} from "../constants/index.js";
import { emailService } from "./emailService.js";
import { emitToUser } from "../socket/index.js";

function interviewPayload(interview, extra = {}) {
  return {
    interviewId: interview._id,
    applicationId: interview.application,
    jobId: interview.job,
    scheduledDate: interview.scheduledDate,
    time: interview.time,
    status: interview.status,
    ...extra,
  };
}

export const interviewService = {
  async schedule(recruiterId, payload) {
    const application = await Application.findById(
      payload.applicationId,
    ).populate("job");
    if (!application) throw ApiError.notFound("Application not found");
    if (application.job.postedBy.toString() !== recruiterId.toString()) {
      throw ApiError.forbidden(
        "You don't have permission to schedule this interview",
      );
    }

    const interview = await Interview.create({
      application: application._id,
      job: application.job._id,
      student: application.student,
      recruiter: recruiterId,
      scheduledDate: payload.scheduledDate,
      time: payload.time,
      mode: payload.mode,
      meetingLink: payload.meetingLink,
      location: payload.location,
      interviewerName: payload.interviewerName,
      notes: payload.notes,
    });

    application.status = APPLICATION_STATUS.INTERVIEW;
    application.timeline.push({
      status: APPLICATION_STATUS.INTERVIEW,
      changedBy: recruiterId,
    });
    await application.save();

    const student = await User.findById(application.student);
    await notificationService.create({
      recipient: application.student,
      title: "Interview scheduled",
      message: `An interview for ${application.job.title} has been scheduled`,
      category: NOTIFICATION_CATEGORY.INTERVIEW,
      relatedEntity: { entityType: "Interview", entityId: interview._id },
    });
    emailService
      .sendInterviewInvitation(student, interview, application.job)
      .catch(() => {});

    emitToUser(
      application.student,
      "interview:scheduled",
      interviewPayload(interview, { jobTitle: application.job.title }),
    );

    return interview;
  },

  async reschedule(recruiterId, interviewId, { scheduledDate, time }) {
    const interview = await Interview.findOne({
      _id: interviewId,
      recruiter: recruiterId,
    });
    if (!interview) throw ApiError.notFound("Interview not found");

    interview.rescheduleHistory.push({
      previousDate: interview.scheduledDate,
      previousTime: interview.time,
    });
    interview.scheduledDate = scheduledDate;
    interview.time = time;
    interview.status = INTERVIEW_STATUS.RESCHEDULED;
    await interview.save();

    await notificationService.create({
      recipient: interview.student,
      title: "Interview rescheduled",
      message: `Your interview has been moved to ${new Date(scheduledDate).toDateString()} at ${time}`,
      category: NOTIFICATION_CATEGORY.INTERVIEW,
      relatedEntity: { entityType: "Interview", entityId: interview._id },
    });

    emitToUser(
      interview.student,
      "interview:rescheduled",
      interviewPayload(interview),
    );

    return interview;
  },

  async cancel(recruiterId, interviewId) {
    const interview = await Interview.findOneAndUpdate(
      { _id: interviewId, recruiter: recruiterId },
      { status: INTERVIEW_STATUS.CANCELLED },
      { new: true },
    );
    if (!interview) throw ApiError.notFound("Interview not found");

    await notificationService.create({
      recipient: interview.student,
      title: "Interview cancelled",
      message: "An interview on your schedule has been cancelled",
      category: NOTIFICATION_CATEGORY.INTERVIEW,
      relatedEntity: { entityType: "Interview", entityId: interview._id },
    });

    emitToUser(
      interview.student,
      "interview:cancelled",
      interviewPayload(interview),
    );

    return interview;
  },

  async listForRecruiter(recruiterId) {
    return Interview.find({
      recruiter: recruiterId,
      status: { $ne: INTERVIEW_STATUS.CANCELLED },
    })
      .populate("student", "name email")
      .populate("job", "title")
      .sort({ scheduledDate: 1 });
  },

  async listForStudent(studentId) {
    return Interview.find({
      student: studentId,
      status: { $ne: INTERVIEW_STATUS.CANCELLED },
    })
      .populate("job", "title")
      .populate({ path: "job", populate: { path: "company", select: "name" } })
      .sort({ scheduledDate: 1 });
  },
};
