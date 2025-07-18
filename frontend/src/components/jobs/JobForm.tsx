import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createJobSchema,
  CreateJobValidation,
} from "../../validationSchemas/jobValidationSchema";
import Input from "../UI/Input";

interface JobFormProps {
  isUpdate: boolean;
  defaultValues: CreateJobValidation;
  onSubmit: (data: CreateJobValidation) => void;
  onClose: () => void;
  serverError?: string;
  isLoading?: boolean;
  onSuccess?: () => void;
}

const JobForm: React.FC<JobFormProps> = ({
  isUpdate,
  defaultValues,
  onSubmit,
  serverError,
  isLoading,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateJobValidation>({
    resolver: zodResolver(createJobSchema),
    defaultValues: {
      ...defaultValues,
      budget: Number(defaultValues.budget) || 0,
      deadline: defaultValues.deadline
        ? new Date(defaultValues.deadline)
        : undefined,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {serverError && (
        <div className="rounded bg-red-100 px-4 py-2 text-red-700">
          {serverError}
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
        disabled={isLoading}
      >
        {isUpdate ? "Update Job" : "Create Job"}
      </button>
    </form>
  );
};

export default JobForm;
