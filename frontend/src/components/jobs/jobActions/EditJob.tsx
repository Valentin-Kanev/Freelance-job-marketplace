import React from "react";
import Modal from "../../UI/Modal";
import JobForm from "../JobForm";
import { useUpdateJob } from "../../../hooks/useJobs";
import { useToast } from "../../../contexts/ToastManager";
import { Job, UpdateJobData } from "../../../types/JobTypes";

interface EditJobModalProps {
  job: Job;
  onClose: () => void;
}

const EditJobModal: React.FC<EditJobModalProps> = ({ job, onClose }) => {
  const updateJobMutation = useUpdateJob();
  const { addToast } = useToast();

  const handleUpdateJob = (updatedJob: UpdateJobData) => {
    updateJobMutation.mutate(
      { job_id: job.job_id, data: updatedJob },
      {
        onSuccess: () => {
          addToast("Job updated successfully!");
        },

        onError: (err) => console.error("Error updating job:", err.message),
      }
    );
  };

  return (
    <Modal isOpen={true} onClose={onClose} title="Edit Job">
      <JobForm
        userId={job.client_id}
        initialJobDetails={{
          // client_id: job.client_id,
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
