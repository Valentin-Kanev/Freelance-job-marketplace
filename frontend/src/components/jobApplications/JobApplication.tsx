import { useState } from "react";
import { useApplyForJob } from "../../hooks/useApplication";
import Button from "../UI/Button";
import { useToast } from "../../contexts/ToastManager";
import StatusMessage from "../UI/StatusMessage";

interface JobApplicationProps {
  job_id: number;
  onClose: () => void;
}

const JobApplication: React.FC<JobApplicationProps> = ({ job_id, onClose }) => {
  const [coverLetter, setCoverLetter] = useState("");
  const freelancerId = localStorage.getItem("userId");
  const { addToast } = useToast();

  const {
    mutate: submitApplication,
    isLoading,
    isError,
    error,
  } = useApplyForJob(
    () => {
      addToast("Application submitted successfully!");
      onClose();
    },
    (error: Error) => {
      console.error("Error applying for job:", error.message);
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!coverLetter.trim()) {
      alert("Cover letter cannot be empty!");
      return;
    }

    submitApplication({
      job_id,
      data: {
        freelancer_id: freelancerId!,
        cover_letter: coverLetter,
      },
    });
  };

  return (
    <form onSubmit={handleSubmit} className="p-4">
      <textarea
        className="w-full border p-2 mb-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Write your cover letter here..."
        value={coverLetter}
        onChange={(e) => setCoverLetter(e.target.value)}
      />
      {isError && (
        <StatusMessage message={`Error: ${(error as Error)?.message}`} />
      )}
      <div className="flex justify-center gap-3">
        <Button
          type="button"
          label="Cancel"
          onClick={onClose}
          className="bg-gray-400 text-white hover:bg-gray-500"
        />
        <Button
          type="submit"
          label={isLoading ? "Submitting..." : "Submit"}
          disabled={isLoading}
          className="bg-blue-600 text-white hover:bg-blue-700"
        />
      </div>
    </form>
  );
};

export default JobApplication;
