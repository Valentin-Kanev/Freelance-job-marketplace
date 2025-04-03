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
