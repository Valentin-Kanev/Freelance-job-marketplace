// src/hooks/useApplications.ts
import { useQuery, useMutation } from "react-query";
import {
  applyForJob,
  fetchJobApplications,
  Application,
} from "../api/ApplicationApi"; // Make sure to import from the correct path

// Apply for a job
export const useApplyForJob = () => {
  return useMutation(
    ({
      jobId,
      data,
    }: {
      jobId: string; // Change to string to match the new Application interface
      data: { freelancer_id: string; cover_letter: string }; // Change to string
    }) => applyForJob(jobId, data), // Pass the file to the API function
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
export const useJobApplications = (jobId: string) => {
  // Change jobId to string
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
