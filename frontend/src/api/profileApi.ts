export interface Profile {
  profileId: number;
  userId: number;
  skills: string;
  description: string;
  hourlyRate: number;
  username?: string;
}

interface CreateProfileData {
  user_id: number;
  skills: string;
  description: string;
  hourly_rate: number;
}

interface UpdateProfileData {
  skills: string;
  description: string;
  hourly_rate: number;
}

const BASE_URL = "/profile";

const fetchClient = async <T>(
  url: string,
  options?: RequestInit
): Promise<T> => {
  const response = await fetch(`${BASE_URL}${url}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData?.message || "Something went wrong");
  }

  return response.json();
};

// Fetch all profiles
export const fetchProfiles = async (): Promise<Profile[]> => {
  return fetchClient<Profile[]>("/profiles");
};

// Create a new profile
export const createProfile = async (
  data: CreateProfileData
): Promise<Profile> => {
  return fetchClient<Profile>("/profiles", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

// Update an existing profile by ID
// src/api/profileService.ts

export const updateProfile = async (
  id: number,
  data: UpdateProfileData
): Promise<Profile> => {
  return fetchClient<Profile>(`/profiles/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};
