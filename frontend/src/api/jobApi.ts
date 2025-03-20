export interface Job {
  id: string;
  client_id: string;
  title: string;
  description: string;
  budget: number;
  deadline: string;
  clientUsername: string;
}

export interface CreateJobData {
  title: string;
  description: string;
  budget: number;
  deadline: string;
  client_id: string;
}

export type UpdateJobData = Partial<
  Omit<Job, "id" | "clientUsername" | "client_id">
>;

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
  console.log("Sending job data:", jobData);

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
  id: string,
  data: UpdateJobData
): Promise<Job> => {
  if (data.deadline) {
    data.deadline = new Date(data.deadline).toISOString();
  }
  return fetchClient<Job>(`/jobs/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const deleteJob = async (id: string): Promise<void> => {
  return fetchClient<void>(`/jobs/${id}`, {
    method: "DELETE",
  });
};

export const fetchJob = async (id: string): Promise<Job> => {
  return fetchClient<Job>(`/jobs/${id}`);
};

export const fetchJobsByClient = async (clientId: string): Promise<Job[]> => {
  return fetchClient<Job[]>(`/jobs/created-by/${clientId}`);
};

export const searchJobsByTitle = async (title: string): Promise<Job[]> => {
  return fetchClient<Job[]>(`/jobs/search?title=${encodeURIComponent(title)}`);
};
