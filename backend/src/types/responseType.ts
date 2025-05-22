export type CustomResponse<T = any> = {
  data?: T | null;
  error?: string;
  message?: string;
};
