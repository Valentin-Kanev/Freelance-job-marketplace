// src/components/JobApplication.tsx
import React, { useState } from "react";
import { useApplyForJob, useJobApplications } from "../hooks/useApplication";

const JobApplication: React.FC<{ jobId: number }> = ({ jobId }) => {
  const [freelancerId, setFreelancerId] = useState<number>(0);
  const [coverLetter, setCoverLetter] = useState<string>("");

  const {
    data: applications,
    isLoading,
    isError,
    error,
  } = useJobApplications(jobId);
  const applyForJobMutation = useApplyForJob();

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    applyForJobMutation.mutate({
      jobId,
      data: { freelancer_id: freelancerId, cover_letter: coverLetter },
    });
  };

  return (
    <div>
      <h1>Apply for Job</h1>
      <form onSubmit={handleApply}>
        <div>
          <label>Freelancer ID</label>
          <input
            type="number"
            value={freelancerId}
            onChange={(e) => setFreelancerId(Number(e.target.value))}
            required
          />
        </div>
        <div>
          <label>Cover Letter</label>
          <textarea
            value={coverLetter}
            onChange={(e) => setCoverLetter(e.target.value)}
            required
          />
        </div>
        <button type="submit">Submit Application</button>
      </form>

      <h2>Applications for Job ID: {jobId}</h2>
      {isLoading && <p>Loading applications...</p>}
      {isError && <p>Error loading applications: {error?.message}</p>}
      {applications && applications.length > 0 ? (
        <ul>
          {applications.map((application) => (
            <li key={application.id}>
              Freelancer ID: {application.freelancer_id} - Cover Letter:{" "}
              {application.cover_letter}
            </li>
          ))}
        </ul>
      ) : (
        <p>No applications found.</p>
      )}
    </div>
  );
};

export default JobApplication;
