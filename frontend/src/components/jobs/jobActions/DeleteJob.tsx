import React, { useState } from "react";
import Modal from "../../UI/Modal";
import Button from "../../UI/Button";
import { useDeleteJob } from "../../../hooks/useJobs";
import { useToast } from "../../../contexts/ToastManager";
import { useNavigate } from "react-router-dom";

interface DeleteJobModalProps {
  job_id: number;
  onSuccess?: () => void;
  onClose: () => void;
}

const DeleteJob: React.FC<DeleteJobModalProps & { isOpen: boolean }> = ({
  job_id,
  onSuccess,
  onClose,
  isOpen,
}) => {
  const deleteJobMutation = useDeleteJob();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const handleDelete = () => {
    setError(null);
    deleteJobMutation.mutate(job_id, {
      onSuccess: () => {
        addToast("Job deleted successfully!");
        onSuccess?.();
        onClose();
        navigate("/");
      },
      onError: (err: any) => {
        const message = err?.message || "Error deleting job.";
        setError(message);
      },
    });
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Confirm Deletion">
      <div className="space-y-4 text-center">
        <p>Are you sure you want to delete this job?</p>
        {error && <div className="text-red-600 text-sm">{error}</div>}
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
