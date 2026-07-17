import { Bookmark } from "lucide-react";
import PageHeader from "../../components/common/PageHeader";
import JobCard from "../../components/jobs/JobCard";
import EmptyState from "../../components/common/EmptyState";
import { CardSkeleton } from "../../components/common/Skeleton";
import { useAsync } from "../../hooks/useAsync";
import * as studentProfileService from "../../services/studentProfileService";
import { useToast } from "../../context/ToastContext";

export default function SavedJobs() {
  const {
    data: savedJobs,
    loading,
    setData,
  } = useAsync(studentProfileService.listSavedJobs, []);
  const { showToast } = useToast();

  const handleUnsave = async (jobId) => {
    await studentProfileService.unsaveJob(jobId);
    setData((prev) => prev.filter((j) => j.id !== jobId));
    showToast("Removed from saved jobs.", { type: "success" });
  };

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
      ) : !savedJobs?.length ? (
        <EmptyState
          icon={Bookmark}
          title="No saved jobs yet"
          description="Bookmark roles from the Jobs page to find them here."
        />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2">
          {savedJobs.map((job) => (
            <JobCard key={job.id} job={job} saved onSave={handleUnsave} />
          ))}
        </div>
      )}
    </div>
  );
}
