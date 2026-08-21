import {
  studentService,
  skillsCrud,
  educationCrud,
  experienceCrud,
  projectsCrud,
  certificationsCrud,
} from "../services/studentService.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendSuccess } from "../utils/apiResponse.js";

export const getProfile = asyncHandler(async (req, res) => {
  const profile = await studentService.getProfile(req.user._id);
  sendSuccess(res, { data: profile });
});

export const updateProfile = asyncHandler(async (req, res) => {
  const profile = await studentService.updateProfile(req.user._id, req.body);
  sendSuccess(res, { message: "Profile updated", data: profile });
});

export const getDashboard = asyncHandler(async (req, res) => {
  const stats = await studentService.getDashboardStats(req.user._id);
  sendSuccess(res, { data: stats });
});

export const saveJob = asyncHandler(async (req, res) => {
  const saved = await studentService.saveJob(req.user._id, req.params.jobId);
  sendSuccess(res, { message: "Job saved", data: saved });
});

export const unsaveJob = asyncHandler(async (req, res) => {
  await studentService.unsaveJob(req.user._id, req.params.jobId);
  sendSuccess(res, { message: "Job removed from saved" });
});

export const listSavedJobs = asyncHandler(async (req, res) => {
  const jobs = await studentService.listSavedJobs(req.user._id);
  sendSuccess(res, { data: jobs });
});

function sectionControllers(crud, label) {
  return {
    list: asyncHandler(async (req, res) =>
      sendSuccess(res, { data: await crud.list(req.user._id) }),
    ),
    create: asyncHandler(async (req, res) =>
      sendSuccess(res, {
        statusCode: 201,
        message: `${label} added`,
        data: await crud.create(req.user._id, req.body),
      }),
    ),
    update: asyncHandler(async (req, res) =>
      sendSuccess(res, {
        message: `${label} updated`,
        data: await crud.update(req.user._id, req.params.id, req.body),
      }),
    ),
    remove: asyncHandler(async (req, res) => {
      await crud.remove(req.user._id, req.params.id);
      sendSuccess(res, { message: `${label} removed` });
    }),
  };
}

export const skillsController = sectionControllers(skillsCrud, "Skill");
export const educationController = sectionControllers(
  educationCrud,
  "Education entry",
);
export const experienceController = sectionControllers(
  experienceCrud,
  "Experience entry",
);
export const projectsController = sectionControllers(projectsCrud, "Project");
export const certificationsController = sectionControllers(
  certificationsCrud,
  "Certification",
);
