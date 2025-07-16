import { useQuery, useMutation, useQueryClient } from "react-query";
import {
  applyForJob,
  fetchJobApplications,
  fetchMyApplications,
} from "../api/applicationApi";
import { Application, MyApplication } from "../types/ApplicationTypes";

export const useApplyForJob = (
  onSuccess?: (data: Application) => void,
  onError?: (error: Error) => void
) => {
  const queryClient = useQueryClient();
  return useMutation(
    ({
      jobId,
      data,
    }: {
      jobId: number;
      data: { freelancerId: string; coverLetter: string };
    }) => applyForJob(jobId, data),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries("myApplications");
        onSuccess?.(data);
      },
      onError: (error: Error) => {
        console.error("Error applying for job:", error.message);
        onError?.(error);
      },
    }
  );
};

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

export const useFetchMyApplications = () => {
  return useQuery<MyApplication[], Error>(
    "myApplications",
    fetchMyApplications,
    {
      retry: 2,
      onError: (error: Error) => {
        console.error("Error fetching my applications:", error.message);
      },
    }
  );
};
