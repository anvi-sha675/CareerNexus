import { Link } from "react-router-dom";
import { SearchX } from "lucide-react";
import Button from "../../components/common/Button";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-primary-500/10 text-primary-600">
        <SearchX className="h-10 w-10" />
      </div>
      <p className="text-sm font-semibold text-primary-600">404 error</p>
      <h1 className="mt-2 text-3xl font-extrabold text-slate-900 dark:text-white">
        This page went missing
      </h1>
      <p className="mt-3 max-w-md text-slate-500 dark:text-slate-400">
        The page you're looking for doesn't exist or may have moved. Let's get
        you back on track.
      </p>
      <div className="mt-8 flex gap-3">
        <Link to="/">
          <Button>Back to home</Button>
        </Link>
        <Link to="/jobs">
          <Button variant="secondary">Browse jobs</Button>
        </Link>
      </div>
    </div>
  );
}
