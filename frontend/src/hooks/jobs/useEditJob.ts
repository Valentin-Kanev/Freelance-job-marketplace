import { useMutation, useQueryClient } from "react-query";
import { Job, EditJobData } from "../../components/jobs/JobTypes";
import { editJob } from "../../api/jobApi";

export const useEditJob = (
  onSuccessCallback?: (editedJob: Job) => void,
  onErrorCallback?: (errorMessage: string) => void
) => {
  const queryClient = useQueryClient();

  return useMutation(
    ({ jobId, data }: { jobId: number; data: EditJobData }) => {
      return editJob({ jobId, data });
    },
    {
      onSuccess: (editedJob) => {
        queryClient.invalidateQueries(["job", editedJob.jobId]);
        queryClient.invalidateQueries("jobs");
        onSuccessCallback?.(editedJob);
      },
      onError: (error: Error) => {
        onErrorCallback?.(error.message);
      },
    }
  );
};
