import React, { useState } from "react";
import Modal from "../../UI/Modal";
import JobForm from "../JobForm";
import { useToast } from "../../ToastManager";

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
            initialJobDetails={{
              id: "",
              title: "",
              description: "",
              budget: 0,
              deadline: "",
            }}
            onSubmitSuccess={(job) => {
              addToast("Job created successfully!");
              setIsModalOpen(false);
            }}
            onClose={() => setIsModalOpen(false)}
          />
        ) : (
          <p className="text-center text-gray-700">
            You must be logged in to create a job.
          </p>
        )}
      </Modal>
    </div>
  );
};

export default CreateJob;
