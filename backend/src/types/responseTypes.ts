export type CustomResponse<T = any> = {
  data?: T | null;
  error?: string;
  message?: string;
};

export type JobUpdateResponse = {
  job_id: number;
  title: string;
  description: string;
  budget: number;
  deadline: string | null;
  client_id: number;
  deleted_at: string | null;
};
