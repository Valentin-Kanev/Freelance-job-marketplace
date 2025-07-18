import Modal from "../../UI/Modal";
import JobForm from "../JobForm";
import { useToast } from "../../../contexts/ToastManager";
import { initialJobDetails } from "../../../utils/initialJobDetails";
import { useCreateJob } from "../../../hooks/jobs/useCreateJob";
import StatusMessage from "../../UI/StatusMessage";
import { useState } from "react";

const CreateJob: React.FC<{ userId: string; isLoggedIn: boolean }> = ({
  userId,
  isLoggedIn,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [serverError, setServerError] = useState<string | undefined>();
  const { addToast } = useToast();

  const mutation = useCreateJob(
    () => {
      addToast("Job created successfully!");
      setIsModalOpen(false);
    },
    (msg) => setServerError(msg)
  );

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
            isUpdate={false}
            defaultValues={initialJobDetails}
            onSubmit={(data) => mutation.mutate({ ...data, clientId: userId })}
            isLoading={mutation.isLoading}
            serverError={serverError}
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
