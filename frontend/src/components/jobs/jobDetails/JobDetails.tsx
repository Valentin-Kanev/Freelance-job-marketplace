import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useJob, useUpdateJob, useDeleteJob } from "../../../hooks/useJobs";
import Modal from "../../UI/Modal";
import JobForm from "../JobForm";
import JobDetailsInfo from "./JobDetailsInfo";
import Button from "../../UI/Button";
import JobApplication from "../../jobApplications/JobApplication";
import JobApplicationsList from "../../jobApplications/JobApplicationsList";

const JobDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data: job, isLoading, isError, error } = useJob(id!);
  const updateJobMutation = useUpdateJob();
  const deleteJobMutation = useDeleteJob();
  const navigate = useNavigate();

  const [activeModal, setActiveModal] = useState<
    "edit" | "delete" | "apply" | null
  >(null);

  // Get the logged-in user from localStorage directly
  const userId = localStorage.getItem("userId") || "";
  const userType = localStorage.getItem("userType") || "";

  if (isLoading)
    return <div className="text-center text-gray-500">Loading...</div>;
  if (isError)
    return (
      <div className="text-center text-red-500">Error: {error?.message}</div>
    );
  if (!job)
    return <div className="text-center text-red-500">Job not found</div>;

  const handleEditJob = () => setActiveModal("edit");
  const handleDeleteJob = () => setActiveModal("delete");
  const handleApplyJob = () => setActiveModal("apply");

  const handleUpdateJob = (updatedJob: any) => {
    if (!job.id) return;
    updateJobMutation.mutate(
      { id: job.id, data: updatedJob },
      {
        onSuccess: () => setActiveModal(null),
        onError: (err) => console.error("Error updating job:", err.message),
      }
    );
  };

  const handleDeleteJobAction = () => {
    if (!job.id) return;
    deleteJobMutation.mutate(job.id, {
      onSuccess: () => navigate("/jobs"),
      onError: (err) => console.error("Error deleting job:", err.message),
    });
  };

  const closeModal = () => setActiveModal(null);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-4xl font-semibold text-gray-900 mb-6">
          {job.title}
        </h2>

        <JobDetailsInfo
          title={job.title}
          description={job.description}
          budget={job.budget}
          deadline={job.deadline}
          clientUsername={job.clientUsername}
        />

        {userId === job.client_id && (
          <JobApplicationsList jobId={job.id} creatorId={job.client_id} />
        )}

        <div className="flex justify-end space-x-4 mt-8">
          {userType === "client" && userId === job.client_id && (
            <>
              <Button
                label="Edit Job"
                onClick={handleEditJob}
                className="bg-blue-600 text-white hover:bg-blue-700"
              />
              <Button
                label="Delete Job"
                onClick={handleDeleteJob}
                className="bg-red-600 text-white hover:bg-red-700"
              />
            </>
          )}
          {userType === "freelancer" && (
            <Button
              label="Apply"
              onClick={handleApplyJob}
              className="bg-green-600 text-white hover:bg-green-700"
            />
          )}
        </div>
      </div>

      {/* Edit Job Modal */}
      <Modal
        isOpen={activeModal === "edit"}
        onClose={closeModal}
        title="Edit Job"
      >
        <JobForm
          userId={job.client_id}
          initialJobDetails={{
            id: job.id,
            title: job.title,
            description: job.description,
            budget: job.budget,
            deadline: new Date(job.deadline).toISOString().split("T")[0],
          }}
          onSubmitSuccess={handleUpdateJob}
          onClose={closeModal}
        />
      </Modal>

      {/* Delete Job Modal */}
      <Modal
        isOpen={activeModal === "delete"}
        onClose={closeModal}
        title="Confirm Deletion"
      >
        <div className="space-y-4">
          <p>Are you sure you want to delete this job?</p>
          <div className="flex justify-end space-x-4">
            <Button
              label="Delete"
              onClick={handleDeleteJobAction}
              className="bg-red-600 text-white hover:bg-red-700"
            />
            <Button
              label="Cancel"
              onClick={closeModal}
              className="bg-gray-600 text-white hover:bg-gray-700"
            />
          </div>
        </div>
      </Modal>

      {/* Job Application Modal */}
      <Modal
        isOpen={activeModal === "apply"}
        onClose={closeModal}
        title="Apply for Job"
      >
        <JobApplication jobId={job.id.toString()} onClose={closeModal} />
      </Modal>
    </div>
  );
};

export default JobDetails;
