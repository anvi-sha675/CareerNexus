import { CalendarClock, Video, MapPin, ExternalLink } from "lucide-react";
import PageHeader from "../../components/common/PageHeader";
import Card from "../../components/common/Card";
import Badge from "../../components/common/Badge";
import Button from "../../components/common/Button";
import EmptyState from "../../components/common/EmptyState";
import { CardSkeleton } from "../../components/common/Skeleton";
import { useAsync } from "../../hooks/useAsync";
import * as interviewsService from "../../services/interviewsService";
import { formatDate } from "../../utils/formatters";

export default function InterviewSchedule() {
  const { data: interviews, loading } = useAsync(
    interviewsService.getMyInterviews,
    [],
  );

  return (
    <div>
      <PageHeader
        title="Interview Schedule"
        description="Your upcoming interviews in one place."
        breadcrumbs={[{ label: "Interviews" }]}
      />

      {loading ? (
        <div className="grid gap-5 sm:grid-cols-2">
          {Array.from({ length: 2 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : !interviews?.length ? (
        <EmptyState
          icon={CalendarClock}
          title="No interviews scheduled"
          description="Interviews recruiters schedule with you will show up here."
        />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2">
          {interviews.map((iv) => (
            <Card key={iv.id}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold text-slate-800 dark:text-slate-100">
                    {iv.jobTitle}
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {iv.company}
                  </p>
                </div>
                <Badge
                  tone={iv.status === "Confirmed" ? "Approved" : "Pending"}
                >
                  {iv.status}
                </Badge>
              </div>

              <div className="mt-4 space-y-2 text-sm text-slate-600 dark:text-slate-300">
                <p className="flex items-center gap-2">
                  <CalendarClock className="h-4 w-4 text-primary-500" />
                  {formatDate(iv.date)} · {iv.time}
                </p>
                <p className="flex items-center gap-2">
                  {iv.mode === "Video Call" ? (
                    <Video className="h-4 w-4 text-primary-500" />
                  ) : (
                    <MapPin className="h-4 w-4 text-accent-600" />
                  )}
                  {iv.mode}
                </p>
                <p className="text-slate-500 dark:text-slate-400">
                  Interviewer: {iv.interviewer}
                </p>
              </div>

              {iv.notes && (
                <div className="mt-3 rounded-lg bg-slate-50 p-3 text-xs text-slate-500 dark:bg-slate-900/40 dark:text-slate-400">
                  {iv.notes}
                </div>
              )}

              <div className="mt-4 flex gap-2">
                {iv.mode === "Video Call" && iv.meetingLink && (
                  <a
                    href={iv.meetingLink}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1"
                  >
                    <Button size="sm" fullWidth icon={ExternalLink}>
                      Join meeting
                    </Button>
                  </a>
                )}
                <Button size="sm" variant="secondary">
                  Request reschedule
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
