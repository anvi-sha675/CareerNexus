import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { GraduationCap, Building2, Mail, User, Lock } from "lucide-react";
import TextField from "../../components/forms/TextField";
import Checkbox from "../../components/forms/Checkbox";
import Button from "../../components/common/Button";
import PasswordStrengthMeter from "../../components/forms/PasswordStrengthMeter";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { isEmail } from "../../utils/validators";
import { cn } from "../../utils/cn";

const ROLE_OPTIONS = [
  {
    value: "student",
    label: "I'm a Student",
    icon: GraduationCap,
    desc: "Find and apply to jobs",
  },
  {
    value: "recruiter",
    label: "I'm a Recruiter",
    icon: Building2,
    desc: "Post jobs and hire talent",
  },
];

export default function Register() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm({ defaultValues: { role: "student" } });
  const [loading, setLoading] = useState(false);
  const { register: registerUser } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const role = watch("role");
  const password = watch("password");

  const onSubmit = async (values) => {
    setLoading(true);
    try {
      const user = await registerUser(values);
      showToast("Account created successfully!", { type: "success" });
      navigate(`/${user.role}/dashboard`, { replace: true });
    } catch {
      showToast("Something went wrong creating your account.", {
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
        Create your account
      </h1>
      <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
        Join CareerNexus in less than a minute.
      </p>

      <div className="mt-6 grid grid-cols-2 gap-3">
        {ROLE_OPTIONS.map((opt) => (
          <button
            type="button"
            key={opt.value}
            onClick={() => setValue("role", opt.value)}
            className={cn(
              "rounded-xl border p-3.5 text-left transition-colors",
              role === opt.value
                ? "border-primary-500 bg-primary-50 dark:bg-primary-500/10"
                : "border-slate-200 hover:border-slate-300 dark:border-slate-700",
            )}
          >
            <opt.icon
              className={cn(
                "h-5 w-5",
                role === opt.value ? "text-primary-600" : "text-slate-400",
              )}
            />
            <p className="mt-2 text-sm font-semibold text-slate-800 dark:text-slate-100">
              {opt.label}
            </p>
            <p className="text-xs text-slate-400">{opt.desc}</p>
          </button>
        ))}
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="mt-6 space-y-4"
      >
        <TextField
          label="Full name"
          icon={User}
          required
          error={errors.name?.message}
          {...register("name", { required: "Name is required" })}
        />
        <TextField
          label="Email address"
          type="email"
          icon={Mail}
          required
          error={errors.email?.message}
          {...register("email", {
            required: "Email is required",
            validate: (v) => isEmail(v) || "Enter a valid email",
          })}
        />
        <div>
          <TextField
            label="Password"
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
        <Checkbox
          name="terms"
          label={
            <span>
              I agree to the{" "}
              <Link to="/terms" className="text-primary-600 hover:underline">
                Terms
              </Link>{" "}
              and{" "}
              <Link to="/privacy" className="text-primary-600 hover:underline">
                Privacy Policy
              </Link>
            </span>
          }
          {...register("terms", { required: true })}
        />
        {errors.terms && (
          <p className="text-xs font-medium text-error">
            You must accept the terms to continue
          </p>
        )}
        <Button type="submit" fullWidth loading={loading}>
          Create account
        </Button>
      </form>

      <p className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400">
        Already have an account?{" "}
        <Link
          to="/login"
          className="font-medium text-primary-600 hover:underline"
        >
          Log in
        </Link>
      </p>
    </div>
  );
}
