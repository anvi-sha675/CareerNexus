import api from "./api";
import { withFallback } from "./helpers";
import { mockApplications, mockApplicants } from "./mock/mockData";

function mapApplication(app) {
  if (!app || !app._id) return app;
  return {
    id: app._id,
    jobId: app.job?._id || app.job,
    jobTitle: app.job?.title,
    company: app.job?.company?.name,
    appliedAt: app.createdAt,
    status: app.status,
    matchScore: app.matchScore,
    matchBreakdown: app.matchBreakdown,
    recruiterNotes: app.recruiterNotes,
    timeline: app.timeline,
  };
}

function mapApplicant(app) {
  if (!app || !app._id) return app;
  return {
    id: app._id,
    name: app.student?.name,
    email: app.student?.email,
    jobTitle: app.job?.title,
    appliedAt: app.createdAt,
    status: app.status,
    matchScore: app.matchScore,
    resumeUrl: app.resume?.fileUrl,
  };
}

export async function getMyApplications() {
  const applications = await withFallback(
    () => api.get("/applications"),
    mockApplications,
    500,
  );
  return Array.isArray(applications)
    ? applications.map(mapApplication)
    : applications;
}

export async function getApplicantsForJob(jobId) {
  const applicants = await withFallback(
    () => api.get(`/jobs/${jobId}/applicants`),
    mockApplicants,
    500,
  );
  return Array.isArray(applicants) ? applicants.map(mapApplicant) : applicants;
}

export async function updateApplicationStatus(id, status) {
  return withFallback(
    () => api.patch(`/recruiter/applicants/${id}/status`, { status }),
    { id, status },
    400,
  );
}

export async function applyToJob(jobId) {
  const application = await withFallback(
    () => api.post(`/jobs/${jobId}/apply`),
    { id: `a${Date.now()}`, jobId, status: "Applied" },
    600,
  );
  return mapApplication(application);
}
