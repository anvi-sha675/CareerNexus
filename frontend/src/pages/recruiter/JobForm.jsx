import { useForm } from "react-hook-form";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Save } from "lucide-react";
import PageHeader from "../../components/common/PageHeader";
import Card from "../../components/common/Card";
import TextField from "../../components/forms/TextField";
import SelectField from "../../components/forms/SelectField";
import TextareaField from "../../components/forms/TextareaField";
import Button from "../../components/common/Button";
import { JOB_TYPES, EXPERIENCE_LEVELS } from "../../utils/constants";
import { useToast } from "../../context/ToastContext";

export default function JobForm({
  mode = "create",
  defaultValues,
  onSubmitJob,
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: defaultValues || {
      title: "",
      location: "",
      type: "Full-time",
      experience: "Entry Level",
      salaryMin: "",
      salaryMax: "",
      remote: false,
      description: "",
      tags: "",
    },
  });
  const [saving, setSaving] = useState(false);
  const { showToast } = useToast();
  const navigate = useNavigate();

  const onSubmit = async (values) => {
    setSaving(true);
    await onSubmitJob({
      ...values,
      tags: values.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    });
    setSaving(false);
    showToast(
      mode === "create"
        ? "Job posted successfully."
        : "Job updated successfully.",
      { type: "success" },
    );
    navigate("/recruiter/dashboard");
  };

  return (
    <div>
      <PageHeader
        title={mode === "create" ? "Post a New Job" : "Edit Job"}
        description={
          mode === "create"
            ? "Fill in the details to publish a new role."
            : "Update the details of this listing."
        }
        breadcrumbs={[
          { label: "Dashboard", to: "/recruiter/dashboard" },
          { label: mode === "create" ? "Post a Job" : "Edit Job" },
        ]}
      />
      <Card>
        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="space-y-5"
        >
          <TextField
            label="Job title"
            required
            error={errors.title?.message}
            {...register("title", { required: "Job title is required" })}
          />
          <div className="grid gap-5 sm:grid-cols-2">
            <TextField
              label="Location"
              required
              error={errors.location?.message}
              {...register("location", { required: "Location is required" })}
            />
            <SelectField
              label="Job type"
              options={JOB_TYPES}
              {...register("type")}
            />
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <SelectField
              label="Experience level"
              options={EXPERIENCE_LEVELS}
              {...register("experience")}
            />
            <TextField
              label="Tags (comma separated)"
              placeholder="React, Node.js, MongoDB"
              {...register("tags")}
            />
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <TextField
              label="Minimum salary (₹/yr)"
              type="number"
              required
              error={errors.salaryMin?.message}
              {...register("salaryMin", { required: "Required" })}
            />
            <TextField
              label="Maximum salary (₹/yr)"
              type="number"
              required
              error={errors.salaryMax?.message}
              {...register("salaryMax", { required: "Required" })}
            />
          </div>
          <TextareaField
            label="Job description"
            rows={6}
            required
            error={errors.description?.message}
            {...register("description", {
              required: "Description is required",
              minLength: { value: 30, message: "Please add more detail" },
            })}
          />
          <div className="flex gap-3">
            <Button type="submit" icon={Save} loading={saving}>
              {mode === "create" ? "Publish job" : "Save changes"}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate(-1)}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
