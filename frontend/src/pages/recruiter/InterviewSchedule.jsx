import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  CalendarClock,
  Plus,
  Video,
  MapPin,
  Pencil,
  XCircle,
} from "lucide-react";
import PageHeader from "../../components/common/PageHeader";
import Card from "../../components/common/Card";
import Table from "../../components/common/Table";
import Modal from "../../components/common/Modal";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import TextField from "../../components/forms/TextField";
import SelectField from "../../components/forms/SelectField";
import Button from "../../components/common/Button";
import { useAsync } from "../../hooks/useAsync";
import * as interviewsService from "../../services/interviewsService";
import { formatDate } from "../../utils/formatters";
import { useToast } from "../../context/ToastContext";

export default function InterviewSchedule() {
  const {
    data: interviews,
    loading,
    setData,
  } = useAsync(interviewsService.getInterviews, []);
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [cancelTarget, setCancelTarget] = useState(null);
  const { register, handleSubmit, reset } = useForm();
  const { showToast } = useToast();
  const [saving, setSaving] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  const openCreate = () => {
    setEditTarget(null);
    reset({
      candidate: "",
      jobTitle: "",
      date: "",
      time: "",
      mode: "Video Call",
      interviewer: "",
    });
    setModalOpen(true);
  };

  const openEdit = (interview) => {
    setEditTarget(interview);
    reset(interview);
    setModalOpen(true);
  };

  const onSubmit = async (values) => {
    setSaving(true);
    if (editTarget) {
      const updated = await interviewsService.updateInterview(
        editTarget.id,
        values,
      );
      setData((prev) =>
        prev.map((iv) =>
          iv.id === editTarget.id ? { ...iv, ...updated } : iv,
        ),
      );
      showToast("Interview rescheduled.", { type: "success" });
    } else {
      const created = await interviewsService.scheduleInterview(values);
      setData((prev) => [created, ...(prev || [])]);
      showToast("Interview scheduled.", { type: "success" });
    }
    setSaving(false);
    setModalOpen(false);
    reset();
  };

  const confirmCancel = async () => {
    setCancelling(true);
    await interviewsService.cancelInterview(cancelTarget.id);
    setData((prev) => prev.filter((iv) => iv.id !== cancelTarget.id));
    setCancelling(false);
    setCancelTarget(null);
    showToast("Interview cancelled.", { type: "warning" });
  };

  const columns = [
    {
      key: "candidate",
      header: "Candidate",
      render: (row) => (
        <span className="font-medium text-slate-800 dark:text-slate-100">
          {row.candidate}
        </span>
      ),
    },
    { key: "jobTitle", header: "Role" },
    { key: "date", header: "Date", render: (row) => formatDate(row.date) },
    { key: "time", header: "Time" },
    {
      key: "mode",
      header: "Mode",
      render: (row) => (
        <span className="inline-flex items-center gap-1.5">
          {row.mode === "Video Call" ? (
            <Video className="h-3.5 w-3.5 text-primary-500" />
          ) : (
            <MapPin className="h-3.5 w-3.5 text-accent-600" />
          )}
          {row.mode}
        </span>
      ),
    },
    { key: "interviewer", header: "Interviewer" },
    {
      key: "actions",
      header: "",
      render: (row) => (
        <div className="flex gap-1">
          <Button
            size="sm"
            variant="ghost"
            icon={Pencil}
            aria-label="Reschedule interview"
            onClick={() => openEdit(row)}
          >
            Reschedule
          </Button>
          <Button
            size="sm"
            variant="ghost"
            icon={XCircle}
            className="text-error!"
            aria-label="Cancel interview"
            onClick={() => setCancelTarget(row)}
          />
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Interview Schedule"
        description="Coordinate upcoming interviews with candidates."
        actions={
          <Button icon={Plus} onClick={openCreate}>
            Schedule interview
          </Button>
        }
      />

      <Card padding="p-2 sm:p-4">
        <Table
          columns={columns}
          rows={interviews}
          loading={loading}
          emptyProps={{
            icon: CalendarClock,
            title: "No interviews scheduled",
            actionLabel: "Schedule one",
            onAction: openCreate,
          }}
        />
      </Card>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editTarget ? "Reschedule interview" : "Schedule an interview"}
        footer={
          <>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit(onSubmit)} loading={saving}>
              {editTarget ? "Save changes" : "Schedule"}
            </Button>
          </>
        }
      >
        <form className="space-y-4">
          <TextField
            label="Candidate name"
            required
            {...register("candidate", { required: true })}
          />
          <TextField
            label="Role"
            required
            {...register("jobTitle", { required: true })}
          />
          <div className="grid grid-cols-2 gap-4">
            <TextField
              label="Date"
              type="date"
              required
              {...register("date", { required: true })}
            />
            <TextField
              label="Time"
              type="time"
              required
              {...register("time", { required: true })}
            />
          </div>
          <SelectField
            label="Mode"
            options={["Video Call", "On-site", "Phone Call"]}
            {...register("mode")}
          />
          <TextField
            label="Interviewer"
            required
            {...register("interviewer", { required: true })}
          />
        </form>
      </Modal>

      <ConfirmDialog
        open={!!cancelTarget}
        onClose={() => setCancelTarget(null)}
        onConfirm={confirmCancel}
        loading={cancelling}
        title="Cancel this interview?"
        description={`This will cancel the interview with ${cancelTarget?.candidate} and notify them.`}
        confirmLabel="Cancel interview"
      />
    </div>
  );
}
