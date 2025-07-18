import { useQuery } from "react-query";
import { fetchJobApplications } from "../../api/applicationApi";
import { Application } from "../../types/ApplicationTypes";

export const useFetchJobApplications = (jobId: number) => {
  return useQuery<Application[], Error>(
    ["jobApplications", jobId],
    () => fetchJobApplications(jobId),
    {
      staleTime: 30 * 1000,
      retry: 2,
      onError: (error: Error) => {
        console.error("Error fetching applications:", error.message);
      },
    }
  );
};
