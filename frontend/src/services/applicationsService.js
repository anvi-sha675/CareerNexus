import api from "./api";
import { withFallback } from "./helpers";
import { mockApplications, mockApplicants } from "./mock/mockData";

export async function getMyApplications() {
  return withFallback(() => api.get("/applications/me"), mockApplications, 500);
}

export async function getApplicantsForJob(jobId) {
  return withFallback(
    () => api.get(`/jobs/${jobId}/applicants`),
    mockApplicants,
    500,
  );
}

export async function updateApplicationStatus(id, status) {
  return withFallback(
    () => api.patch(`/applications/${id}`, { status }),
    { id, status },
    400,
  );
}

export async function applyToJob(jobId) {
  return withFallback(
    () => api.post(`/jobs/${jobId}/apply`),
    { id: `a${Date.now()}`, jobId, status: "Applied" },
    600,
  );
}
