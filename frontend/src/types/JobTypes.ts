export interface Job {
  job_id: number;
  client_id: string;
  title: string;
  description: string;
  budget: number;
  deadline: Date;
  client_username: string;
}

export interface CreateJobData {
  job_id: number;
  title: string;
  description: string;
  budget: number;
  deadline: Date;
  client_id: string;
}

export type UpdateJobData = Partial<
  Omit<Job, "job_id" | "client_username" | "client_id">
>;
