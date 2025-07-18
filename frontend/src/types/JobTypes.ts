export type Job = {
  job_id: number;
  client_id: string;
  title: string;
  description: string;
  budget: number;
  deadline: Date;
  client_username: string;
};

export type CreateJobData = Omit<Job, "job_id" | "client_username">;

export type UpdateJobData = Partial<
  Omit<Job, "job_id" | "client_username" | "client_id">
>;

export const initialJobDetails = {
  job_id: 0,
  title: "",
  description: "",
  budget: 0,
  deadline: new Date(),
  client_id: "",
};
