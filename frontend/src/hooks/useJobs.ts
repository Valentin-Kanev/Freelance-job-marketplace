import { useQuery, useMutation, useQueryClient } from "react-query";
import {
  fetchJobs,
  createJob,
  updateJob,
  softDeleteJob,
  fetchJob,
  searchJobsByTitle,
  fetchJobsByClient,
} from "../api/jobApi";
import { CreateJobData, Job, UpdateJobData } from "../types/JobTypes";

export const useFetchMyJobs = (clientId: string) => {
  return useQuery(
    ["jobsByClient", clientId],
    () => fetchJobsByClient(clientId),
    {
      enabled: !!clientId,
    }
  );
};

export const useJobs = () => {
  return useQuery<Job[], Error>("jobs", fetchJobs, {
    staleTime: 30 * 1000,
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
      onSuccessCallback?.(newJob);
    },
    onError: (error: Error) => {
      console.error("Error creating job:", error.message);
      onErrorCallback?.(error.message);
    },
  });
};

export const useUpdateJob = (
  onSuccessCallback?: (updatedJob: Job) => void,
  onErrorCallback?: (errorMessage: string) => void
) => {
  const queryClient = useQueryClient();

  return useMutation(
    ({ jobId, data }: { jobId: number; data: UpdateJobData }) => {
      return updateJob({ jobId, data });
    },
    {
      onSuccess: (updatedJob) => {
        queryClient.invalidateQueries(["job", updatedJob.jobId]);
        queryClient.invalidateQueries("jobs");
        onSuccessCallback?.(updatedJob);
      },
      onError: (error: Error) => {
        console.error("Error updating job:", error.message);
        onErrorCallback?.(error.message);
      },
    }
  );
};

export const useDeleteJob = () => {
  const queryClient = useQueryClient();

  return useMutation((jobId: number) => softDeleteJob(jobId), {
    onSuccess: () => {
      queryClient.invalidateQueries("jobs");
    },
    onError: (error: Error) => {
      console.error("Error deleting job:", error.message);
    },
  });
};

export const useFetchJob = (jobId: number) => {
  return useQuery<Job, Error>(["job", jobId], () => fetchJob(jobId), {
    enabled: typeof jobId === "number" && jobId > 0,
    retry: 2,
    staleTime: 30 * 1000,
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
      staleTime: 30 * 1000,
      retry: 2,
      onError: (error: Error) => {
        console.error("Error searching jobs:", error.message);
      },
    }
  );
};

export const useJobMutations = (
  onSuccess: (job: Job | CreateJobData) => void,
  onError?: (errorMessage: string) => void
) => {
  const createJobMutation = useCreateJob(
    (newJob) => onSuccess(newJob),
    onError
  );
  const updateJobMutation = useUpdateJob(
    (updatedJob) => onSuccess(updatedJob),
    onError
  );

  const handleJobSubmit = (
    isUpdate: boolean,
    jobDetails: CreateJobData | (UpdateJobData & { jobId: number })
  ) => {
    if (isUpdate) {
      const { jobId, ...fields } = jobDetails as UpdateJobData & {
        jobId: number;
      };
      const updatedData = Object.fromEntries(
        Object.entries(fields).filter(([_, v]) => v !== undefined)
      );
      updateJobMutation.mutate({ jobId, data: updatedData });
    } else {
      createJobMutation.mutate(jobDetails as CreateJobData);
    }
  };

  return { handleJobSubmit };
};
