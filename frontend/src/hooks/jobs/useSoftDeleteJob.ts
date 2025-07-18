import { useMutation, useQueryClient } from "react-query";
import { softDeleteJob } from "../../api/jobApi";

export const useSoftDeleteJob = () => {
  const queryClient = useQueryClient();

  return useMutation((jobId: number) => softDeleteJob(jobId), {
    onSuccess: () => {
      queryClient.invalidateQueries("jobs");
    },
    onError: (error: Error) => {
      console.error("Error deleting job:", error.message);
    },
  });
};
