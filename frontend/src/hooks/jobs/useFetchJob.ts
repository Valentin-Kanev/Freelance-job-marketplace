import { useQuery } from "react-query";
import { Job } from "../../components/jobs/JobTypes";
import { fetchJob } from "../../api/jobApi";

export const useFetchJob = (jobId: number) => {
  return useQuery<Job, Error>(["job", jobId], () => fetchJob(jobId), {
    enabled: typeof jobId === "number" && jobId > 0,
    retry: 2,
  });
};
