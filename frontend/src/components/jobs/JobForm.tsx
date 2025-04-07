import React, { useState } from "react";
import Input from "../UI/Input";
import useJobForm from "../../hooks/useJobForm";
import { useJobMutations } from "../../hooks/useJobs";
import { CreateJobData, UpdateJobData } from "../../types/JobTypes";

interface JobFormProps {
  userId: string;
  initialJobDetails: CreateJobData;
  onClose: () => void;
  onSubmitSuccess: (job: CreateJobData | UpdateJobData) => void;
}

const JobForm: React.FC<JobFormProps> = ({
  userId,
  initialJobDetails,
  onClose,
  onSubmitSuccess,
}) => {
  const { jobDetails, handleChange } = useJobForm(initialJobDetails);
  const { handleJobSubmit } = useJobMutations(userId, onSubmitSuccess);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const isUpdate = Boolean(initialJobDetails.job_id);

    handleJobSubmit(isUpdate, {
      ...jobDetails,
      job_id: initialJobDetails.job_id,
      client_id: userId,
      client_username: "",
      budget: Number(jobDetails.budget),
      deadline: new Date(jobDetails.deadline),
    });
    onClose();
  };

  const handleFocus = (fieldName: string) => {
    setErrors((prev) => ({
      ...prev,
      [fieldName]: "",
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Job Title"
        name="title"
        value={jobDetails.title}
        onChange={handleChange}
        placeholder="Enter job title"
        required
        error={errors.title}
        onFocus={() => handleFocus("title")}
      />
      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700"
        >
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={jobDetails.description}
          onChange={handleChange}
          placeholder="Enter job description"
          rows={5}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          required
          onFocus={() => handleFocus("description")}
        />
        {errors.description && (
          <p className="text-red-500 text-sm">{errors.description}</p>
        )}
      </div>
      <Input
        label="Budget"
        name="budget"
        value={jobDetails.budget}
        onChange={handleChange}
        type="number"
        placeholder="Enter budget"
        required
        error={errors.budget}
        onFocus={() => handleFocus("budget")}
      />
      <Input
        label="Deadline"
        name="deadline"
        value={new Date(jobDetails.deadline).toISOString().split("T")[0]}
        onChange={handleChange}
        type="date"
        required
        error={errors.deadline}
        onFocus={() => handleFocus("deadline")}
      />

      <button
        type="submit"
        className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition"
      >
        {initialJobDetails.job_id ? "Update Job" : "Create Job"}
      </button>
    </form>
  );
};

export default JobForm;
