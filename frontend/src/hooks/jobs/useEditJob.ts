import { useMutation, useQueryClient } from "react-query";
import { Job, editJobData } from "../../types/JobTypes";
import { editJob } from "../../api/jobApi";

export const useEditJob = (
  onSuccessCallback?: (editedJob: Job) => void,
  onErrorCallback?: (errorMessage: string) => void
) => {
  const queryClient = useQueryClient();

  return useMutation(
    ({ jobId, data }: { jobId: number; data: editJobData }) => {
      return editJob({ jobId, data });
    },
    {
      onSuccess: (editedJob) => {
        queryClient.invalidateQueries(["job", editedJob.jobId]);
        queryClient.invalidateQueries("jobs");
        onSuccessCallback?.(editedJob);
      },
      onError: (error: Error) => {
        console.error("Error updating job:", error.message);
        onErrorCallback?.(error.message);
      },
    }
  );
};
