import { useQuery } from "react-query";
import { Job } from "../../types/JobTypes";
import { fetchJobs } from "../../api/jobApi";

export const useJobs = () => {
  return useQuery<Job[], Error>("jobs", fetchJobs, {
    staleTime: 30 * 1000,
    retry: 2,
    onError: (error: Error) => {
      console.error("Error fetching jobs:", error.message);
    },
  });
};
