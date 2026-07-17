import api from "./api";
import { withFallback } from "./helpers";
import { mockInterviews, mockStudentInterviews } from "./mock/mockData";

function mapRecruiterInterview(iv) {
  if (!iv || !iv._id) return iv;
  return {
    id: iv._id,
    candidate: iv.student?.name,
    jobTitle: iv.job?.title,
    date: iv.scheduledDate,
    time: iv.time,
    mode: iv.mode,
    interviewer: iv.interviewerName,
    status: iv.status,
  };
}

function mapStudentInterview(iv) {
  if (!iv || !iv._id) return iv;
  return {
    id: iv._id,
    jobTitle: iv.job?.title,
    company: iv.job?.company?.name,
    date: iv.scheduledDate,
    time: iv.time,
    mode: iv.mode,
    interviewer: iv.interviewerName,
    meetingLink: iv.meetingLink,
    status: iv.status,
    notes: iv.notes,
  };
}

export async function getInterviews() {
  const interviews = await withFallback(
    () => api.get("/recruiter/interviews"),
    mockInterviews,
    500,
  );
  return Array.isArray(interviews)
    ? interviews.map(mapRecruiterInterview)
    : interviews;
}

export async function getMyInterviews() {
  const interviews = await withFallback(
    () => api.get("/student/interviews"),
    mockStudentInterviews,
    500,
  );
  return Array.isArray(interviews)
    ? interviews.map(mapStudentInterview)
    : interviews;
}

export async function scheduleInterview(payload) {
  const body = {
    applicationId: payload.applicationId,
    scheduledDate: payload.date,
    time: payload.time,
    mode: payload.mode,
    interviewerName: payload.interviewer,
    meetingLink: payload.meetingLink,
    notes: payload.notes,
  };
  const interview = await withFallback(
    () => api.post("/recruiter/interviews", body),
    { ...payload, id: `iv${Date.now()}` },
    500,
  );
  return mapRecruiterInterview(interview) || interview;
}

export async function updateInterview(id, payload) {
  const body = { scheduledDate: payload.date, time: payload.time };
  const interview = await withFallback(
    () => api.patch(`/recruiter/interviews/${id}/reschedule`, body),
    { ...payload, id },
    500,
  );
  return mapRecruiterInterview(interview) || interview;
}

export async function cancelInterview(id) {
  return withFallback(
    () => api.patch(`/recruiter/interviews/${id}/cancel`),
    { id, cancelled: true },
    400,
  );
}
