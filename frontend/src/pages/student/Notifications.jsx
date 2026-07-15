import { useState } from "react";
import { CheckCheck, Bell } from "lucide-react";
import PageHeader from "../../components/common/PageHeader";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import EmptyState from "../../components/common/EmptyState";
import Spinner from "../../components/common/Spinner";
import NotificationItem from "../../components/notifications/NotificationItem";
import { useAsync } from "../../hooks/useAsync";
import * as notificationsService from "../../services/notificationsService";
import { useToast } from "../../context/ToastContext";

export default function Notifications() {
  const { data, loading, setData } = useAsync(
    notificationsService.getNotifications,
    [],
  );
  const [markingAll, setMarkingAll] = useState(false);
  const { showToast } = useToast();

  const markAllRead = async () => {
    setMarkingAll(true);
    await notificationsService.markAllAsRead();
    setData((prev) => prev.map((n) => ({ ...n, read: true })));
    setMarkingAll(false);
    showToast("All notifications marked as read.", { type: "success" });
  };

  const markOneRead = async (notification) => {
    if (notification.read) return;
    await notificationsService.markAsRead(notification.id);
    setData((prev) =>
      prev.map((n) => (n.id === notification.id ? { ...n, read: true } : n)),
    );
  };

  return (
    <div>
      <PageHeader
        title="Notifications"
        description="Stay on top of every update to your applications."
        breadcrumbs={[{ label: "Notifications" }]}
        actions={
          <Button
            variant="secondary"
            icon={CheckCheck}
            onClick={markAllRead}
            loading={markingAll}
          >
            Mark all as read
          </Button>
        }
      />

      <Card padding="p-2 sm:p-3">
        {loading ? (
          <Spinner />
        ) : data?.length ? (
          <div className="space-y-1">
            {data.map((n) => (
              <NotificationItem
                key={n.id}
                notification={n}
                onClick={markOneRead}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Bell}
            title="No notifications"
            description="You're all caught up for now."
          />
        )}
      </Card>
    </div>
  );
}
