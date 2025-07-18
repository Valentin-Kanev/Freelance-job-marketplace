import { useQuery } from "react-query";
import { fetchJobsByClient } from "../../api/jobApi";

export const useFetchMyJobs = (clientId: string) => {
  return useQuery(
    ["jobsByClient", clientId],
    () => fetchJobsByClient(clientId),
    {
      enabled: !!clientId,
    }
  );
};
