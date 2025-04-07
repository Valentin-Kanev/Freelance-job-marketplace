import { useQuery, useMutation } from "react-query";
import {
  applyForJob,
  fetchJobApplications,
  fetchMyApplications,
} from "../api/ApplicationApi";
import { Application, MyApplication } from "../types/ApplicationTypes";

export const useApplyForJob = (
  onSuccess?: () => void,
  onError?: (error: Error) => void
) => {
  return useMutation(
    ({
      job_id,
      data,
    }: {
      job_id: number;
      data: { freelancer_id: string; cover_letter: string };
    }) => applyForJob(job_id, data),
    {
      onSuccess,
      onError: (error: Error) => {
        console.error("Error applying for job:", error.message);
        if (onError) onError(error);
      },
    }
  );
};

export const useJobApplications = (job_id: number) => {
  return useQuery<Application[], Error>(
    ["jobApplications", job_id],
    () => fetchJobApplications(job_id),
    {
      staleTime: 5 * 60 * 1000,
      retry: 2,
      onError: (error: Error) => {
        console.error("Error fetching applications:", error.message);
      },
    }
  );
};

export const useMyApplications = () => {
  return useQuery<MyApplication[], Error>(
    "myApplications",
    fetchMyApplications,
    {
      staleTime: 5 * 60 * 1000,
      retry: 2,
      onError: (error: Error) => {
        console.error("Error fetching my applications:", error.message);
      },
    }
  );
};
