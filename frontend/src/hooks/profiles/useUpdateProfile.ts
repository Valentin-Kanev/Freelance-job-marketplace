import { useMutation, useQueryClient } from "react-query";
import { Profile, UpdateProfileData } from "../../types/ProfileTypes";
import { updateProfile } from "../../api/profileApi";

export const useUpdateProfile = (
  onSuccessCallback?: () => void,
  onErrorCallback?: (errorMessage: string) => void
) => {
  const queryClient = useQueryClient();

  return useMutation<
    Profile,
    Error,
    { profileId: string; data: UpdateProfileData }
  >(({ profileId, data }) => updateProfile(profileId, data), {
    onSuccess: () => {
      queryClient.invalidateQueries("profile");
      onSuccessCallback?.();
    },
    onError: (error) => {
      console.error("Error updating profile:", error.message);
      onErrorCallback?.(error.message);
    },
  });
};
