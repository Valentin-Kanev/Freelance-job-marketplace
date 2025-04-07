export type CustomResponse<T = any> = {
  data?: T;
  error?: string;
  message?: string;
};
