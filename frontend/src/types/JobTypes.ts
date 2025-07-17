export type Job = {
  jobId: number;
  clientId: string;
  title: string;
  description: string;
  budget: number;
  deadline: Date;
  clientUsername: string;
};

export type CreateJobData = Omit<Job, "jobId" | "clientUsername">;

export type UpdateJobData = Partial<
  Omit<Job, "jobId" | "clientUsername" | "clientId">
>;
