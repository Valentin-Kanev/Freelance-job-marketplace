import { CreateJobData, Job, EditJobData } from "../components/jobs/JobTypes";
import { fetchClient } from "./apiUtils/fetchClientApi";

export const createJob = async (jobData: CreateJobData): Promise<Job> => {
  return fetchClient<Job>("/jobs", {
    method: "POST",
    body: JSON.stringify(jobData),
  });
};

export const editJob = async ({
  jobId,
  data,
}: {
  jobId: number;
  data: EditJobData;
}): Promise<Job> => {
  const response = await fetchClient<{
    message?: string;
    data?: EditJobData;
  }>(`/jobs/${jobId}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
  if (response && response.data) {
    return { ...data, jobId } as Job;
  }
  throw new Error(response?.message || "Failed to update job");
};

export const softDeleteJob = async (jobId: number): Promise<void> => {
  return fetchClient<void>(`/jobs/${jobId}`, {
    method: "PATCH",
    body: JSON.stringify({ deletedAt: new Date() }),
  });
};

export const fetchJobs = async (): Promise<Job[]> => {
  return fetchClient<Job[]>("/jobs");
};

export const fetchJob = async (jobId: number): Promise<Job> => {
  return fetchClient<Job>(`/jobs/${jobId}`);
};

export const fetchJobsByClient = async (clientId: string): Promise<Job[]> => {
  return fetchClient<Job[]>(`/jobs/created-by/${clientId}`);
};

export const searchJobsByTitle = async (title: string): Promise<Job[]> => {
  return fetchClient<Job[]>(`/jobs/search?title=${title}`);
};
