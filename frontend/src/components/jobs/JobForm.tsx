import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createJobSchema,
  CreateJobValidation,
} from "../../validationSchemas/jobValidationSchema";
import { useJobMutations } from "../../hooks/useJobs";
import Input from "../UI/Input";
import { CreateJobData, UpdateJobData } from "../../types/JobTypes";

interface JobFormProps {
  userId: string;
  initialJobDetails: Partial<CreateJobValidation> & { jobId?: number };
  onClose: () => void;
  onSubmitSuccess: (job: CreateJobData | UpdateJobData) => void;
}

const JobForm: React.FC<JobFormProps> = ({
  userId,
  initialJobDetails,
  onClose,
  onSubmitSuccess,
}) => {
  const isUpdate = Boolean(initialJobDetails.jobId);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<CreateJobValidation>({
    resolver: zodResolver(createJobSchema),
    defaultValues: {
      ...initialJobDetails,
      budget: Number(initialJobDetails.budget) || 0,
      deadline: initialJobDetails.deadline
        ? new Date(initialJobDetails.deadline)
        : undefined,
    },
  });

  const { handleJobSubmit } = useJobMutations(
    (job) => {
      onSubmitSuccess(job);
      onClose();
    },
    (errorMessage: string) => {
      setError("root.serverError", { message: errorMessage });
    }
  );

  const onSubmit = (data: CreateJobValidation) => {
    const payload = isUpdate
      ? {
          ...(data as UpdateJobData),
          jobId: initialJobDetails.jobId!,
        }
      : {
          ...data,
          clientId: userId,
        };

    handleJobSubmit(isUpdate, payload);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {errors.root?.serverError && (
        <div className="rounded bg-red-100 px-4 py-2 text-red-700">
          {errors.root.serverError.message}
        </div>
      )}

      <Input
        label="Job Title"
        {...register("title")}
        placeholder="Enter job title"
        error={errors.title?.message}
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
          {...register("description")}
          placeholder="Enter job description"
          rows={5}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        />
        {errors.description && (
          <p className="text-red-500 text-sm">{errors.description.message}</p>
        )}
      </div>

      <Input
        label="Budget"
        type="number"
        {...register("budget", { valueAsNumber: true })}
        placeholder="Enter budget"
        error={errors.budget?.message}
      />

      <Input
        label="Deadline"
        type="date"
        {...register("deadline", { valueAsDate: true })}
        error={errors.deadline?.message}
      />

      <button
        type="submit"
        className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition"
      >
        {isUpdate ? "Update Job" : "Create Job"}
      </button>
    </form>
  );
};

export default JobForm;
