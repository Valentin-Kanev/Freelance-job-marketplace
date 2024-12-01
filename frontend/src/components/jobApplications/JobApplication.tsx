import React, { useState } from "react";
import { useMutation } from "react-query";
import Button from "../UI/Button";
import { applyForJob } from "../../api/ApplicationApi";
import { useToast } from "../ToastManager";

interface JobApplicationProps {
  jobId: string;
  onClose: () => void;
}

const JobApplication: React.FC<JobApplicationProps> = ({ jobId, onClose }) => {
  const [coverLetter, setCoverLetter] = useState("");
  const freelancerId = localStorage.getItem("userId"); // Retrieve logged-in user ID
  const { addToast } = useToast();

  const {
    mutate: submitApplication,
    isLoading,
    isError,
    error,
  } = useMutation(
    () =>
      applyForJob(jobId, {
        freelancer_id: freelancerId!,
        cover_letter: coverLetter,
      }),
    {
      onSuccess: () => {
        addToast("Application submitted successfully!");
        onClose();
      },
      onError: (error: any) => {
        console.error("Error applying for job:", error.message);
      },
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!coverLetter.trim()) {
      alert("Cover letter cannot be empty!");
      return;
    }

    submitApplication();
  };

  return (
    <form onSubmit={handleSubmit} className="p-4">
      <textarea
        className="w-full border p-2 mb-4"
        placeholder="Write your cover letter here..."
        value={coverLetter}
        onChange={(e) => setCoverLetter(e.target.value)}
      />
      {isError && (
        <p className="text-red-500">Error: {(error as any)?.message}</p>
      )}
      <div className="flex justify-end gap-4">
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
