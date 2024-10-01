// src/hooks/useJobs.ts
import { useQuery, useMutation, useQueryClient } from "react-query";
import {
  fetchJobs,
  createJob,
  updateJob,
  deleteJob,
  Job,
  UpdateJobData,
} from "../api/jobApi";

// Fetch all jobs
export const useJobs = () => {
  return useQuery<Job[], Error>("jobs", fetchJobs, {
    staleTime: 5 * 60 * 1000, // Cache jobs for 5 minutes
    retry: 2, // Retry failed requests twice
    onError: (error: Error) => {
      console.error("Error fetching jobs:", error.message);
    },
  });
};

// Create a new job
export const useCreateJob = () => {
  const queryClient = useQueryClient();

  return useMutation(createJob, {
    onSuccess: () => {
      queryClient.invalidateQueries("jobs"); // Refetch jobs after creation
    },
    onError: (error: Error) => {
      console.error("Error creating job:", error.message);
    },
  });
};

// Update an existing job
export const useUpdateJob = () => {
  const queryClient = useQueryClient();

  return useMutation(
    ({ id, data }: { id: number; data: UpdateJobData }) => updateJob(id, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("jobs"); // Refetch jobs after update
      },
      onError: (error: Error) => {
        console.error("Error updating job:", error.message);
      },
    }
  );
};

// Delete a job
export const useDeleteJob = () => {
  const queryClient = useQueryClient();

  return useMutation((id: number) => deleteJob(id), {
    onSuccess: () => {
      queryClient.invalidateQueries("jobs"); // Refetch jobs after deletion
    },
    onError: (error: Error) => {
      console.error("Error deleting job:", error.message);
    },
  });
};
