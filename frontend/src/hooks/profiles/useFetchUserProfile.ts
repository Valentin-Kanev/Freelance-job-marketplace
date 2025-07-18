import { useQuery } from "react-query";
import { Profile } from "../../types/ProfileTypes";
import { fetchUserProfile } from "../../api/profileApi";

export const useFetchUserProfile = (userId: string | null) => {
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
