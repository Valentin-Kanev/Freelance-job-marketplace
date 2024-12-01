import React from "react";
import Modal from "../../UI/Modal";
import JobForm from "../JobForm";
import { useUpdateJob } from "../../../hooks/useJobs";
import { useToast } from "../../ToastManager";

interface EditJobModalProps {
  job: any;
  onClose: () => void;
}

const EditJobModal: React.FC<EditJobModalProps> = ({ job, onClose }) => {
  const updateJobMutation = useUpdateJob();
  const { addToast } = useToast();

  const handleUpdateJob = (updatedJob: any) => {
    updateJobMutation.mutate(
      { id: job.id, data: updatedJob },
      {
        onSuccess: () => {
          addToast("Job updated successfully!");
          // fetchJob(job.id); // Fetch the updated job data
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
          id: job.id,
          title: job.title,
          description: job.description,
          budget: job.budget,
          deadline: new Date(job.deadline).toISOString(),
        }}
        onSubmitSuccess={handleUpdateJob}
        onClose={onClose}
      />
    </Modal>
  );
};

export default EditJobModal;
