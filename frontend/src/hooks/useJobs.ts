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
    ({ job_id, data }: { job_id: number; data: UpdateJobData }) => {
      return updateJob({ job_id, data });
    },
    {
      onSuccess: (updatedJob) => {
        queryClient.invalidateQueries(["job", updatedJob.job_id]);
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

  return useMutation((job_id: number) => softDeleteJob(job_id), {
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
    jobDetails: CreateJobData | (UpdateJobData & { job_id: number })
  ) => {
    if (isUpdate) {
      const { job_id, ...fields } = jobDetails as UpdateJobData & {
        job_id: number;
      };
      const updatedData = Object.fromEntries(
        Object.entries(fields).filter(([_, v]) => v !== undefined)
      );
      updateJobMutation.mutate({ job_id, data: updatedData });
    } else {
      createJobMutation.mutate(jobDetails as CreateJobData);
    }
  };

  return { handleJobSubmit };
};
