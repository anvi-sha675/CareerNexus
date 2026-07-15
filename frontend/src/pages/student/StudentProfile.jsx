import { Link } from "react-router-dom";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Plus, X, Save, ArrowRight } from "lucide-react";
import PageHeader from "../../components/common/PageHeader";
import Card from "../../components/common/Card";
import Avatar from "../../components/common/Avatar";
import TextField from "../../components/forms/TextField";
import TextareaField from "../../components/forms/TextareaField";
import Button from "../../components/common/Button";
import Badge from "../../components/common/Badge";
import ProfileCompletionWidget from "../../components/profile/ProfileCompletionWidget";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";

export default function StudentProfile() {
  const { user, updateProfile } = useAuth();
  const { showToast } = useToast();
  const [skills, setSkills] = useState([
    "React",
    "Node.js",
    "Python",
    "MongoDB",
    "Tailwind CSS",
  ]);
  const [skillInput, setSkillInput] = useState("");
  const [saving, setSaving] = useState(false);

  const { register, handleSubmit } = useForm({
    defaultValues: {
      name: user?.name || "",
      headline: user?.headline || "",
      college: user?.college || "",
      bio: "Aspiring full-stack developer passionate about building AI-powered products that solve real problems.",
    },
  });

  const addSkill = () => {
    const value = skillInput.trim();
    if (value && !skills.includes(value)) setSkills([...skills, value]);
    setSkillInput("");
  };

  const onSubmit = async (values) => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 700));
    updateProfile(values);
    setSaving(false);
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
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <TextField label="Full name" {...register("name")} />
                <TextField
                  label="College / University"
                  {...register("college")}
                />
              </div>
              <TextField
                label="Headline"
                {...register("headline")}
                placeholder="e.g. Final Year CS Student"
              />
              <TextareaField label="Bio" rows={4} {...register("bio")} />
              <Button type="submit" icon={Save} loading={saving}>
                Save changes
              </Button>
            </form>
          </Card>

          <Card>
            <h3 className="mb-4 text-sm font-semibold text-slate-800 dark:text-slate-100">
              Skills
            </h3>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1.5 rounded-full bg-primary-50 px-3 py-1.5 text-xs font-medium text-primary-700 dark:bg-primary-500/10 dark:text-primary-400"
                >
                  {skill}
                  <button
                    onClick={() => setSkills(skills.filter((s) => s !== skill))}
                    aria-label={`Remove ${skill}`}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="mt-4 flex gap-2">
              <TextField
                placeholder="Add a skill..."
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && (e.preventDefault(), addSkill())
                }
                className="flex-1"
              />
              <Button
                variant="secondary"
                icon={Plus}
                onClick={addSkill}
                type="button"
              >
                Add
              </Button>
            </div>
          </Card>

          <Card>
            <h3 className="mb-4 text-sm font-semibold text-slate-800 dark:text-slate-100">
              Projects
            </h3>
            <div className="space-y-4">
              {[
                { title: "Advisory", desc: "Full-stack app" },
                { title: "System", desc: "App" },
              ].map((p) => (
                <div
                  key={p.title}
                  className="rounded-xl border border-slate-100 p-4 dark:border-slate-700"
                >
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                    {p.title}
                  </p>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    {p.desc}
                  </p>
                </div>
              ))}
            </div>
            <Button variant="ghost" size="sm" icon={Plus} className="mt-3">
              Add project
            </Button>
          </Card>
        </div>

        <div className="space-y-6">
          <ProfileCompletionWidget
            percentage={user?.profileCompletion || 78}
            tasks={["Add a certification", "Verify phone number"]}
          />
          <Card>
            <h3 className="mb-3 text-sm font-semibold text-slate-800 dark:text-slate-100">
              Preferences
            </h3>
            <div className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
              <p className="flex justify-between">
                <span>Job type</span> <Badge>Full-time</Badge>
              </p>
              <p className="flex justify-between">
                <span>Work mode</span> <Badge tone="Active">Remote</Badge>
              </p>
              <p className="flex justify-between">
                <span>Experience</span>{" "}
                <span className="text-slate-400">Entry Level</span>
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
