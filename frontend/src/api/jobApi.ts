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
  client_id: string;
  title: string;
  description: string;
  budget: number;
  deadline: string;
}

export interface UpdateJobData {
  title?: string;
  description?: string;
  budget?: number;
  deadline?: string;
}

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

    console.error(`Fetch error: ${errorMessage}`, {
      status: response.status,
      url,
    });
    throw new Error(errorMessage);
  }

  return response.json();
};

export const fetchJobs = async (): Promise<Job[]> => {
  return fetchClient<Job[]>("/jobs");
};

export const createJob = async (jobData: {
  client_id: string;
  title: string;
  description: string;
  budget: number;
  deadline: string;
}) => {
  const token = localStorage.getItem("token");

  const response = await fetch("http://localhost:3000/jobs", {
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
  try {
    // Ensure deadline is properly formatted
    if (data.deadline) {
      data.deadline = new Date(data.deadline).toISOString();
    }
    const response = await fetchClient<Job>(`/jobs/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log("Updated job:", response);
    return response;
  } catch (error) {
    console.error("Error updating job:", error);
    throw error;
  }
};

export const deleteJob = async (id: string): Promise<void> => {
  return fetchClient<void>(`/jobs/${id}`, {
    method: "DELETE",
  });
};

export const fetchJob = async (id: string): Promise<Job> => {
  return fetchClient<Job>(`/jobs/${id}`);
};
