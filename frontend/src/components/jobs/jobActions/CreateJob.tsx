import React, { useState } from "react";
import Modal from "../../UI/Modal";
import JobForm from "../JobForm";
import { useToast } from "../../../contexts/ToastManager";
import { initialJobDetails } from "../../../utils/initialJobDetails";
import StatusMessage from "../../UI/StatusMessage";

interface CreateJobProps {
  userId: string;
  isLoggedIn: boolean;
}

const CreateJob: React.FC<CreateJobProps> = ({ userId, isLoggedIn }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { addToast } = useToast();

  return (
    <div>
      <button
        onClick={() => setIsModalOpen(true)}
        className="text-white hover:text-gray-400"
      >
        Create Job
      </button>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={isLoggedIn && userId ? "Create a New Job" : "Access Denied"}
      >
        {isLoggedIn && userId ? (
          <JobForm
            userId={userId}
            initialJobDetails={initialJobDetails}
            onSubmitSuccess={() => {
              addToast("Job created successfully!");
              setIsModalOpen(false);
            }}
            onClose={() => setIsModalOpen(false)}
          />
        ) : (
          <StatusMessage message="You must be logged in to create a job." />
        )}
      </Modal>
    </div>
  );
};

export default CreateJob;
