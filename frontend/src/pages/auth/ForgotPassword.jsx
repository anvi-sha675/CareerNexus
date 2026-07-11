import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { Mail, ArrowLeft, MailCheck } from "lucide-react";
import TextField from "../../components/forms/TextField";
import Button from "../../components/common/Button";
import * as authService from "../../services/authService";
import { isEmail } from "../../utils/validators";

export default function ForgotPassword() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm();
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const onSubmit = async (values) => {
    setLoading(true);
    await authService.forgotPassword(values.email);
    setLoading(false);
    setSent(true);
  };

  if (sent) {
    return (
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-green-50 text-success dark:bg-green-500/10">
          <MailCheck className="h-7 w-7" />
        </div>
        <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">
          Check your inbox
        </h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          We sent a password reset link to <strong>{getValues("email")}</strong>
          . It expires in 30 minutes.
        </p>
        <Link
          to="/login"
          className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-primary-600 hover:underline"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to login
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
        Forgot your password?
      </h1>
      <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
        Enter your email and we'll send you a reset link.
      </p>
      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="mt-6 space-y-4"
      >
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
        <Button type="submit" fullWidth loading={loading}>
          Send reset link
        </Button>
      </form>
      <Link
        to="/login"
        className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-primary-600 hover:underline"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Back to login
      </Link>
    </div>
  );
}
