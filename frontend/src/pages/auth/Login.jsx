import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Mail, Lock } from "lucide-react";
import TextField from "../../components/forms/TextField";
import Checkbox from "../../components/forms/Checkbox";
import Button from "../../components/common/Button";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { isEmail } from "../../utils/validators";

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({ defaultValues: { role: "student" } });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const role = watch("role");

  const onSubmit = async (values) => {
    setLoading(true);
    try {
      const user = await login(values.email, values.password, values.role);
      showToast(`Welcome back, ${user.name.split(" ")[0]}!`, {
        type: "success",
      });
      navigate(location.state?.from?.pathname || `/${user.role}/dashboard`, {
        replace: true,
      });
    } catch {
      showToast("Login failed. Please check your credentials.", {
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
        Welcome back
      </h1>
      <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
        Log in to continue to your dashboard.
      </p>

      <div className="mt-6 grid grid-cols-3 gap-2">
        {["student", "recruiter", "admin"].map((r) => (
          <label
            key={r}
            className={`cursor-pointer rounded-xl border px-3 py-2 text-center text-xs font-medium capitalize ${role === r ? "border-primary-500 bg-primary-50 text-primary-700 dark:bg-primary-500/10" : "border-slate-200 text-slate-500 dark:border-slate-700"}`}
          >
            <input
              type="radio"
              value={r}
              {...register("role")}
              className="sr-only"
            />
            {r}
          </label>
        ))}
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="mt-6 space-y-4"
      >
        <TextField
          label="Email address"
          type="email"
          icon={Mail}
          placeholder="you@example.com"
          required
          error={errors.email?.message}
          {...register("email", {
            required: "Email is required",
            validate: (v) => isEmail(v) || "Enter a valid email",
          })}
        />
        <TextField
          label="Password"
          type="password"
          icon={Lock}
          placeholder="••••••••"
          required
          error={errors.password?.message}
          {...register("password", {
            required: "Password is required",
            minLength: { value: 6, message: "Minimum 6 characters" },
          })}
        />
        <div className="flex items-center justify-between">
          <Checkbox
            name="remember"
            label="Remember me"
            {...register("remember")}
          />
          <Link
            to="/forgot-password"
            className="text-sm font-medium text-primary-600 hover:underline"
          >
            Forgot password?
          </Link>
        </div>
        <Button type="submit" fullWidth loading={loading}>
          Log in
        </Button>
      </form>

      <div className="mt-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
        <span className="text-xs text-slate-400">or continue with</span>
        <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3">
        <Button variant="secondary" fullWidth type="button">
          Google
        </Button>
        <Button variant="secondary" fullWidth type="button">
          LinkedIn
        </Button>
      </div>

      <p className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400">
        Don't have an account?{" "}
        <Link
          to="/register"
          className="font-medium text-primary-600 hover:underline"
        >
          Sign up
        </Link>
      </p>
    </div>
  );
}
