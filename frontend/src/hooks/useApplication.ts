import { useQuery, useMutation, useQueryClient } from "react-query";
import {
  applyForJob,
  fetchJobApplications,
  fetchMyApplications,
} from "../api/ApplicationApi";
import { Application, MyApplication } from "../types/ApplicationTypes";

export const useApplyForJob = (
  onSuccess?: (data: Application) => void,
  onError?: (error: Error) => void
) => {
  const queryClient = useQueryClient();
  return useMutation(
    ({
      job_id,
      data,
    }: {
      job_id: number;
      data: { freelancer_id: string; cover_letter: string };
    }) => applyForJob(job_id, data),
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

export const useFetchJobApplications = (job_id: number) => {
  return useQuery<Application[], Error>(
    ["jobApplications", job_id],
    () => fetchJobApplications(job_id),
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
