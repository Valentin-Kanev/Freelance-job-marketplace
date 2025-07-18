import Modal from "../../UI/Modal";
import JobForm from "../JobForm";
import { useToast } from "../../../contexts/ToastManager";
import { Job, editJobData } from "../../../types/JobTypes";
import { useEditJob } from "../../../hooks/jobs/useEditJob";
import { useState } from "react";

const EditJob: React.FC<{
  job: Job;
  onSuccess?: () => void;
  onClose: () => void;
}> = ({ job, onSuccess, onClose }) => {
  const [serverError, setServerError] = useState<string | undefined>();
  const { addToast } = useToast();

  const mutation = useEditJob(
    () => {
      addToast("Job updated successfully!");
      onSuccess?.();
      onClose();
    },
    (msg) => setServerError(msg)
  );

  return (
    <Modal isOpen={true} onClose={onClose} title="Update Job">
      <JobForm
        isUpdate={true}
        defaultValues={{
          title: job.title,
          description: job.description,
          budget: job.budget,
          deadline: new Date(job.deadline),
        }}
        onSubmit={(data) =>
          mutation.mutate({
            jobId: job.jobId,
            data: Object.fromEntries(
              Object.entries(data).filter(([_, v]) => v !== undefined)
            ) as editJobData,
          })
        }
        isLoading={mutation.isLoading}
        serverError={serverError}
        onClose={onClose}
      />
    </Modal>
  );
};

export default EditJob;
