import api from "./api";
import { withFallback } from "./helpers";
import { mockJobs } from "./mock/mockData";

export function mapJob(job) {
  if (!job || !job._id) return job; // already flat mock data, or null
  const companyName = job.company?.name || "";
  return {
    id: job._id,
    title: job.title,
    company: companyName,
    logo:
      companyName
        .split(" ")
        .map((w) => w[0])
        .slice(0, 2)
        .join("")
        .toUpperCase() || "CO",
    location: job.location,
    type: job.type,
    remote: job.remote,
    salaryMin: job.salaryMin,
    salaryMax: job.salaryMax,
    experience: job.experience,
    postedAt: job.createdAt,
    tags: job.tags || [],
    matchScore: job.matchScore ?? undefined,
    matchBreakdown: job.matchBreakdown,
    applicants: job.applicantsCount ?? 0,
    status: job.status
      ? job.status.charAt(0).toUpperCase() + job.status.slice(1)
      : job.status,
    description: job.description,
    requirements: job.requirements,
    benefits: job.benefits,
  };
}

export async function getJobs(params = {}) {
  const jobs = await withFallback(
    () => api.get("/jobs", { params }),
    mockJobs,
    500,
  );
  return Array.isArray(jobs) ? jobs.map(mapJob) : jobs;
}

export async function getJobById(id) {
  const job = await withFallback(
    () => api.get(`/jobs/${id}`),
    mockJobs.find((j) => j.id === id) || null,
    400,
  );
  return mapJob(job);
}

export async function createJob(payload) {
  const job = await withFallback(
    () => api.post("/jobs", payload),
    { ...payload, id: `j${Date.now()}`, status: "Active", applicants: 0 },
    600,
  );
  return mapJob(job);
}

export async function updateJob(id, payload) {
  const job = await withFallback(
    () => api.patch(`/jobs/${id}`, payload),
    { ...payload, id },
    500,
  );
  return mapJob(job);
}

export async function deleteJob(id) {
  return withFallback(
    () => api.delete(`/jobs/${id}`),
    { id, deleted: true },
    400,
  );
}
