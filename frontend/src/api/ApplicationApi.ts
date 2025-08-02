import {
  Application,
  MyApplication,
} from "../components/jobApplications/ApplicationTypes";
import { fetchClient } from "./apiUtils/fetchClientApi";

export const applyForJob = async (
  jobId: number,
  data: { freelancerId: string; coverLetter: string }
): Promise<Application> => {
  return fetchClient<Application>(`/jobs/${jobId}/apply`, {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const fetchJobApplications = async (
  jobId: number
): Promise<Application[]> => {
  return fetchClient<Application[]>(`/jobs/${jobId}/applications`);
};

export const fetchMyApplications = async (): Promise<MyApplication[]> => {
  return fetchClient<MyApplication[]>(`/applications/my-applications`);
};
