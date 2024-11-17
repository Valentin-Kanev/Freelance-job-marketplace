// Job.ts

export interface Job {
  id: string;
  client_id: string;
  title: string;
  description: string;
  budget: number;
  deadline: string;
  clientUsername: string; // Add the clientUsername property
}

export interface CreateJobData {
  client_id: string; // Change to string for UUID compatibility
  title: string;
  description: string;
  budget: number;
  deadline: string; // This should be a valid date string
}

export interface UpdateJobData {
  title?: string; // Make optional for partial updates
  description?: string; // Make optional for partial updates
  budget?: number; // Make optional for partial updates
  deadline?: string; // Make optional for partial updates
}

const BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:3000"; // Use environment variable

const fetchClient = async <T>(
  url: string,
  options?: RequestInit
): Promise<T> => {
  const token = localStorage.getItem("token"); // Assuming you store the token in localStorage
  const response = await fetch(`${BASE_URL}${url}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`, // Include the token in Authorization header
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

    // Log the error for debugging purposes
    console.error(`Fetch error: ${errorMessage}`, {
      status: response.status,
      url,
    });
    throw new Error(errorMessage);
  }

  return response.json();
};

// Fetch all jobs
export const fetchJobs = async (): Promise<Job[]> => {
  return fetchClient<Job[]>("/jobs");
};

// Create a new job
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
      Authorization: `Bearer ${token}`, // Ensure the token is sent in the headers
    },
    body: JSON.stringify(jobData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to create job");
  }

  return response.json();
};

// Update an existing job by ID
export const updateJob = async (
  id: string,
  data: UpdateJobData
): Promise<Job> => {
  return fetchClient<Job>(`/jobs/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });
};

// Delete a job by ID
export const deleteJob = async (id: string): Promise<void> => {
  // Change id to string if UUID
  return fetchClient<void>(`/jobs/${id}`, {
    method: "DELETE",
  });
};

export const fetchJob = async (id: string): Promise<Job> => {
  return fetchClient<Job>(`/jobs/${id}`); // Ensure this calls the correct route
};
