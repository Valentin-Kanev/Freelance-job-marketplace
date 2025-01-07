import { useQuery, useMutation } from "react-query";
import {
  applyForJob,
  fetchJobApplications,
  Application,
  MyApplication,
  fetchMyApplications,
} from "../api/ApplicationApi";
export const useApplyForJob = () => {
  return useMutation(
    ({
      jobId,
      data,
    }: {
      jobId: string;
      data: { freelancer_id: string; cover_letter: string };
    }) => applyForJob(jobId, data),
    {
      onError: (error: Error) => {
        console.error("Error applying for job:", error.message);
      },
    }
  );
};

export const useJobApplications = (jobId: string) => {
  return useQuery<Application[], Error>(
    ["jobApplications", jobId],
    () => fetchJobApplications(jobId),
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
