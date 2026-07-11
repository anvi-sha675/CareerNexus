import api from "./api";
import { withFallback, wait } from "./helpers";
import { mockUsers } from "./mock/mockData";

export async function login({ email, role = "student" }) {
  return withFallback(
    () => api.post("/auth/login", { email }),
    {
      user: { ...mockUsers[role], email: email || mockUsers[role].email },
      token: `demo-token-${role}`,
    },
    600,
  );
}

export async function register({ name, email, role }) {
  return withFallback(
    () => api.post("/auth/register", { name, email, role }),
    { user: { ...mockUsers[role], name, email }, token: `demo-token-${role}` },
    700,
  );
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

export async function verifyEmail(_token) {
  await wait(900);
  return { verified: true };
}
