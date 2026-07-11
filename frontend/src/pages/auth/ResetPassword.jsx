import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Lock } from "lucide-react";
import TextField from "../../components/forms/TextField";
import PasswordStrengthMeter from "../../components/forms/PasswordStrengthMeter";
import Button from "../../components/common/Button";
import { useToast } from "../../context/ToastContext";
import * as authService from "../../services/authService";

export default function ResetPassword() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { showToast } = useToast();
  const password = watch("password");

  const onSubmit = async (values) => {
    setLoading(true);
    await authService.resetPassword({
      token: "demo",
      password: values.password,
    });
    setLoading(false);
    showToast("Password reset successfully. Please log in.", {
      type: "success",
    });
    navigate("/login");
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
        Set a new password
      </h1>
      <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
        Choose a strong password you haven't used before.
      </p>
      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="mt-6 space-y-4"
      >
        <div>
          <TextField
            label="New password"
            type="password"
            icon={Lock}
            required
            error={errors.password?.message}
            {...register("password", {
              required: "Password is required",
              minLength: { value: 8, message: "Minimum 8 characters" },
            })}
          />
          <PasswordStrengthMeter password={password} />
        </div>
        <TextField
          label="Confirm new password"
          type="password"
          icon={Lock}
          required
          error={errors.confirm?.message}
          {...register("confirm", {
            required: "Please confirm your password",
            validate: (v) => v === password || "Passwords do not match",
          })}
        />
        <Button type="submit" fullWidth loading={loading}>
          Reset password
        </Button>
      </form>
    </div>
  );
}
