export interface Profile {
  userType: string;
  profileId: string; // UUID as string
  userId: string; // UUID as string
  skills: string;
  description: string;
  hourlyRate: number;
  username?: string;
}

interface CreateProfileData {
  userId: string; // UUID as string
  skills: string;
  description: string;
  hourlyRate: number;
}

interface UpdateProfileData {
  skills?: string;
  description?: string;
  hourlyRate?: number;
}

const BASE_URL = "http://localhost:3001"; // Full backend URL

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

  const data = await response.json();
  return data;
};

// Fetch all profiles
export const fetchProfiles = async (): Promise<Profile[]> => {
  return fetchClient<Profile[]>("/profiles");
};

export const fetchUserProfile = async (userId: string) => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("No token provided. Please log in.");
  }

  const response = await fetch(
    `http://localhost:3001/profiles/user/${userId}`, // Updated URL
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Error ${response.status}: ${response.statusText}`);
  }

  return await response.json();
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

// Update an existing profile by ID (id is now a string, not a number)
export const updateProfile = async (
  profileId: string, // Use profileId instead of userId
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
