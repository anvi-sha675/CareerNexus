import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Camera,
  Globe,
  MapPin,
  Users,
  ShieldCheck,
  Save,
  Image as ImageIcon,
  X,
  Plus,
} from "lucide-react";
import PageHeader from "../../components/common/PageHeader";
import Card from "../../components/common/Card";
import TextField from "../../components/forms/TextField";
import SelectField from "../../components/forms/SelectField";
import TextareaField from "../../components/forms/TextareaField";
import Button from "../../components/common/Button";
import Badge from "../../components/common/Badge";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";

const INDUSTRIES = [
  "Software / SaaS",
  "Fintech",
  "Agritech",
  "E-commerce",
  "Healthcare",
  "Education",
];
const SIZES = ["1-10", "11-50", "51-200", "201-500", "500+"];
const GALLERY_PLACEHOLDER_COUNT = 4;

export default function CompanyProfile() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [saving, setSaving] = useState(false);
  const [coverFile, setCoverFile] = useState(null);
  const [gallery, setGallery] = useState(
    Array.from({ length: GALLERY_PLACEHOLDER_COUNT }, (_, i) => ({
      id: `g${i}`,
      label: `Office photo ${i + 1}`,
    })),
  );
  const [benefits, setBenefits] = useState([
    "Health insurance",
    "Remote-friendly",
    "Learning stipend",
    "Flexible hours",
  ]);
  const [benefitInput, setBenefitInput] = useState("");

  const { register, handleSubmit } = useForm({
    defaultValues: {
      name: user?.company || "TechFlow Systems",
      industry: "Software / SaaS",
      size: "51-200",
      website: "https://techflowsystems.com",
      location: "Bengaluru, India",
      about:
        "TechFlow Systems builds developer productivity tools used by thousands of engineering teams worldwide.",
    },
  });

  const onSubmit = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 700));
    setSaving(false);
    showToast("Company profile updated.", { type: "success" });
  };

  const addBenefit = () => {
    const value = benefitInput.trim();
    if (value && !benefits.includes(value)) setBenefits([...benefits, value]);
    setBenefitInput("");
  };

  const removeGalleryImage = (id) =>
    setGallery((prev) => prev.filter((g) => g.id !== id));
  const addGalleryImage = () =>
    setGallery((prev) => [
      ...prev,
      { id: `g${Date.now()}`, label: `Office photo ${prev.length + 1}` },
    ]);

  return (
    <div>
      <PageHeader
        title="Company Profile"
        description="This is what candidates see when they view your jobs."
        breadcrumbs={[{ label: "Company Profile" }]}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card padding="p-0" className="overflow-hidden">
            <div className="relative h-36 bg-linear-to-r from-primary-500 to-accent">
              {coverFile && (
                <img
                  src={URL.createObjectURL(coverFile)}
                  alt="Cover"
                  className="h-full w-full object-cover"
                />
              )}
              <label className="absolute bottom-3 right-3 flex cursor-pointer items-center gap-1.5 rounded-lg bg-white/90 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-white">
                <Camera className="h-3.5 w-3.5" /> Change cover
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => setCoverFile(e.target.files?.[0] || null)}
                />
              </label>
            </div>
            <div className="-mt-10 flex items-end gap-4 p-5 pt-0">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl border-4 border-white bg-sidebar text-xl font-bold text-white dark:border-slate-800">
                TF
              </div>
              <Button size="sm" variant="secondary" icon={Camera}>
                Change logo
              </Button>
            </div>
          </Card>

          <Card>
            <h3 className="mb-4 text-sm font-semibold text-slate-800 dark:text-slate-100">
              Company information
            </h3>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <TextField label="Company name" {...register("name")} />
              <div className="grid gap-4 sm:grid-cols-2">
                <SelectField
                  label="Industry"
                  options={INDUSTRIES}
                  {...register("industry")}
                />
                <SelectField
                  label="Company size"
                  options={SIZES}
                  {...register("size")}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <TextField
                  label="Website"
                  icon={Globe}
                  {...register("website")}
                />
                <TextField
                  label="Location"
                  icon={MapPin}
                  {...register("location")}
                />
              </div>
              <TextareaField
                label="About the company"
                rows={5}
                {...register("about")}
              />
              <Button type="submit" icon={Save} loading={saving}>
                Save changes
              </Button>
            </form>
          </Card>

          <Card>
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                  Culture gallery
                </h3>
                <p className="text-xs text-slate-400">
                  Show candidates what it's like to work here.
                </p>
              </div>
              <Button
                size="sm"
                variant="secondary"
                icon={Plus}
                onClick={addGalleryImage}
              >
                Add photo
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {gallery.map((img) => (
                <div
                  key={img.id}
                  className="group relative flex aspect-square items-center justify-center rounded-xl bg-slate-100 text-slate-300 dark:bg-slate-800"
                >
                  <ImageIcon className="h-6 w-6" />
                  <button
                    onClick={() => removeGalleryImage(img.id)}
                    aria-label={`Remove ${img.label}`}
                    className="absolute right-1.5 top-1.5 rounded-md bg-white/90 p-1 text-slate-500 opacity-0 group-hover:opacity-100 hover:text-error"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <h3 className="mb-4 text-sm font-semibold text-slate-800 dark:text-slate-100">
              Benefits & perks
            </h3>
            <div className="flex flex-wrap gap-2">
              {benefits.map((b) => (
                <span
                  key={b}
                  className="inline-flex items-center gap-1.5 rounded-full bg-accent/10 px-3 py-1.5 text-xs font-medium text-accent-600"
                >
                  {b}
                  <button
                    onClick={() => setBenefits(benefits.filter((x) => x !== b))}
                    aria-label={`Remove ${b}`}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="mt-4 flex gap-2">
              <TextField
                placeholder="Add a benefit..."
                value={benefitInput}
                onChange={(e) => setBenefitInput(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && (e.preventDefault(), addBenefit())
                }
                className="flex-1"
              />
              <Button
                variant="secondary"
                icon={Plus}
                onClick={addBenefit}
                type="button"
              >
                Add
              </Button>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-success" />
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                Verification status
              </p>
            </div>
            <Badge className="mt-3" tone="Approved">
              Verified
            </Badge>
            <p className="mt-2 text-xs text-slate-400">
              Your company was verified on Nov 20, 2025.
            </p>
          </Card>
          <Card>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-slate-400" />
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                Team members
              </p>
            </div>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              3 team members have access to this account.
            </p>
            <Button size="sm" variant="secondary" className="mt-3">
              Manage team
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
