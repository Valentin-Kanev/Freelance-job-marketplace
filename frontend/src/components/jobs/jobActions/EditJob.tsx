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
  const updateJobMutation = useUpdateJob();
  const { addToast } = useToast();

  const handleUpdateJob = (updatedJob: UpdateJobData) => {
    const filteredJob = Object.fromEntries(
      Object.entries(updatedJob).filter(([_, v]) => v !== undefined)
    );

    const hasChanged = Object.entries(filteredJob).some(([key, value]) => {
      if (key === "deadline") {
        return (
          new Date(job.deadline).getTime() !== new Date(value as Date).getTime()
        );
      }
      return job[key as keyof Job] !== value;
    });

    // ✅ ADD THIS: Don't send empty data
    if (Object.keys(filteredJob).length === 0) {
      addToast("At least one field must be filled to update.");
      return;
    }

    if (!hasChanged) {
      addToast("No changes detected to update.");
      return;
    }

    console.log("Sending job update:", filteredJob);

    updateJobMutation.mutate(
      { job_id: job.job_id, data: filteredJob },
      {
        onSuccess: () => {
          addToast("Job updated successfully!");
          if (onSuccess) onSuccess();
          onClose();
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
