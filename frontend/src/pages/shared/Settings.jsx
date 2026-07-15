import { useState } from "react";
import { useForm } from "react-hook-form";
import { Save, Trash2 } from "lucide-react";
import PageHeader from "../../components/common/PageHeader";
import Card from "../../components/common/Card";
import Tabs from "../../components/common/Tabs";
import TextField from "../../components/forms/TextField";
import Checkbox from "../../components/forms/Checkbox";
import Button from "../../components/common/Button";
import PasswordStrengthMeter from "../../components/forms/PasswordStrengthMeter";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import ThemeSwitch from "../../components/layout/ThemeSwitch";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { useTheme } from "../../context/ThemeContext";

function AccountTab() {
  const { user, updateProfile } = useAuth();
  const { showToast } = useToast();
  const { register, handleSubmit } = useForm({
    defaultValues: { name: user?.name, email: user?.email },
  });
  const [saving, setSaving] = useState(false);

  const onSubmit = async (values) => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 600));
    updateProfile(values);
    setSaving(false);
    showToast("Account details updated.", { type: "success" });
  };

  return (
    <Card>
      <h3 className="mb-4 text-sm font-semibold text-slate-800 dark:text-slate-100">
        Account details
      </h3>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <TextField label="Full name" {...register("name")} />
        <TextField label="Email address" type="email" {...register("email")} />
        <Button type="submit" icon={Save} loading={saving}>
          Save changes
        </Button>
      </form>
    </Card>
  );
}

function SecurityTab() {
  const { register, handleSubmit, watch, reset } = useForm();
  const [saving, setSaving] = useState(false);
  const { showToast } = useToast();
  const newPassword = watch("newPassword");

  const onSubmit = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 700));
    setSaving(false);
    reset();
    showToast("Password updated successfully.", { type: "success" });
  };

  return (
    <Card>
      <h3 className="mb-4 text-sm font-semibold text-slate-800 dark:text-slate-100">
        Change password
      </h3>
      <form onSubmit={handleSubmit(onSubmit)} className="max-w-md space-y-4">
        <TextField
          label="Current password"
          type="password"
          required
          {...register("currentPassword", { required: true })}
        />
        <div>
          <TextField
            label="New password"
            type="password"
            required
            {...register("newPassword", { required: true, minLength: 8 })}
          />
          <PasswordStrengthMeter password={newPassword} />
        </div>
        <TextField
          label="Confirm new password"
          type="password"
          required
          {...register("confirmPassword", { required: true })}
        />
        <Button type="submit" loading={saving}>
          Update password
        </Button>
      </form>
    </Card>
  );
}

function NotificationsTab() {
  const { showToast } = useToast();
  const [prefs, setPrefs] = useState({
    email: true,
    push: true,
    applicationUpdates: true,
    marketing: false,
  });

  const toggle = (key) => {
    setPrefs((p) => ({ ...p, [key]: !p[key] }));
    showToast("Notification preferences updated.", {
      type: "success",
      duration: 2500,
    });
  };

  return (
    <Card>
      <h3 className="mb-4 text-sm font-semibold text-slate-800 dark:text-slate-100">
        Notification preferences
      </h3>
      <div className="space-y-3">
        <Checkbox
          name="email"
          label="Email notifications"
          checked={prefs.email}
          onChange={() => toggle("email")}
        />
        <Checkbox
          name="push"
          label="Push notifications"
          checked={prefs.push}
          onChange={() => toggle("push")}
        />
        <Checkbox
          name="applicationUpdates"
          label="Application status updates"
          checked={prefs.applicationUpdates}
          onChange={() => toggle("applicationUpdates")}
        />
        <Checkbox
          name="marketing"
          label="Product updates & tips"
          checked={prefs.marketing}
          onChange={() => toggle("marketing")}
        />
      </div>
    </Card>
  );
}

function AppearanceTab() {
  const { theme } = useTheme();
  return (
    <Card>
      <h3 className="mb-4 text-sm font-semibold text-slate-800 dark:text-slate-100">
        Appearance
      </h3>
      <div className="flex items-center justify-between rounded-xl border border-slate-100 p-4 dark:border-slate-700">
        <div>
          <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
            Theme
          </p>
          <p className="text-xs text-slate-400">Currently using {theme} mode</p>
        </div>
        <ThemeSwitch />
      </div>
    </Card>
  );
}

function PrivacyTab() {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const { logout } = useAuth();
  const { showToast } = useToast();

  return (
    <Card>
      <h3 className="mb-1 text-sm font-semibold text-slate-800 dark:text-slate-100">
        Data & privacy
      </h3>
      <p className="mb-4 text-xs text-slate-400">
        Manage your data or permanently delete your account.
      </p>
      <div className="space-y-3">
        <Button variant="secondary">Download my data</Button>
        <div className="rounded-xl border border-red-100 bg-red-50/50 p-4 dark:border-red-500/20 dark:bg-red-500/5">
          <p className="text-sm font-medium text-error">Delete account</p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            This permanently removes your profile, applications, and resume
            data.
          </p>
          <Button
            variant="danger"
            size="sm"
            icon={Trash2}
            className="mt-3"
            onClick={() => setConfirmOpen(true)}
          >
            Delete my account
          </Button>
        </div>
      </div>
      <ConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={() => {
          setConfirmOpen(false);
          showToast("Account deletion requested.", { type: "warning" });
          logout();
        }}
        title="Delete your account?"
        description="This action is permanent and cannot be undone. All your data will be removed."
        confirmLabel="Delete account"
      />
    </Card>
  );
}

export default function Settings() {
  return (
    <div>
      <PageHeader
        title="Settings"
        description="Manage your account, security, and preferences."
        breadcrumbs={[{ label: "Settings" }]}
      />
      <Tabs
        tabs={[
          { key: "account", label: "Account", content: <AccountTab /> },
          { key: "security", label: "Security", content: <SecurityTab /> },
          {
            key: "notifications",
            label: "Notifications",
            content: <NotificationsTab />,
          },
          {
            key: "appearance",
            label: "Appearance",
            content: <AppearanceTab />,
          },
          { key: "privacy", label: "Privacy", content: <PrivacyTab /> },
        ]}
      />
    </div>
  );
}
