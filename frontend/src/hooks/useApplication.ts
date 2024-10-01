// src/hooks/useApplications.ts
import { useQuery, useMutation } from "react-query";
import {
  applyForJob,
  fetchJobApplications,
  Application,
} from "../api/ApplicationApi";

// Apply for a job
export const useApplyForJob = () => {
  return useMutation(
    ({
      jobId,
      data,
    }: {
      jobId: number;
      data: { freelancer_id: number; cover_letter: string };
    }) => applyForJob(jobId, data),
    {
      onSuccess: () => {
        console.log("Application submitted successfully");
      },
      onError: (error: Error) => {
        console.error("Error applying for job:", error.message);
      },
    }
  );
};

// Fetch all applications for a specific job
export const useJobApplications = (jobId: number) => {
  return useQuery<Application[], Error>(
    ["jobApplications", jobId],
    () => fetchJobApplications(jobId),
    {
      staleTime: 5 * 60 * 1000, // Cache applications for 5 minutes
      retry: 2, // Retry failed requests twice
      onError: (error: Error) => {
        console.error("Error fetching applications:", error.message);
      },
    }
  );
};
