import JobForm from "./JobForm";
import * as jobsService from "../../services/jobsService";

export default function CreateJob() {
  return (
    <JobForm
      mode="create"
      onSubmitJob={(values) => jobsService.createJob(values)}
    />
  );
}
