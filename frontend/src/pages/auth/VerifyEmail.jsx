import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { MailCheck, Loader2, XCircle } from "lucide-react";
import Button from "../../components/common/Button";
import * as authService from "../../services/authService";

export default function VerifyEmail() {
  const [status, setStatus] = useState("verifying");
  const [searchParams] = useSearchParams();

  useEffect(() => {
    let mounted = true;
    authService
      .verifyEmail(searchParams.get("token") || "demo")
      .then(() => mounted && setStatus("success"))
      .catch(() => mounted && setStatus("error"));
    return () => {
      mounted = false;
    };
  }, [searchParams]);

  return (
    <div className="text-center">
      {status === "verifying" && (
        <>
          <Loader2 className="mx-auto mb-4 h-10 w-10 animate-spin text-primary-500" />
          <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">
            Verifying your email…
          </h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            This will just take a moment.
          </p>
        </>
      )}
      {status === "success" && (
        <>
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-green-50 text-success dark:bg-green-500/10">
            <MailCheck className="h-7 w-7" />
          </div>
          <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">
            Email verified
          </h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Your email has been confirmed. You're all set.
          </p>
          <Link to="/login" className="mt-6 inline-block">
            <Button>Continue to login</Button>
          </Link>
        </>
      )}
      {status === "error" && (
        <>
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-error dark:bg-red-500/10">
            <XCircle className="h-7 w-7" />
          </div>
          <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">
            Verification failed
          </h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            This link may have expired. Please request a new one.
          </p>
          <Link to="/login" className="mt-6 inline-block">
            <Button variant="secondary">Back to login</Button>
          </Link>
        </>
      )}
    </div>
  );
}
