import { Building2, MapPin, Briefcase } from "lucide-react";
import Card from "../common/Card";

export default function CompanyCard({ company }) {
  return (
    <Card hover className="flex items-center gap-4">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-sidebar text-sm font-bold text-white">
        {company.logo || <Building2 className="h-5 w-5" />}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate font-semibold text-slate-800 dark:text-slate-100">
          {company.name}
        </p>
        <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
          {company.location && (
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" />
              {company.location}
            </span>
          )}
          {company.openRoles != null && (
            <span className="inline-flex items-center gap-1">
              <Briefcase className="h-3.5 w-3.5" />
              {company.openRoles} open roles
            </span>
          )}
        </div>
      </div>
    </Card>
  );
}
