import { Profile, UpdateProfileData } from "../components/profile/ProfileTypes";
import { fetchClient } from "./apiUtils/fetchClientApi";

export const updateProfile = async (
  profileId: string,
  data: UpdateProfileData
): Promise<Profile> => {
  const token = localStorage.getItem("authToken");

  if (!token) {
    throw new Error("No token provided. Please log in.");
  }

  return fetchClient<Profile>(`/profiles/user/${profileId}`, {
    method: "PUT",
    body: JSON.stringify(data),
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const fetchProfiles = async (): Promise<Profile[]> => {
  return fetchClient<Profile[]>("/profiles");
};

export const fetchUserProfile = async (userId: string): Promise<Profile> => {
  return fetchClient<Profile>(`/profiles/user/${userId}`);
};

export const searchProfiles = async (query: string): Promise<Profile[]> => {
  return fetchClient<Profile[]>(`/profiles/search?query=${query}`);
};
