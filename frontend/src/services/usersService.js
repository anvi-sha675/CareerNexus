import api from "./api";
import { withFallback } from "./helpers";
import { mockUsersList, mockRecruiters } from "./mock/mockData";

function mapUser(u) {
  if (!u || !u._id) return u;
  return {
    id: u._id,
    name: u.name,
    email: u.email,
    role: u.role,
    status: u.status,
    joinedAt: u.createdAt,
  };
}

function mapRecruiter(r) {
  if (!r || !r._id) return r;
  return {
    id: r.user?._id || r._id,
    company: r.company?.name || "",
    contact: r.user?.name,
    email: r.user?.email,
    status: r.status
      ? r.status.charAt(0).toUpperCase() + r.status.slice(1)
      : r.status,
    jobsPosted: r.jobsPosted ?? 0,
    joinedAt: r.user?.createdAt || r.createdAt,
  };
}

export async function getUsers(params = {}) {
  const users = await withFallback(
    () => api.get("/admin/users", { params }),
    mockUsersList,
    500,
  );
  return Array.isArray(users) ? users.map(mapUser) : users;
}

export async function getRecruiters(params = {}) {
  const recruiters = await withFallback(
    () => api.get("/admin/recruiters", { params }),
    mockRecruiters,
    500,
  );
  return Array.isArray(recruiters) ? recruiters.map(mapRecruiter) : recruiters;
}

export async function updateUserStatus(id, status) {
  return withFallback(
    () => api.patch(`/admin/users/${id}/status`, { status }),
    { id, status },
    400,
  );
}

export async function updateRecruiterStatus(id, status) {
  const backendStatus = status.toLowerCase();
  return withFallback(
    () =>
      api.patch(`/admin/recruiters/${id}/status`, { status: backendStatus }),
    { id, status },
    400,
  );
}
