import { useMutation, useQueryClient } from "react-query";
import { Application } from "../../types/ApplicationTypes";
import { applyForJob } from "../../api/applicationApi";

export const useApplyForJob = (
  onSuccess?: (data: Application) => void,
  onError?: (error: Error) => void
) => {
  const queryClient = useQueryClient();
  return useMutation(
    ({
      jobId,
      data,
    }: {
      jobId: number;
      data: { freelancerId: string; coverLetter: string };
    }) => applyForJob(jobId, data),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries("myApplications");
        onSuccess?.(data);
      },
      onError: (error: Error) => {
        console.error("Error applying for job:", error.message);
        onError?.(error);
      },
    }
  );
};
