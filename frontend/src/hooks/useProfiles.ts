import { useQuery, useMutation, useQueryClient } from "react-query";
import {
  fetchProfiles,
  createProfile,
  updateProfile,
  fetchUserProfile,
  Profile,
} from "../api/profileApi";

interface UpdateProfileVariables {
  id: string; // Change id to string for UUIDs
  data: {
    skills: string;
    description: string;
    hourly_rate: number;
  };
}

// Fetch all profiles
export const useProfiles = () => {
  return useQuery<Profile[], Error>("profiles", fetchProfiles, {
    staleTime: 5 * 60 * 1000, // Cache profiles for 5 minutes
    retry: 2, // Retry failed requests twice
    onError: (error: Error) => {
      console.error("Error fetching profiles:", error.message);
    },
  });
};

// Fetch a specific user profile by userId (UUID)
export const useUserProfile = (userId: string | null) => {
  return useQuery<Profile, Error>(
    ["profile", userId],
    () => fetchUserProfile(userId!),
    {
      enabled: !!userId,
      staleTime: 0,
      cacheTime: 0,
      refetchOnWindowFocus: true,
      refetchOnMount: true,
    }
  );
};

// Create a new profile
export const useCreateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation(createProfile, {
    onSuccess: () => {
      queryClient.invalidateQueries("profiles"); // Refetch profiles after creation
    },
    onError: (error: Error) => {
      console.error("Error creating profile:", error.message);
    },
  });
};

// Update an existing profile
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation<Profile, Error, UpdateProfileVariables>(
    ({ id, data }) => updateProfile(id, data),
    {
      onSuccess: (updatedProfile, variables) => {
        console.log("Profile updated successfully:", updatedProfile);
        queryClient.invalidateQueries("profile");
      },
      onError: (error: Error) => {
        console.error("Error updating profile:", error.message);
      },
    }
  );
};
