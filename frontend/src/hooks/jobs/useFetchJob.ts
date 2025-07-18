import { useQuery } from "react-query";
import { Job } from "../../types/JobTypes";
import { fetchJob } from "../../api/jobApi";

export const useFetchJob = (jobId: number) => {
  return useQuery<Job, Error>(["job", jobId], () => fetchJob(jobId), {
    enabled: typeof jobId === "number" && jobId > 0,
    retry: 2,
    staleTime: 30 * 1000,
    onError: (error: Error) => {
      console.error("Error fetching job:", error.message);
    },
  });
};
