// src/api/applicationService.ts

export interface Application {
  id: string;
  job_id: string;
  freelancer_id: string;
  username: string;
  cover_letter: string; // Add this property
}

interface ApplyJobData {
  freelancer_id: string; // Change to string
}

// Base URL for applications API
const BASE_URL = "/applications";

const fetchClient = async <T>(
  url: string,
  options?: RequestInit
): Promise<T> => {
  const token = localStorage.getItem("token"); // Retrieve the token from local storage

  const response = await fetch(`${BASE_URL}${url}`, {
    ...options,
    headers: {
      ...options?.headers,
      Authorization: `Bearer ${token}`, // Include the token in the request
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData?.message || "Something went wrong");
  }

  return response.json();
};

// Apply for a job
export const applyForJob = async (
  jobId: string,
  data: ApplyJobData
): Promise<Application> => {
  const formData = new FormData();
  formData.append("freelancer_id", data.freelancer_id);

  return fetchClient<Application>(`/jobs/${jobId}/apply`, {
    method: "POST",
    body: formData,
  });
};

// Fetch job applications for a specific job
export const fetchJobApplications = async (
  jobId: string
): Promise<Application[]> => {
  return fetchClient<Application[]>(`/jobs/${jobId}/applications`);
};
