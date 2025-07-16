export type CustomResponse<T = any> = {
  data?: T | null;
  error?: string;
  message?: string;
};

export type JobUpdateResponse = {
  jobId: number;
  title: string;
  description: string;
  budget: number;
  deadline: string | null;
  clientId: number;
  deletedAt: string | null;
};
