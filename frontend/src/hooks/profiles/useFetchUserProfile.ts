import { useQuery } from "react-query";
import { Profile } from "../../components/profile/ProfileTypes";
import { fetchUserProfile } from "../../api/profileApi";

export const useFetchUserProfile = (userId: string | null) => {
  return useQuery<Profile, Error>(
    ["profile", userId],
    () => fetchUserProfile(userId!),
    {
      enabled: !!userId,
    }
  );
};
