import React, { useState } from "react";
import { useJobs } from "../../hooks/useJobs";
import Modal from "../UI/Modal";
import JobForm from "./JobForm";
import JobDashboard from "./JobDashboard";
import { useAuth } from "../../contexts/AuthContext";

export const initialJobDetails = {
  id: "",
  title: "",
  description: "",
  budget: 0,
  deadline: "",
};

const JobManagement: React.FC = () => {
  const { data: jobs, isLoading, isError, error } = useJobs();
  const { isLoggedIn, userId } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-8 px-4">
      {/* Job Dashboard */}
      <JobDashboard
        jobs={jobs || []}
        isLoading={isLoading}
        isError={isError}
        error={error}
      />

      {/* Create Job Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create Job"
      >
        {isLoggedIn && userId && (
          <JobForm
            userId={userId}
            initialJobDetails={initialJobDetails}
            onSubmitSuccess={() => setIsModalOpen(false)}
            onClose={() => setIsModalOpen(false)}
          />
        )}
      </Modal>
    </div>
  );
};

export default JobManagement;
