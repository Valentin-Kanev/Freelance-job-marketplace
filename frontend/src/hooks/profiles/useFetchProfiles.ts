import { useQuery } from "react-query";
import { Profile } from "../../types/ProfileTypes";
import { fetchProfiles } from "../../api/profileApi";

export const useFetchProfiles = () => {
  return useQuery<Profile[], Error>("profiles", fetchProfiles, {
    staleTime: 30 * 1000,
    retry: 2,
    onError: (error: Error) => {
      console.error("Error fetching profiles:", error.message);
    },
  });
};
