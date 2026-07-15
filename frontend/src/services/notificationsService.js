import api from "./api";
import { withFallback } from "./helpers";
import { mockNotifications } from "./mock/mockData";

export async function getNotifications() {
  return withFallback(() => api.get("/notifications"), mockNotifications, 400);
}

export async function markAsRead(id) {
  return withFallback(
    () => api.patch(`/notifications/${id}/read`),
    { id, read: true },
    200,
  );
}

export async function markAllAsRead() {
  return withFallback(
    () => api.patch("/notifications/read-all"),
    { success: true },
    300,
  );
}
