import { useQuery, useMutation, useQueryClient } from "react-query";
import {
  fetchJobs,
  createJob,
  updateJob,
  deleteJob,
  fetchJob,
  searchJobsByTitle,
} from "../api/jobApi";
import { CreateJobData, Job, UpdateJobData } from "../types/JobTypes";

export const useJobs = () => {
  return useQuery<Job[], Error>("jobs", fetchJobs, {
    staleTime: 5 * 60 * 1000,
    retry: 2,
    onError: (error: Error) => {
      console.error("Error fetching jobs:", error.message);
    },
  });
};

export const useCreateJob = (
  onSuccessCallback?: (newJob: CreateJobData) => void,
  onErrorCallback?: (errorMessage: string) => void
) => {
  const queryClient = useQueryClient();

  return useMutation<Job, Error, CreateJobData>(createJob, {
    onSuccess: (newJob) => {
      queryClient.invalidateQueries("jobs");
      if (onSuccessCallback) onSuccessCallback(newJob);
    },
    onError: (error: Error) => {
      console.error("Error creating job:", error.message);
      if (onErrorCallback) onErrorCallback(error.message);
    },
  });
};

export const useUpdateJob = (
  onSuccessCallback?: (updatedJob: UpdateJobData) => void,
  onErrorCallback?: (errorMessage: string) => void
) => {
  const queryClient = useQueryClient();

  return useMutation(
    ({ job_id, data }: { job_id: number; data: UpdateJobData }) => {
      return updateJob(job_id, data);
    },
    {
      onSuccess: (updatedJob) => {
        queryClient.invalidateQueries(["job", updatedJob.job_id]);
        queryClient.invalidateQueries("jobs");
        if (onSuccessCallback) onSuccessCallback(updatedJob);
      },
      onError: (error: Error) => {
        console.error("Error updating job:", error.message);
        if (onErrorCallback) onErrorCallback(error.message);
      },
    }
  );
};

export const useDeleteJob = () => {
  const queryClient = useQueryClient();

  return useMutation((job_id: number) => deleteJob(job_id), {
    onSuccess: () => {
      queryClient.invalidateQueries("jobs");
    },
    onError: (error: Error) => {
      console.error("Error deleting job:", error.message);
    },
  });
};

export const useJob = (job_id: number) => {
  return useQuery<Job, Error>(["job", job_id], () => fetchJob(job_id), {
    retry: 2,
    staleTime: 5 * 60 * 1000,
    onError: (error: Error) => {
      console.error("Error fetching job:", error.message);
    },
  });
};

export const useSearchJobsByTitle = (title: string) => {
  return useQuery<Job[], Error>(
    ["jobs", title],
    () => (title ? searchJobsByTitle(title) : Promise.resolve([])),
    {
      enabled: Boolean(title),
      staleTime: 5 * 60 * 1000,
      retry: 2,
      onError: (error: Error) => {
        console.error("Error searching jobs:", error.message);
      },
    }
  );
};

export const useJobMutations = (
  userId: string,
  onSuccess: (job: Job | CreateJobData | UpdateJobData) => void,
  onError?: (errorMessage: string) => void
) => {
  const createJobMutation = useCreateJob(onSuccess, onError);
  const updateJobMutation = useUpdateJob(onSuccess, onError);

  const handleJobSubmit = (isUpdate: boolean, jobDetails: Job) => {
    if (isUpdate) {
      updateJobMutation.mutate({ job_id: jobDetails.job_id, data: jobDetails });
    } else {
      createJobMutation.mutate({
        ...jobDetails,
        client_id: userId,
        budget: jobDetails.budget,
        deadline: jobDetails.deadline,
      });
    }
  };

  return { handleJobSubmit };
};
