import { Link } from "react-router-dom";
import { ShieldAlert } from "lucide-react";
import Button from "../../components/common/Button";

export default function Forbidden() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-red-50 text-error dark:bg-red-500/10">
        <ShieldAlert className="h-10 w-10" />
      </div>
      <p className="text-sm font-semibold text-error">403 error</p>
      <h1 className="mt-2 text-3xl font-extrabold text-slate-900 dark:text-white">
        You don't have access to this page
      </h1>
      <p className="mt-3 max-w-md text-slate-500 dark:text-slate-400">
        Your account role doesn't have permission to view this resource. If you
        think this is a mistake, contact support.
      </p>
      <div className="mt-8 flex gap-3">
        <Link to="/">
          <Button>Back to home</Button>
        </Link>
        <Link to="/contact">
          <Button variant="secondary">Contact support</Button>
        </Link>
      </div>
    </div>
  );
}
