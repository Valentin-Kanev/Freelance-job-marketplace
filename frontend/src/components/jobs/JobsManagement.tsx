import { useState } from "react";
import { useFetchJobs } from "../../hooks/jobs/useFetchJobs";
import { useAuth } from "../../contexts/AuthContext";
import JobListWithDetails from "./JobListWithDetails";
import Modal from "../UI/Modal";
import JobForm from "./JobForm";
import { initialJobDetails } from "../../utils/initialJobDetails";
import { useCreateJob } from "../../hooks/jobs/useCreateJob";

const JobManagement: React.FC = () => {
  const { data: jobs, isLoading, isError, error } = useFetchJobs();
  const { isLoggedIn, loggedInUserId } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [serverError, setServerError] = useState<string | undefined>(undefined);

  const { mutate: createJob, isLoading: isCreating } = useCreateJob();

  return (
    <div className="bg-gray-50 flex-col items-center overflow-hidden h-screen no-scrollbar">
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
        {isLoggedIn && loggedInUserId && (
          <JobForm
            isUpdate={false}
            defaultValues={initialJobDetails}
            onSubmit={(data) =>
              createJob({ ...data, clientId: loggedInUserId })
            }
            isLoading={isCreating}
            serverError={serverError}
            onClose={() => setIsModalOpen(false)}
            onSuccess={() => {
              setIsModalOpen(false);
              setServerError(undefined);
            }}
          />
        )}
      </Modal>
    </div>
  );
};

export default JobManagement;
