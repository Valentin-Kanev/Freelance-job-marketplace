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
  const updateJobMutation = useUpdateJob(
    () => {
      addToast("Job updated successfully!");
      if (onSuccess) onSuccess();
      onClose();
    },
    (errMsg) => {
      addToast("Error updating job");
      console.error("Error updating job:", errMsg);
    }
  );
  const { addToast } = useToast();

  const handleUpdateJob = (updatedJob: UpdateJobData) => {
    const filteredJob = Object.fromEntries(
      Object.entries(updatedJob).filter(([_, v]) => v !== undefined)
    );
    updateJobMutation.mutate({ job_id: job.job_id, data: filteredJob });
  };

  return (
    <Modal isOpen={true} onClose={onClose} title="Edit Job">
      <JobForm
        userId={job.client_id}
        initialJobDetails={{
          job_id: job.job_id,
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
