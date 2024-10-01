// src/api/applicationService.ts

export interface Application {
  id: number;
  job_id: number;
  freelancer_id: number;
  cover_letter: string;
}

interface ApplyJobData {
  freelancer_id: number;
  cover_letter: string;
}

const BASE_URL = "/applications";

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

// Apply for a job
export const applyForJob = async (
  jobId: number,
  data: ApplyJobData
): Promise<Application> => {
  return fetchClient<Application>(`/jobs/${jobId}/apply`, {
    method: "POST",
    body: JSON.stringify(data),
  });
};

// Fetch all applications for a job
export const fetchJobApplications = async (
  jobId: number
): Promise<Application[]> => {
  return fetchClient<Application[]>(`/jobs/${jobId}/applications`);
};
