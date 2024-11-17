import React, { useState, useEffect } from "react";
import { useCreateJob, useUpdateJob } from "../../hooks/useJobs";
import Input from "../UI/Input";

interface JobFormProps {
  userId: string;
  initialJobDetails: {
    id: string;
    title: string;
    description: string;
    budget: number;
    deadline: string;
  };
  onSubmitSuccess: (updatedJob: any) => void;
  onClose: () => void;
}

const JobForm: React.FC<JobFormProps> = ({
  userId,
  initialJobDetails,
  onClose,
  onSubmitSuccess,
}) => {
  const createJobMutation = useCreateJob();
  const updateJobMutation = useUpdateJob();

  const [jobDetails, setJobDetails] = useState({
    title: "",
    description: "",
    budget: 0,
    deadline: "",
  });

  useEffect(() => {
    if (initialJobDetails) {
      setJobDetails(initialJobDetails);
    }
  }, [initialJobDetails]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (initialJobDetails?.id) {
      updateJobMutation.mutate(
        { id: initialJobDetails.id, data: jobDetails },
        {
          onSuccess: () => {
            onClose();
            if (onSubmitSuccess)
              onSubmitSuccess({ ...initialJobDetails, ...jobDetails });
          },
          onError: (error: any) =>
            console.error("Error updating job:", error.message),
        }
      );
    } else {
      createJobMutation.mutate(
        { ...jobDetails, client_id: userId },
        {
          onSuccess: (newJob) => {
            onClose();
            if (onSubmitSuccess) onSubmitSuccess(newJob);
          },
          onError: (error: any) =>
            console.error("Error creating job:", error.message),
        }
      );
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setJobDetails({
      ...jobDetails,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 p-6 bg-white rounded-lg shadow-md"
    >
      <Input
        label="Job Title"
        name="title"
        value={jobDetails.title}
        onChange={handleChange}
        required
        placeholder="Enter job title"
      />
      <Input
        label="Description"
        name="description"
        value={jobDetails.description}
        onChange={handleChange}
        required
        placeholder="Enter job description"
        className="h-32"
      />
      <Input
        label="Budget"
        name="budget"
        value={jobDetails.budget}
        onChange={handleChange}
        required
        type="number"
        placeholder="Enter budget"
      />
      <Input
        label="Deadline"
        name="deadline"
        value={jobDetails.deadline}
        onChange={handleChange}
        required
        type="date"
      />
      <button
        type="submit"
        className="w-full bg-accent text-white py-2 rounded-lg hover:bg-teal-600 transition duration-300"
      >
        {initialJobDetails?.id ? "Update Job" : "Create Job"}
      </button>
    </form>
  );
};

export default JobForm;
