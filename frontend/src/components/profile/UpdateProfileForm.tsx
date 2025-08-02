import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Modal from "../UI/Modal";
import Input from "../UI/Input";
import Button from "../UI/Button";
import { Profile } from "./ProfileTypes";
import {
  updateProfileSchema,
  UpdateProfileValidation,
} from "../../validationSchemas/profileValidationSchema";
import { useUpdateProfile } from "../../hooks/profiles/useUpdateProfile";
import { useAuth } from "../../contexts/AuthContext";
import { useToast } from "../../contexts/ToastManager";

type UpdateProfileProps = {
  profile: Profile;
  isOpen: boolean;
  onSave: (updatedData: Profile) => void;
  onClose: () => void;
};

const UpdateProfileForm: React.FC<UpdateProfileProps> = ({
  profile,
  isOpen,
  onClose,
}) => {
  const { userType } = useAuth();
  const { addToast } = useToast();
  const isFreelancer = userType === "freelancer";
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<UpdateProfileValidation>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      skills: profile.skills,
      description: profile.description,
      hourlyRate: profile.hourlyRate ?? undefined,
    },
  });

  const updateProfileMutation = useUpdateProfile(
    () => {
      addToast("Profile updated successfully!");
      onClose();
    },
    (errorMessage: string) => {
      setError("root", { message: errorMessage });
    }
  );

  const onSubmit = (data: UpdateProfileValidation) => {
    const fixedData = {
      ...data,
      hourlyRate: data.hourlyRate === null ? undefined : data.hourlyRate,
    };
    updateProfileMutation.mutate({
      profileId: profile.profileId,
      data: fixedData,
    });
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} title="Update Profile">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {errors.root?.message && (
            <div className="rounded bg-red-100 px-4 py-2 text-red-700">
              {errors.root.message}
            </div>
          )}
          <Input
            label="Skills"
            {...register("skills")}
            error={errors.skills?.message}
          />
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Description
            </label>
            <textarea
              {...register("description")}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.description && (
              <p className="text-sm text-red-600 mt-1">
                {errors.description.message}
              </p>
            )}
          </div>
          {isFreelancer && (
            <Input
              label="Hourly Rate"
              type="number"
              {...register("hourlyRate", {
                valueAsNumber: true,
                setValueAs: (v) => (v === null ? undefined : v),
              })}
              error={errors.hourlyRate?.message}
            />
          )}
          <div className="flex justify-center">
            <Button
              type="submit"
              label="Save"
              className="bg-blue-600 text-white py-2 px-14 hover:bg-blue-700 transition"
            />
          </div>
        </form>
      </Modal>
    </>
  );
};

export default UpdateProfileForm;
