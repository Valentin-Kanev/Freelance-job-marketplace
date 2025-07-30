import { useQuery } from "react-query";
import { Job } from "../../components/jobs/JobTypes";
import { fetchJobs } from "../../api/jobApi";

export const useFetchJobs = () => {
  return useQuery<Job[], Error>("jobs", fetchJobs, {
    staleTime: 30 * 1000,
    retry: 2,
  });
};
