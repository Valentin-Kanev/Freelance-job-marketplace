import { useQuery, useMutation, useQueryClient } from "react-query";
import {
  fetchJobs,
  createJob,
  updateJob,
  deleteJob,
  fetchJob,
  searchJobsByTitle,
  UpdateJobArgs,
} from "../api/jobApi";
import { CreateJobData, Job, UpdateJobData } from "../types/JobTypes";

export const useJobs = () => {
  return useQuery<Job[], Error>("jobs", fetchJobs, {
    staleTime: 5 * 30 * 1000,
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
  onSuccessCallback?: (updatedJob: Job) => void,
  onErrorCallback?: (errorMessage: string) => void
) => {
  const queryClient = useQueryClient();

  return useMutation(
    ({ job_id, data }: { job_id: number; data: UpdateJobData }) => {
      return updateJob({ job_id, data });
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

export const useFetchJob = (job_id: number) => {
  return useQuery<Job, Error>(["job", job_id], () => fetchJob(job_id), {
    enabled: typeof job_id === "number" && job_id > 0,
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

  const handleJobSubmit = (
    isUpdate: boolean,
    jobDetails: CreateJobData | (UpdateJobData & { job_id: number })
  ) => {
    if (isUpdate) {
      const { job_id, ...fields } = jobDetails as UpdateJobData & {
        job_id: number;
      };

      const updatedData: UpdateJobData = Object.fromEntries(
        Object.entries(fields).filter(([_, v]) => v !== undefined)
      );

      const args: UpdateJobArgs = {
        job_id,
        data: updatedData,
      };

      updateJobMutation.mutate(args);
    } else {
      createJobMutation.mutate(jobDetails as CreateJobData);
    }
  };

  return { handleJobSubmit };
};
