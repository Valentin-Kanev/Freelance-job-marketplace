import { useQuery, useMutation, useQueryClient } from "react-query";
import {
  fetchProfiles,
  updateProfile,
  fetchUserProfile,
  searchProfiles,
} from "../api/profileApi";
import { Profile, UpdateProfileData } from "../types/ProfileTypes";

export const useProfiles = () => {
  return useQuery<Profile[], Error>("profiles", fetchProfiles, {
    staleTime: 30 * 1000,
    retry: 2,
    onError: (error: Error) => {
      console.error("Error fetching profiles:", error.message);
    },
  });
};

export const useUserProfile = (userId: string | null) => {
  return useQuery<Profile, Error>(
    ["profile", userId],
    () => fetchUserProfile(userId!),
    {
      enabled: !!userId,
      cacheTime: 0,
      refetchOnWindowFocus: true,
      refetchOnMount: true,
    }
  );
};

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

export const useSearchProfiles = (query: string) => {
  return useQuery<Profile[], Error>(
    ["searchProfiles", query],
    () => searchProfiles(query),
    {
      enabled: query.trim().length > 0,
      staleTime: 30 * 1000,
      retry: 2,
      onError: (error: Error) => {
        console.error("Error searching profiles:", error.message);
      },
    }
  );
};
