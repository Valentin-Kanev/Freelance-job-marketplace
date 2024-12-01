import { useQuery, useMutation, useQueryClient } from "react-query";
import {
  fetchJobs,
  createJob,
  updateJob,
  deleteJob,
  Job,
  UpdateJobData,
  fetchJob,
} from "../api/jobApi";

// Fetch all jobs
export const useJobs = () => {
  return useQuery<Job[], Error>("jobs", fetchJobs, {
    staleTime: 5 * 60 * 1000,
    retry: 2,
    onError: (error: Error) => {
      console.error("Error fetching jobs:", error.message);
    },
  });
};

// Create a new job
export const useCreateJob = (onSuccessCallback?: (newJob: any) => void) => {
  const queryClient = useQueryClient();

  return useMutation(createJob, {
    onSuccess: (newJob) => {
      queryClient.invalidateQueries("jobs");
      if (onSuccessCallback) onSuccessCallback(newJob);
    },
    onError: (error: Error) => {
      console.error("Error creating job:", error.message);
    },
  });
};

// Update an existing job
export const useUpdateJob = (onSuccessCallback?: (updatedJob: any) => void) => {
  const queryClient = useQueryClient();

  return useMutation(
    ({ id, data }: { id: string; data: UpdateJobData }) => updateJob(id, data),
    {
      onSuccess: (updatedJob) => {
        queryClient.invalidateQueries(["job", updatedJob.id]);
        queryClient.invalidateQueries("jobs");
        if (onSuccessCallback) onSuccessCallback(updatedJob);
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

  return useMutation((id: string) => deleteJob(id), {
    onSuccess: () => {
      queryClient.invalidateQueries("jobs");
    },
    onError: (error: Error) => {
      console.error("Error deleting job:", error.message);
    },
  });
};

// Fetch a single job
export const useJob = (id: string) => {
  return useQuery<Job, Error>(["job", id], () => fetchJob(id), {
    retry: 2,
    staleTime: 5 * 60 * 1000,
    onError: (error: Error) => {
      console.error("Error fetching job:", error.message);
    },
  });
};

// Hook for handling job form submissions
export const useJobMutations = (
  userId: string,
  onSuccess: (job: any) => void
) => {
  const createJobMutation = useCreateJob(onSuccess);
  const updateJobMutation = useUpdateJob(onSuccess);

  const handleJobSubmit = (
    isUpdate: boolean,
    jobDetails: any,
    jobId?: string
  ) => {
    if (isUpdate && jobId) {
      updateJobMutation.mutate({ id: jobId, data: jobDetails });
    } else {
      createJobMutation.mutate({ ...jobDetails, client_id: userId });
    }
  };

  return { handleJobSubmit };
};
