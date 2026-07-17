import { Link } from "react-router-dom";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Save, ArrowRight } from "lucide-react";
import PageHeader from "../../components/common/PageHeader";
import Card from "../../components/common/Card";
import Avatar from "../../components/common/Avatar";
import TextField from "../../components/forms/TextField";
import TextareaField from "../../components/forms/TextareaField";
import Button from "../../components/common/Button";
import Badge from "../../components/common/Badge";
import Spinner from "../../components/common/Spinner";
import ProfileCompletionWidget from "../../components/profile/ProfileCompletionWidget";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { useAsync } from "../../hooks/useAsync";
import * as studentProfileService from "../../services/studentProfileService";
import {
  skillsService,
  projectsService,
} from "../../services/studentProfileService";

export default function StudentProfile() {
  const { user, updateProfile: updateLocalUser } = useAuth();
  const { showToast } = useToast();

  const { data: profile, loading: profileLoading } = useAsync(
    studentProfileService.getProfile,
    [],
  );
  const { data: skills, loading: skillsLoading } = useAsync(
    skillsService.list,
    [],
  );
  const { data: projects, loading: projectsLoading } = useAsync(
    projectsService.list,
    [],
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: { headline: "", college: "", bio: "", location: "" },
  });

  useEffect(() => {
    if (profile) {
      reset({
        headline: profile.headline || "",
        college: profile.college || "",
        bio: profile.bio || "",
        location: profile.location || "",
      });
    }
  }, [profile, reset]);

  const onSubmit = async (values) => {
    await studentProfileService.updateProfile(values);
    updateLocalUser({ headline: values.headline });
    showToast("Profile updated successfully.", { type: "success" });
  };

  return (
    <div>
      <PageHeader
        title="My Profile"
        description="Keep your profile current to get better job matches."
        breadcrumbs={[{ label: "Profile" }]}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card className="flex items-center gap-4">
            <Avatar name={user?.name} size="xl" />
            <div>
              <Button size="sm" variant="secondary">
                Upload photo
              </Button>
              <p className="mt-2 text-xs text-slate-400">
                JPG or PNG, up to 2MB
              </p>
            </div>
          </Card>

          <Card>
            <h3 className="mb-4 text-sm font-semibold text-slate-800 dark:text-slate-100">
              Manage in detail
            </h3>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {[
                { to: "/student/skills", label: "Skills" },
                { to: "/student/education", label: "Education" },
                { to: "/student/experience", label: "Experience" },
                { to: "/student/projects", label: "Projects" },
                { to: "/student/certifications", label: "Certifications" },
              ].map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className="flex items-center justify-between rounded-xl border border-slate-100 px-3.5 py-2.5 text-sm font-medium text-slate-700 hover:border-primary-300 hover:text-primary-600 dark:border-slate-700 dark:text-slate-200"
                >
                  {item.label}
                  <ArrowRight className="h-3.5 w-3.5 text-slate-300" />
                </Link>
              ))}
            </div>
          </Card>

          <Card>
            <h3 className="mb-4 text-sm font-semibold text-slate-800 dark:text-slate-100">
              Basic information
            </h3>
            {profileLoading ? (
              <Spinner />
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <TextField
                    label="College / University"
                    {...register("college")}
                  />
                  <TextField
                    label="Location"
                    {...register("location")}
                    placeholder="e.g. Jaipur, India"
                  />
                </div>
                <TextField
                  label="Headline"
                  {...register("headline")}
                  placeholder="e.g. Final Year CS Student"
                />
                <TextareaField label="Bio" rows={4} {...register("bio")} />
                <Button type="submit" icon={Save} loading={isSubmitting}>
                  Save changes
                </Button>
              </form>
            )}
          </Card>

          <Card>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                Skills
              </h3>
              <Link
                to="/student/skills"
                className="text-xs font-medium text-primary-600 hover:underline"
              >
                Manage
              </Link>
            </div>
            {skillsLoading ? (
              <Spinner />
            ) : skills?.length ? (
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <span
                    key={skill.id}
                    className="inline-flex items-center gap-1.5 rounded-full bg-primary-50 px-3 py-1.5 text-xs font-medium text-primary-700 dark:bg-primary-500/10 dark:text-primary-400"
                  >
                    {skill.name}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-400">
                No skills added yet —{" "}
                <Link
                  to="/student/skills"
                  className="text-primary-600 hover:underline"
                >
                  add some
                </Link>
                .
              </p>
            )}
          </Card>

          <Card>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                Projects
              </h3>
              <Link
                to="/student/projects"
                className="text-xs font-medium text-primary-600 hover:underline"
              >
                Manage
              </Link>
            </div>
            {projectsLoading ? (
              <Spinner />
            ) : projects?.length ? (
              <div className="space-y-4">
                {projects.map((p) => (
                  <div
                    key={p.id}
                    className="rounded-xl border border-slate-100 p-4 dark:border-slate-700"
                  >
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                      {p.title}
                    </p>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                      {p.description}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-400">
                No projects added yet —{" "}
                <Link
                  to="/student/projects"
                  className="text-primary-600 hover:underline"
                >
                  add one
                </Link>
                .
              </p>
            )}
          </Card>
        </div>

        <div className="space-y-6">
          <ProfileCompletionWidget
            percentage={
              profile?.profileCompletion ?? user?.profileCompletion ?? 0
            }
            tasks={["Add a certification", "Verify phone number"]}
          />
          <Card>
            <h3 className="mb-3 text-sm font-semibold text-slate-800 dark:text-slate-100">
              Preferences
            </h3>
            <div className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
              <p className="flex justify-between">
                <span>Job type</span>{" "}
                <Badge>{profile?.preferredJobType || "Full-time"}</Badge>
              </p>
              <p className="flex justify-between">
                <span>Work mode</span>{" "}
                <Badge tone="Active">
                  {profile?.preferredWorkMode || "Remote"}
                </Badge>
              </p>
              <p className="flex justify-between">
                <span>Availability</span>{" "}
                <span className="text-slate-400">
                  {profile?.availability || "Immediately"}
                </span>
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
