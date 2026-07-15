import api from "./api";
import { withFallback } from "./helpers";
import { mockInterviews, mockStudentInterviews } from "./mock/mockData";

export async function getInterviews() {
  return withFallback(() => api.get("/interviews"), mockInterviews, 500);
}

export async function getMyInterviews() {
  return withFallback(
    () => api.get("/interviews/me"),
    mockStudentInterviews,
    500,
  );
}

export async function scheduleInterview(payload) {
  return withFallback(
    () => api.post("/interviews", payload),
    { ...payload, id: `iv${Date.now()}` },
    500,
  );
}

export async function updateInterview(id, payload) {
  return withFallback(
    () => api.put(`/interviews/${id}`, payload),
    { ...payload, id },
    500,
  );
}

export async function cancelInterview(id) {
  return withFallback(
    () => api.delete(`/interviews/${id}`),
    { id, cancelled: true },
    400,
  );
}
