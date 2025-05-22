import React, { useEffect, useState } from "react";
import Button from "../UI/Button";
import JobApplicationsList from "../jobApplications/JobApplicationsList";
import EditJobModal from "./jobActions/EditJob";
import DeleteJob from "./jobActions/DeleteJob";
import ApplyForJobModal from "./jobActions/ApplyForJobModal";
import { Link } from "react-router-dom";
import { formatBudget } from "../../utils/formatBudget";
import { useFetchJob } from "../../hooks/useJobs";

interface JobDetailsProps {
  job_id: number;
  userId: string;
  userType: string;
  isInModal?: boolean;
  currentModal?: string | null;
  onJobUpdate?: () => void;
}

const JobDetails: React.FC<JobDetailsProps> = ({
  job_id,
  userId,
  userType,
  isInModal = false,
  currentModal = null,
  onJobUpdate,
}) => {
  const [activeModal, setActiveModal] = useState<
    "edit" | "delete" | "apply" | null
  >(null);
  const { data: job, isLoading, isError } = useFetchJob(job_id);

  useEffect(() => {
    if (currentModal !== null) {
      setActiveModal(null);
    }
  }, [currentModal]);

  if (isLoading) {
    return (
      <div className="text-center mt-10 text-gray-500">
        Loading job details...
      </div>
    );
  }

  if (isError || !job) {
    return (
      <div className="text-center mt-10 text-red-500">
        Failed to load job details.
      </div>
    );
  }

  const showEditDeleteButtons =
    !isInModal &&
    currentModal === null &&
    userType === "client" &&
    userId === job.client_id;

  const showApplyButton =
    !isInModal && currentModal === null && userType === "freelancer";

  return (
    <div
      className="w-full overflow-y-auto p-4 scroll-smooth"
      style={{
        maxHeight: "85vh",
        scrollbarWidth: "thin",
        scrollbarColor: "#4A5568 #E2E8F0",
      }}
    >
      <h2 className="text-4xl font-bold mb-4 break-all overflow-hidden">
        {job.title}
      </h2>
      <Link
        to={`/profiles/${job.client_id}`}
        className="text-blue-600 hover:text-blue-800 underline"
      >
        {job.client_username}
      </Link>
      <p className="text-lg font-semibold text-green-600 mb-4">
        💵 Budget: {formatBudget(job.budget)}
      </p>
      <p className="text-md text-gray-600 mb-4">
        📅 Deadline: {new Date(job.deadline).toLocaleDateString()}
      </p>
      <div className="flex justify-left gap-4 mb-4">
        {showEditDeleteButtons && (
          <>
            <Button
              label="Edit"
              onClick={() => setActiveModal("edit")}
              className="bg-blue-600 text-white hover:bg-blue-700"
            />
            <Button
              label="Delete"
              onClick={() => setActiveModal("delete")}
              className="bg-red-600 text-white hover:bg-red-700"
            />
          </>
        )}
        {showApplyButton && (
          <Button
            label="Apply"
            onClick={() => setActiveModal("apply")}
            className="bg-green-600 text-white hover:bg-green-700"
          />
        )}
      </div>
      <p className="text-xl text-gray-800 font-semibold">About the Job:</p>
      <p className="text-md text-gray-600 mb-4 border-b border-gray-300 pb-2 break-all overflow-hidden">
        {job.description}
      </p>

      {userId === job.client_id && !isInModal && (
        <JobApplicationsList job_id={job.job_id} creatorId={job.client_id} />
      )}

      {activeModal === "edit" && (
        <EditJobModal
          job={job}
          onClose={() => setActiveModal(null)}
          onSuccess={onJobUpdate}
        />
      )}
      {activeModal === "delete" && (
        <DeleteJob
          job_id={job.job_id}
          isOpen={activeModal === "delete"}
          onSuccess={onJobUpdate}
          onClose={() => setActiveModal(null)}
        />
      )}
      {activeModal === "apply" && (
        <ApplyForJobModal
          job_id={job.job_id}
          onClose={() => setActiveModal(null)}
        />
      )}
    </div>
  );
};

export default JobDetails;
