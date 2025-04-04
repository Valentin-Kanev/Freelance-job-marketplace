import React, { useEffect, useState } from "react";
import Button from "../UI/Button";
import JobApplicationsList from "../jobApplications/JobApplicationsList";
import EditJobModal from "./jobActions/EditJob";
import DeleteJob from "./jobActions/DeleteJob";
import ApplyForJob from "./jobActions/ApplyForJob";
import { Link } from "react-router-dom";
import { formatBudget } from "../../utils/formatBudget";
import { Job } from "../../types/JobTypes";

interface JobDetailsProps {
  job: Job | null;
  userId: string;
  userType: string;
  isInModal?: boolean;
  currentModal?: string | null;
  onJobUpdate?: () => void;
}

const JobDetails: React.FC<JobDetailsProps> = ({
  job,
  userId,
  userType,
  isInModal = false,
  currentModal = null,
  onJobUpdate,
}) => {
  const [activeModal, setActiveModal] = useState<
    "edit" | "delete" | "apply" | null
  >(null);

  useEffect(() => {
    if (currentModal !== null) {
      setActiveModal(null);
    }
  }, [currentModal]);

  if (!job) {
    return (
      <div className="flex items-center justify-center text-center text-gray-500 h-screen ">
        <div className="space-y-4 mt-[-15vh]">
          <h3 className="text-2xl">Select a job to view details</h3>
          <p className="text-md">
            Click on a job from the list to see more information.
          </p>
        </div>
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
      className="w-full overflow-y-auto p-4"
      style={{
        maxHeight: "85vh",
        scrollbarWidth: "thin",
        scrollbarColor: "#4A5568 #E2E8F0",
      }}
    >
      <h2 className="text-4xl font-bold mb-4">{job.title}</h2>
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
      <p className="text-md text-gray-600 mb-4 border-b border-gray-300 pb-2">
        {job.description}
      </p>

      {userId === job.client_id && !isInModal && (
        <JobApplicationsList job_id={job.job_id} creatorId={job.client_id} />
      )}

      {activeModal === "edit" && (
        <EditJobModal job={job} onClose={() => setActiveModal(null)} />
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
        <ApplyForJob job_id={job.job_id} onClose={() => setActiveModal(null)} />
      )}
    </div>
  );
};

export default JobDetails;
