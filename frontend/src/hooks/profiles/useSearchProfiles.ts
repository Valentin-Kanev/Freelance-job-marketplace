import { useQuery } from "react-query";
import { Profile } from "../../components/profile/ProfileTypes";
import { searchProfiles } from "../../api/profileApi";

export const useSearchProfiles = (query: string) => {
  return useQuery<Profile[], Error>(
    ["searchProfiles", query],
    () => searchProfiles(query),
    {
      enabled: query.trim().length > 0,
      retry: 2,
    }
  );
};
