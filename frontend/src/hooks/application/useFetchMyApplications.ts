import { useQuery } from "react-query";
import { fetchMyApplications } from "../../api/applicationApi";
import { MyApplication } from "../../types/ApplicationTypes";

export const useFetchMyApplications = () => {
  return useQuery<MyApplication[], Error>(
    "myApplications",
    fetchMyApplications,
    {
      retry: 2,
      onError: (error: Error) => {
        console.error("Error fetching my applications:", error.message);
      },
    }
  );
};
