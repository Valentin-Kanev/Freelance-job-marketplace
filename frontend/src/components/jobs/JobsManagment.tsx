import React, { useState } from "react";
import { useJobs } from "../../hooks/useJobs";
import Modal from "../UI/Modal";
import JobList from "./JobsList";
import JobForm from "./JobForm";
import Button from "../UI/Button";
import { useAuth } from "../../contexts/AuthContext";

const JobManagement: React.FC = () => {
  const { data: jobs, isLoading, isError, error } = useJobs();
  const { isLoggedIn, userId, userType } = useAuth(); // Fetching from AuthContext
  const [isModalOpen, setIsModalOpen] = useState(false);

  const initialJobDetails = {
    id: "",
    title: "",
    description: "",
    budget: 0,
    deadline: "",
  };

  const handleSubmitSuccess = (updatedJob: any) => {};

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-8 px-4">
      {/* Show button only for logged-in clients */}
      {isLoggedIn && userType === "client" && (
        <Button
          label="Create Job"
          onClick={() => setIsModalOpen(true)}
          className="bg-primary text-white hover:bg-blue-700 mb-8"
        />
      )}

      <JobList
        jobs={jobs || []}
        isLoading={isLoading}
        isError={isError}
        error={error}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create Job"
      >
        {isLoggedIn && userId && (
          <JobForm
            userId={userId}
            initialJobDetails={initialJobDetails}
            onSubmitSuccess={handleSubmitSuccess}
            onClose={() => setIsModalOpen(false)}
          />
        )}
      </Modal>
    </div>
  );
};

export default JobManagement;
