import api from "./api";
import { withFallback } from "./helpers";
import {
  mockSkills,
  mockEducation,
  mockExperience,
  mockProjects,
  mockCertifications,
  mockJobs,
} from "./mock/mockData";
import { mapJob } from "./jobsService";

const mockSavedJobs = mockJobs.filter((j) => ["j1", "j3", "j8"].includes(j.id));

const mapId = (doc) => (doc && doc._id ? { ...doc, id: doc._id } : doc);
const mapList = (docs) => (Array.isArray(docs) ? docs.map(mapId) : docs);

export async function getProfile() {
  const profile = await withFallback(
    () => api.get("/student/profile"),
    null,
    400,
  );
  return mapId(profile);
}

export async function updateProfile(payload) {
  const profile = await withFallback(
    () => api.patch("/student/profile", payload),
    payload,
    500,
  );
  return mapId(profile);
}

function makeSectionClient(resource, mockData) {
  return {
    list: async () =>
      mapList(
        await withFallback(
          () => api.get(`/student/${resource}`),
          mockData,
          400,
        ),
      ),
    create: async (payload) =>
      mapId(
        await withFallback(
          () => api.post(`/student/${resource}`, payload),
          { ...payload, id: `local-${Date.now()}` },
          400,
        ),
      ),
    update: async (id, payload) =>
      mapId(
        await withFallback(
          () => api.patch(`/student/${resource}/${id}`, payload),
          { ...payload, id },
          400,
        ),
      ),
    remove: async (id) =>
      withFallback(
        () => api.delete(`/student/${resource}/${id}`),
        { deleted: true },
        300,
      ),
  };
}

export const skillsService = makeSectionClient("skills", mockSkills);
export const educationService = makeSectionClient("education", mockEducation);
export const experienceService = makeSectionClient(
  "experience",
  mockExperience,
);
export const projectsService = makeSectionClient("projects", mockProjects);
export const certificationsService = makeSectionClient(
  "certifications",
  mockCertifications,
);

export async function listSavedJobs() {
  const jobs = await withFallback(
    () => api.get("/student/saved-jobs"),
    mockSavedJobs,
    400,
  );
  return Array.isArray(jobs) ? jobs.map(mapJob) : jobs;
}

export async function saveJob(jobId) {
  return withFallback(
    () => api.post(`/student/saved-jobs/${jobId}`),
    { saved: true },
    300,
  );
}

export async function unsaveJob(jobId) {
  return withFallback(
    () => api.delete(`/student/saved-jobs/${jobId}`),
    { removed: true },
    300,
  );
}
