import { useQuery } from "react-query";
import { fetchJobApplications } from "../../api/applicationApi";
import { Application } from "../../components/jobApplications/ApplicationTypes";

export const useFetchJobApplications = (jobId: number) => {
  return useQuery<Application[], Error>(
    ["jobApplications", jobId],
    () => fetchJobApplications(jobId),
    {
      staleTime: 30 * 1000,
      retry: 2,
    }
  );
};
