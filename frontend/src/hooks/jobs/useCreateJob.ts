import { useMutation, useQueryClient } from "react-query";
import { CreateJobData, Job } from "../../types/JobTypes";
import { createJob } from "../../api/jobApi";

export const useCreateJob = (
  onSuccessCallback?: (newJob: CreateJobData) => void,
  onErrorCallback?: (errorMessage: string) => void
) => {
  const queryClient = useQueryClient();

  return useMutation<Job, Error, CreateJobData>(createJob, {
    onSuccess: (newJob) => {
      queryClient.invalidateQueries("jobs");
      onSuccessCallback?.(newJob);
    },
    onError: (error: Error) => {
      console.error("Error creating job:", error.message);
      onErrorCallback?.(error.message);
    },
  });
};
