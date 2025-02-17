export interface Profile {
  userType: string;
  profileId: string;
  userId: string;
  skills: string;
  description: string;
  hourlyRate: number;
  username: string;
}

export type CreateProfileData = Omit<
  Profile,
  "userType" | "profileId" | "username"
>;

export type UpdateProfileData = Partial<
  Omit<Profile, "userType" | "profileId" | "userId" | "username">
>;

const BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:3001";

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
    let errorMessage = "Something went wrong";

    const contentType = response.headers.get("Content-Type");
    if (contentType && contentType.includes("application/json")) {
      const errorData = await response.json();
      errorMessage = errorData?.message || errorMessage;
    } else {
      errorMessage = `Error ${response.status}: ${response.statusText}`;
    }

    throw new Error(errorMessage);
  }

  return response.json();
};

export const fetchProfiles = async (): Promise<Profile[]> => {
  return fetchClient<Profile[]>("/profiles");
};

export const fetchUserProfile = async (userId: string): Promise<Profile> => {
  const response = await fetch(`${BASE_URL}/profiles/user/${userId}`, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Error ${response.status}: ${response.statusText}`);
  }

  return await response.json();
};

export const createProfile = async (
  data: CreateProfileData
): Promise<Profile> => {
  return fetchClient<Profile>("/profiles", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const updateProfile = async (
  profileId: string,
  data: UpdateProfileData
): Promise<Profile> => {
  const token = localStorage.getItem("token");

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

export const searchProfiles = async (query: string): Promise<Profile[]> => {
  return fetchClient<Profile[]>(`/profiles/search?query=${query}`);
};
