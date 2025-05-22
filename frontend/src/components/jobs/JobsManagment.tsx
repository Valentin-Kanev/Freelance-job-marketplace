import { useState } from "react";
import { useJobs } from "../../hooks/useJobs";
import { useAuth } from "../../contexts/AuthContext";
import JobListWithDetails from "./JobListWithDetails";
import Modal from "../UI/Modal";
import JobForm from "./JobForm";

export const initialJobDetails = {
  job_id: 0,
  title: "",
  description: "",
  budget: 0,
  deadline: new Date(),
  client_id: "",
};

const JobManagement: React.FC = () => {
  const { data: jobs, isLoading, isError, error } = useJobs();
  const { isLoggedIn, userId } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className=" bg-gray-50  flex-col items-center overflow-hidden h-screen no-scrollbar">
      <JobListWithDetails
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
            onSubmitSuccess={() => setIsModalOpen(false)}
            onClose={() => setIsModalOpen(false)}
          />
        )}
      </Modal>
    </div>
  );
};

export default JobManagement;
