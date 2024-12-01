import React, { useEffect, useState } from "react";
import Button from "../UI/Button";
import JobApplicationsList from "../jobApplications/JobApplicationsList";
import EditJobModal from "./jobActions/EditJob";
import DeleteJob from "./jobActions/DeleteJob";
import ApplyForJob from "./jobActions/ApplyForJob";

interface JobDetailsProps {
  job: any | null;
  userId: string;
  userType: string;
  isInModal?: boolean;
  currentModal?: string | null; // Track which modal is open
  onJobUpdate?: () => void;
}

const JobDetails: React.FC<JobDetailsProps> = ({
  job,
  userId,
  userType,
  isInModal = false,
  currentModal = null, // Default to no modal being open
  onJobUpdate,
}) => {
  const [activeModal, setActiveModal] = useState<
    "edit" | "delete" | "apply" | null
  >(null);

  useEffect(() => {
    // Reset local modal state if a parent modal is active
    if (currentModal !== null) {
      setActiveModal(null);
    }
  }, [currentModal]);

  if (!job) {
    return (
      <div className="text-center text-gray-500 flex items-center justify-center w-full h-full">
        <div>
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
    currentModal === null && // Ensure no modal is open
    userType === "client" &&
    userId === job.client_id;

  const showApplyButton =
    !isInModal && currentModal === null && userType === "freelancer";

  return (
    <div className="w-full max-h-screen">
      <h2 className="text-4xl font-bold mb-4">{job.title}</h2>
      <p className="text-lg text-gray-700 mb-4">
        Posted by: {job.client_username}
      </p>
      <p className="text-lg font-semibold text-green-600 mb-4">
        💵 Budget: ${job.budget}
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
        <JobApplicationsList jobId={job.id} creatorId={job.client_id} />
      )}

      {activeModal === "edit" && (
        <EditJobModal job={job} onClose={() => setActiveModal(null)} />
      )}
      {activeModal === "delete" && (
        <DeleteJob
          jobId={job.id}
          onSuccess={onJobUpdate}
          onClose={() => setActiveModal(null)}
        />
      )}
      {activeModal === "apply" && (
        <ApplyForJob jobId={job.id} onClose={() => setActiveModal(null)} />
      )}
    </div>
  );
};

export default JobDetails;
