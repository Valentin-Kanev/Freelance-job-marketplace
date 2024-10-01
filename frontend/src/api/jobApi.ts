// src/api/jobService.ts

export interface Job {
  id: number;
  client_id: number;
  title: string;
  description: string;
  budget: number;
  deadline: string; // Representing date as a string
}

interface CreateJobData {
  client_id: number;
  title: string;
  description: string;
  budget: number;
  deadline: string; // This should be a valid date string
}

export interface UpdateJobData {
  title: string;
  description: string;
  budget: number;
  deadline: string;
}

const BASE_URL = "/Jobs";

const fetchClient = async <T>(
  url: string,
  options?: RequestInit
): Promise<T> => {
  const response = await fetch(`${BASE_URL}${url}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData?.message || "Something went wrong");
  }

  return response.json();
};

// Fetch all jobs
export const fetchJobs = async (): Promise<Job[]> => {
  return fetchClient<Job[]>("/jobs");
};

// Create a new job
export const createJob = async (data: CreateJobData): Promise<Job> => {
  return fetchClient<Job>("/jobs", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

// Update an existing job by ID
export const updateJob = async (
  id: number,
  data: UpdateJobData
): Promise<Job> => {
  return fetchClient<Job>(`/jobs/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};

// Delete a job by ID
export const deleteJob = async (id: number): Promise<void> => {
  return fetchClient<void>(`/jobs/${id}`, {
    method: "DELETE",
  });
};
