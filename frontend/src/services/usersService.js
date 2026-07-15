import api from "./api";
import { withFallback } from "./helpers";
import { mockUsersList, mockRecruiters } from "./mock/mockData";

export async function getUsers(params = {}) {
  return withFallback(
    () => api.get("/admin/users", { params }),
    mockUsersList,
    500,
  );
}

export async function getRecruiters(params = {}) {
  return withFallback(
    () => api.get("/admin/recruiters", { params }),
    mockRecruiters,
    500,
  );
}

export async function updateUserStatus(id, status) {
  return withFallback(
    () => api.patch(`/admin/users/${id}`, { status }),
    { id, status },
    400,
  );
}

export async function updateRecruiterStatus(id, status) {
  return withFallback(
    () => api.patch(`/admin/recruiters/${id}`, { status }),
    { id, status },
    400,
  );
}
