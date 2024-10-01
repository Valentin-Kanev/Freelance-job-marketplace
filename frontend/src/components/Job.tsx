import React, { useState } from "react";
import {
  useJobs,
  useCreateJob,
  useUpdateJob,
  useDeleteJob,
} from "../hooks/useJobs";

const JobManagement: React.FC = () => {
  const { data: jobs, isLoading, isError, error } = useJobs();
  const createJobMutation = useCreateJob();
  const updateJobMutation = useUpdateJob();
  const deleteJobMutation = useDeleteJob();

  const [jobIdToEdit, setJobIdToEdit] = useState<number | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [budget, setBudget] = useState(0);
  const [deadline, setDeadline] = useState("");

  const handleCreateJob = (e: React.FormEvent) => {
    e.preventDefault();
    createJobMutation.mutate({
      client_id: 1,
      title,
      description,
      budget,
      deadline,
    }); // assuming client_id is 1
  };

  const handleUpdateJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (jobIdToEdit) {
      updateJobMutation.mutate({
        id: jobIdToEdit,
        data: { title, description, budget, deadline },
      });
      setJobIdToEdit(null);
    }
  };

  const handleDeleteJob = (id: number) => {
    deleteJobMutation.mutate(id);
  };

  const handleEditJob = (job: any) => {
    setJobIdToEdit(job.id);
    setTitle(job.title);
    setDescription(job.description);
    setBudget(job.budget);
    setDeadline(job.deadline);
  };

  return (
    <div>
      <h1>Job Management</h1>

      {isLoading && <p>Loading jobs...</p>}
      {isError && <p>Error loading jobs: {error?.message}</p>}

      <form onSubmit={jobIdToEdit ? handleUpdateJob : handleCreateJob}>
        <div>
          <label>Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Description</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Budget</label>
          <input
            type="number"
            value={budget}
            onChange={(e) => setBudget(Number(e.target.value))}
            required
          />
        </div>
        <div>
          <label>Deadline</label>
          <input
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            required
          />
        </div>
        <button type="submit">
          {jobIdToEdit ? "Update Job" : "Create Job"}
        </button>
      </form>

      <h2>All Jobs</h2>
      {jobs &&
        jobs.map((job) => (
          <div key={job.id}>
            <p>
              {job.title} - {job.description} (${job.budget}) - {job.deadline}
            </p>
            <button onClick={() => handleEditJob(job)}>Edit</button>
            <button onClick={() => handleDeleteJob(job.id)}>Delete</button>
          </div>
        ))}
    </div>
  );
};

export default JobManagement;
