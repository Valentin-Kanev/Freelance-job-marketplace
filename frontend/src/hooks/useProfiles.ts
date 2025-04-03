import { useQuery, useMutation, useQueryClient } from "react-query";
import {
  fetchProfiles,
  createProfile,
  updateProfile,
  fetchUserProfile,
  searchProfiles,
} from "../api/profileApi";
import { Profile } from "../types/ProfileTypes";

interface UpdateProfileVariables {
  id: string;
  data: {
    skills: string;
    description: string;
    hourlyRate: number;
  };
}

export const useProfiles = () => {
  return useQuery<Profile[], Error>("profiles", fetchProfiles, {
    staleTime: 5 * 60 * 1000,
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
      staleTime: 0,
      cacheTime: 0,
      refetchOnWindowFocus: true,
      refetchOnMount: true,
    }
  );
};

export const useCreateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation(createProfile, {
    onSuccess: () => {
      queryClient.invalidateQueries("profiles");
    },
    onError: (error: Error) => {
      console.error("Error creating profile:", error.message);
    },
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation<Profile, Error, UpdateProfileVariables>(
    ({ id, data }) => updateProfile(id, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("profile");
      },
      onError: (error: Error) => {
        console.error("Error updating profile:", error.message);
      },
    }
  );
};

export const useSearchProfiles = (query: string) => {
  return useQuery<Profile[], Error>(
    ["searchProfiles", query],
    () => searchProfiles(query),
    {
      enabled: query.trim().length > 0,
      staleTime: 5 * 60 * 1000,
      retry: 2,
      onError: (error: Error) => {
        console.error("Error searching profiles:", error.message);
      },
    }
  );
};
