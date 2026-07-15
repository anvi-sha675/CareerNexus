import { useParams } from "react-router-dom";
import Spinner from "../../components/common/Spinner";
import ErrorState from "../../components/common/ErrorState";
import JobForm from "./JobForm";
import { useAsync } from "../../hooks/useAsync";
import * as jobsService from "../../services/jobsService";

export default function EditJob() {
  const { id } = useParams();
  const {
    data: job,
    loading,
    error,
    refetch,
  } = useAsync(() => jobsService.getJobById(id), [id]);

  if (loading) return <Spinner />;
  if (error || !job)
    return (
      <ErrorState onRetry={refetch} description="We couldn't load this job." />
    );

  return (
    <JobForm
      mode="edit"
      defaultValues={{ ...job, tags: job.tags?.join(", ") || "" }}
      onSubmitJob={(values) => jobsService.updateJob(id, values)}
    />
  );
}
