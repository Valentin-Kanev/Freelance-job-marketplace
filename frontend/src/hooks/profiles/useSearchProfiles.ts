import { useQuery } from "react-query";
import { Profile } from "../../types/ProfileTypes";
import { searchProfiles } from "../../api/profileApi";

export const useSearchProfiles = (query: string) => {
  return useQuery<Profile[], Error>(
    ["searchProfiles", query],
    () => searchProfiles(query),
    {
      enabled: query.trim().length > 0,
      staleTime: 30 * 1000,
      retry: 2,
      onError: (error: Error) => {
        console.error("Error searching profiles:", error.message);
      },
    }
  );
};
