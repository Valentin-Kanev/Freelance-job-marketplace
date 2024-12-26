import React from "react";
import Modal from "../../UI/Modal";
import Button from "../../UI/Button";
import { useDeleteJob } from "../../../hooks/useJobs";
import { useToast } from "../../ToastManager";

interface DeleteJobModalProps {
  jobId: string;
  onSuccess?: () => void;
  onClose: () => void;
}

const DeleteJob: React.FC<DeleteJobModalProps & { isOpen: boolean }> = ({
  jobId,
  onSuccess,
  onClose,
  isOpen,
}) => {
  const deleteJobMutation = useDeleteJob();
  const { addToast } = useToast();

  const handleDelete = () => {
    deleteJobMutation.mutate(jobId, {
      onSuccess: () => {
        addToast("Job deleted successfully!");
        if (onSuccess) onSuccess();
        onClose();
      },
      onError: (err) => console.error("Error deleting job:", err.message),
    });
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Confirm Deletion">
      <div className="space-y-4 text-center">
        <p>Are you sure you want to delete this job?</p>
        <div className="flex justify-center space-x-4">
          <Button
            label="Delete"
            onClick={handleDelete}
            className="bg-red-600 text-white hover:bg-red-700"
          />
          <Button
            label="Cancel"
            onClick={onClose}
            className="bg-gray-600 text-white hover:bg-gray-700"
          />
        </div>
      </div>
    </Modal>
  );
};

export default DeleteJob;
