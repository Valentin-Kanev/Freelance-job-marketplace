import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Modal from "../UI/Modal";
import Toast from "../UI/Toast";
import Input from "../UI/Input";
import Button from "../UI/Button";
import { Profile } from "../../types/ProfileTypes";
import {
  updateProfileSchema,
  UpdateProfileValidation,
} from "../../validationSchemas/profileValidationSchema";
import { useUpdateProfile } from "../../hooks/useProfiles";
import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";

interface EditProfileProps {
  profile: Profile;
  isOpen: boolean;
  onSave: (updatedData: Profile) => void;
  onClose: () => void;
}

const EditProfileForm: React.FC<EditProfileProps> = ({
  profile,
  isOpen,
  onClose,
}) => {
  const { userType } = useAuth();
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
      hourly_rate: profile.hourlyRate ?? undefined,
    },
  });

  const updateProfileMutation = useUpdateProfile(
    () => {
      setToastMessage("Profile updated successfully!");
      onClose();
    },
    (errorMessage: string) => {
      setError("root", { message: errorMessage });
    }
  );

  const onSubmit = (data: UpdateProfileValidation) => {
    const cleanedData = {
      ...data,
      hourly_rate:
        data.hourly_rate === null || !isFreelancer
          ? undefined
          : data.hourly_rate,
    };

    updateProfileMutation.mutate({
      profileId: profile.profileId,
      data: cleanedData,
    });
  };

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} title="Edit Profile">
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
              {...register("hourly_rate", {
                valueAsNumber: true,
              })}
              error={errors.hourly_rate?.message}
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

      {toastMessage && (
        <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
      )}
    </>
  );
};

export default EditProfileForm;
