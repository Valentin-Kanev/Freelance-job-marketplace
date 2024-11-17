import React, { useState } from "react";
import { useApplyForJob } from "../../hooks/useApplication";

interface JobApplicationProps {
  jobId: string;
  onClose: () => void;
}

const JobApplication: React.FC<JobApplicationProps> = ({ jobId, onClose }) => {
  const [coverLetter, setCoverLetter] = useState<string>("");
  const { mutate: applyForJob, isLoading } = useApplyForJob();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const freelancerId = localStorage.getItem("userId");
    if (!freelancerId) {
      alert("You need to be logged in to apply for this job.");
      return;
    }

    applyForJob({
      jobId,
      data: { freelancer_id: freelancerId, cover_letter: coverLetter },
    });
    onClose();
  };

  const handleClickOutside = (event: React.MouseEvent) => {
    // If the click is outside the modal content, close the modal
    const target = event.target as HTMLElement;
    if (target.id === "modal-overlay") {
      onClose();
    }
  };

  return (
    <div
      id="modal-overlay"
      className="fixed inset-0 flex items-center justify-center bg-gray-600 bg-opacity-75"
      onClick={handleClickOutside}
    >
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-lg w-full">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Apply for Job
        </h2>
        <form onSubmit={handleSubmit}>
          <textarea
            value={coverLetter}
            onChange={(e) => setCoverLetter(e.target.value)}
            placeholder="Enter your cover letter here..."
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 mb-4"
            rows={6}
            required
          />
          <div className="flex justify-between items-center">
            <button
              type="submit"
              disabled={isLoading}
              className="bg-blue-600 text-white py-2 px-4 rounded-full hover:bg-blue-700 transition duration-200 ease-in-out"
            >
              {isLoading ? "Submitting..." : "Submit"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="text-red-500 hover:text-red-700 transition duration-200"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JobApplication;
