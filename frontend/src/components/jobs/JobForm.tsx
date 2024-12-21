import React from "react";
import Input from "../UI/Input";
import useJobForm from "../../hooks/useJobForm";
import { useJobMutations } from "../../hooks/useJobs";

interface JobFormProps {
  userId: string;
  initialJobDetails: any;
  onClose: () => void;
  onSubmitSuccess: (job: any) => void;
}

const JobForm: React.FC<JobFormProps> = ({
  userId,
  initialJobDetails,
  onClose,
  onSubmitSuccess,
}) => {
  const { jobDetails, handleChange } = useJobForm(initialJobDetails);
  const { handleJobSubmit } = useJobMutations(userId, onSubmitSuccess);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleJobSubmit(
      Boolean(initialJobDetails?.id),
      jobDetails,
      initialJobDetails?.id
    );
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Job Title"
        name="title"
        value={jobDetails.title}
        onChange={handleChange}
        placeholder="Enter job title"
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
        />
      </div>
      <Input
        label="Budget"
        name="budget"
        value={jobDetails.budget}
        onChange={handleChange}
        type="number"
        placeholder="Enter budget"
      />
      <Input
        label="Deadline"
        name="deadline"
        value={jobDetails.deadline}
        onChange={handleChange}
        type="date"
      />
      <button
        type="submit"
        className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition"
      >
        {initialJobDetails?.id ? "Update Job" : "Create Job"}
      </button>
    </form>
  );
};

export default JobForm;
