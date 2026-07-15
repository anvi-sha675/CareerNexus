import api from "./api";
import { withFallback } from "./helpers";
import { mockJobs } from "./mock/mockData";

export async function getJobs(params = {}) {
  return withFallback(() => api.get("/jobs", { params }), mockJobs, 500);
}

export async function getJobById(id) {
  return withFallback(
    () => api.get(`/jobs/${id}`),
    mockJobs.find((j) => j.id === id) || null,
    400,
  );
}

export async function createJob(payload) {
  return withFallback(
    () => api.post("/jobs", payload),
    { ...payload, id: `j${Date.now()}`, status: "Active", applicants: 0 },
    600,
  );
}

export async function updateJob(id, payload) {
  return withFallback(
    () => api.put(`/jobs/${id}`, payload),
    { ...payload, id },
    500,
  );
}

export async function deleteJob(id) {
  return withFallback(
    () => api.delete(`/jobs/${id}`),
    { id, deleted: true },
    400,
  );
}
