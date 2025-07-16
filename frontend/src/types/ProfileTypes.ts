export interface Profile {
  userType: string;
  profileId: string;
  userId: string;
  skills: string;
  description: string;
  hourlyRate?: number;
  username: string;
}

export type UpdateProfileData = Partial<
  Omit<Profile, "userType" | "profileId" | "userId" | "username"> & {
    hourlyRate?: number;
  }
>;
