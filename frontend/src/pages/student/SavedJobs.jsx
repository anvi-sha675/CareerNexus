import { useState } from "react";
import { Bookmark } from "lucide-react";
import PageHeader from "../../components/common/PageHeader";
import JobCard from "../../components/jobs/JobCard";
import EmptyState from "../../components/common/EmptyState";
import { CardSkeleton } from "../../components/common/Skeleton";
import { useAsync } from "../../hooks/useAsync";
import * as jobsService from "../../services/jobsService";

export default function SavedJobs() {
  const { data: jobs, loading } = useAsync(jobsService.getJobs, []);
  const [savedIds, setSavedIds] = useState(["j1", "j3", "j8"]);

  const savedJobs = (jobs || []).filter((j) => savedIds.includes(j.id));
  const toggleSave = (id) =>
    setSavedIds((prev) => prev.filter((i) => i !== id));

  return (
    <div>
      <PageHeader
        title="Saved Jobs"
        description="Roles you've bookmarked to revisit later."
        breadcrumbs={[{ label: "Saved Jobs" }]}
      />
      {loading ? (
        <div className="grid gap-5 sm:grid-cols-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : savedJobs.length === 0 ? (
        <EmptyState
          icon={Bookmark}
          title="No saved jobs yet"
          description="Bookmark roles from the Jobs page to find them here."
        />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2">
          {savedJobs.map((job) => (
            <JobCard key={job.id} job={job} saved onSave={toggleSave} />
          ))}
        </div>
      )}
    </div>
  );
}
