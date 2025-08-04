import { useQuery } from "react-query";
import { Profile } from "../../components/profile/ProfileTypes";
import { fetchProfiles } from "../../api/profileApi";

export const useFetchProfiles = () => {
  return useQuery<Profile[], Error>("profiles", fetchProfiles, {
    retry: 2,
  });
};
