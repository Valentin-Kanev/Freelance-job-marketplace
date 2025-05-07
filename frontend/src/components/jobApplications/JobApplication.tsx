import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createApplicationSchema,
  CreateApplicationValidation,
} from "../../schemas/applicationValidationSchema";
import { useApplyForJob } from "../../hooks/useApplication";
import Button from "../UI/Button";
import { useToast } from "../../contexts/ToastManager";

interface JobApplicationProps {
  job_id: number;
  onClose: () => void;
}

const JobApplication: React.FC<JobApplicationProps> = ({ job_id, onClose }) => {
  const freelancerId = localStorage.getItem("userId");
  const { addToast } = useToast();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<CreateApplicationValidation>({
    resolver: zodResolver(createApplicationSchema),
  });

  const { mutate: submitApplication } = useApplyForJob(
    () => {
      addToast("Application submitted successfully!");
      onClose();
    },
    (error: Error) => {
      setError("root.serverError", { message: error.message });
    }
  );

  const onSubmit = (data: CreateApplicationValidation) => {
    submitApplication({
      job_id,
      data: {
        freelancer_id: freelancerId!,
        cover_letter: data.cover_letter,
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-4 space-y-4">
      {errors.root?.serverError && (
        <div className="rounded bg-red-100 px-4 py-2 text-red-700">
          {errors.root.serverError.message}
        </div>
      )}

      <div>
        <label
          htmlFor="cover_letter"
          className="block text-sm font-medium text-gray-700"
        >
          Cover Letter
        </label>
        <textarea
          id="cover_letter"
          {...register("cover_letter")}
          className="w-full border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Write your cover letter here..."
          rows={5}
        />
        {errors.cover_letter && (
          <p className="text-red-500 text-sm mt-1">
            {errors.cover_letter.message}
          </p>
        )}
      </div>

      <div className="flex justify-center gap-3">
        <Button
          type="button"
          label="Cancel"
          onClick={onClose}
          className="bg-gray-400 text-white hover:bg-gray-500"
        />
        <Button
          type="submit"
          label={isSubmitting ? "Submitting..." : "Submit"}
          disabled={isSubmitting}
          className="bg-blue-600 text-white hover:bg-blue-700"
        />
      </div>
    </form>
  );
};

export default JobApplication;
