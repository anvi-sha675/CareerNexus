import api from "./api";
import { withFallback } from "./helpers";
import { mockUsers } from "./mock/mockData";

function normalizeAuthResult(result) {
  if (!result) return result;
  const token = result.token || result.accessToken;
  return { user: result.user, token, refreshToken: result.refreshToken };
}

export async function login({ email, password, role = "student" }) {
  const result = await withFallback(
    () => api.post("/auth/login", { email, password }),
    {
      user: { ...mockUsers[role], email: email || mockUsers[role].email },
      token: `demo-token-${role}`,
    },
    600,
  );
  return normalizeAuthResult(result);
}

export async function register({ name, email, password, role }) {
  const result = await withFallback(
    () => api.post("/auth/register", { name, email, password, role }),
    { user: { ...mockUsers[role], name, email }, token: `demo-token-${role}` },
    700,
  );
  return normalizeAuthResult(result);
}

export async function forgotPassword(email) {
  return withFallback(
    () => api.post("/auth/forgot-password", { email }),
    { message: "Reset link sent." },
    600,
  );
}

export async function resetPassword({ token, password }) {
  return withFallback(
    () => api.post("/auth/reset-password", { token, password }),
    { message: "Password reset." },
    600,
  );
}

export async function verifyEmail(token) {
  return withFallback(
    () => api.post("/auth/verify-email", { token }),
    { verified: true },
    900,
  );
}
