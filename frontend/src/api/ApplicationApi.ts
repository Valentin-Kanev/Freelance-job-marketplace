import { Application, MyApplication } from "../types/ApplicationTypes";

const BASE_URL = "/applications";

const fetchClient = async <T>(
  url: string,
  options?: RequestInit
): Promise<T> => {
  const token = localStorage.getItem("authToken");

  const response = await fetch(
    `${BASE_URL}${url.startsWith("/") ? url : `/${url}`}`,
    {
      ...options,
      headers: {
        ...options?.headers,
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      const errorData = await response.json();
      throw new Error(errorData?.message || "Something went wrong");
    } else {
      throw new Error("Unexpected response from the server");
    }
  }

  return response.json();
};

export const applyForJob = async (
  job_id: number,
  data: { freelancer_id: string; cover_letter: string }
): Promise<Application> => {
  return fetchClient<Application>(`/jobs/${job_id}/apply`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
};

export const fetchJobApplications = async (
  job_id: number
): Promise<Application[]> => {
  return fetchClient<Application[]>(`/jobs/${job_id}/applications`);
};

export const fetchMyApplications = async (): Promise<MyApplication[]> => {
  return fetchClient<MyApplication[]>(`${BASE_URL}/my-applications`);
};
