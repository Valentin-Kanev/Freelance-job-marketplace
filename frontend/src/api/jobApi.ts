import { CreateJobData, Job, UpdateJobData } from "../types/JobTypes";

const BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:3000";

const fetchClient = async <T>(
  url: string,
  options?: RequestInit
): Promise<T> => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${BASE_URL}${url}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const contentType = response.headers.get("Content-Type");
    let errorMessage = "Something went wrong";

    if (contentType && contentType.includes("application/json")) {
      const errorData = await response.json();
      errorMessage = errorData?.message || errorMessage;
    } else {
      errorMessage = `Error ${response.status}: ${response.statusText}`;
    }

    throw new Error(errorMessage);
  }

  return response.json();
};

export const fetchJobs = async (): Promise<Job[]> => {
  return fetchClient<Job[]>("/jobs");
};

export const createJob = async (jobData: CreateJobData): Promise<Job> => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${BASE_URL}/jobs`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(jobData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to create job");
  }

  return response.json();
};

export const updateJob = async (
  job_id: number,
  data: UpdateJobData
): Promise<Job> => {
  return fetchClient<Job>(`/jobs/${job_id}`, {
    method: "PUT",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const deleteJob = async (job_id: number): Promise<void> => {
  return fetchClient<void>(`/jobs/${job_id}`, {
    method: "PATCH",
    body: JSON.stringify({ deleted_at: new Date() }),
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const fetchJob = async (job_id: number): Promise<Job> => {
  return fetchClient<Job>(`/jobs/${job_id}`);
};

export const fetchJobsByClient = async (clientId: string): Promise<Job[]> => {
  return fetchClient<Job[]>(`/jobs/created-by/${clientId}`);
};

export const searchJobsByTitle = async (title: string): Promise<Job[]> => {
  return fetchClient<Job[]>(`/jobs/search?title=${title}`);
};
