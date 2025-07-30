import Modal from "../../UI/Modal";
import JobForm from "../JobForm";
import { useToast } from "../../../contexts/ToastManager";
import { Job, EditJobData } from "../JobTypes";
import { useEditJob } from "../../../hooks/jobs/useEditJob";
import { useState } from "react";

const EditJob: React.FC<{
  job: Job;
  onSuccess?: () => void;
  onClose: () => void;
  handleOnSubmit?: (data: EditJobData) => void;
}> = ({ job, onSuccess, onClose }) => {
  const [serverError, setServerError] = useState<string | undefined>();
  const { addToast } = useToast();

  const editJobMutation = useEditJob(
    () => {
      addToast("Job updated successfully!");
      onSuccess?.();
      onClose();
    },
    (errorMessage: string) => setServerError(errorMessage)
  );

  const handleOnSubmit = (data: EditJobData) => {
    editJobMutation.mutate({
      jobId: job.jobId,
      data: Object.fromEntries(
        Object.entries(data).filter(([_, v]) => v !== undefined)
      ) as EditJobData,
    });
  };

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
        onSubmit={handleOnSubmit}
        isLoading={editJobMutation.isLoading}
        serverError={serverError}
        onClose={onClose}
        onSuccess={onSuccess}
      />
    </Modal>
  );
};

export default EditJob;
