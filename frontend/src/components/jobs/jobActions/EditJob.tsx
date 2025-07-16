import React from "react";
import Modal from "../../UI/Modal";
import JobForm from "../JobForm";
import { useUpdateJob } from "../../../hooks/useJobs";
import { useToast } from "../../../contexts/ToastManager";
import { Job, UpdateJobData } from "../../../types/JobTypes";

interface EditJobModalProps {
  job: Job;
  onSuccess?: () => void;
  onClose: () => void;
}

const EditJobModal: React.FC<EditJobModalProps> = ({
  job,
  onClose,
  onSuccess,
}) => {
  const { addToast } = useToast();
  const updateJobMutation = useUpdateJob(
    () => {
      addToast("Job updated successfully!");
      onSuccess?.();
      onClose();
    },
    (errMsg) => {
      console.error("Error updating job:", errMsg);
    }
  );

  const handleUpdateJob = (updatedJob: UpdateJobData) => {
    updateJobMutation.mutate({ jobId: job.jobId, data: updatedJob });
  };

  return (
    <Modal isOpen={true} onClose={onClose} title="Edit Job">
      <JobForm
        userId={job.clientId}
        initialJobDetails={{
          jobId: job.jobId,
          title: job.title,
          description: job.description,
          budget: job.budget,
          deadline: new Date(job.deadline),
        }}
        onSubmitSuccess={handleUpdateJob}
        onClose={onClose}
      />
    </Modal>
  );
};

export default EditJobModal;
