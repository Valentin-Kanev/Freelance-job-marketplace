import { useQuery } from "react-query";
import { searchJobsByTitle } from "../../api/jobApi";
import { Job } from "../../components/jobs/JobTypes";

export const useSearchJobsByTitle = (title: string) => {
  return useQuery<Job[], Error>(
    ["jobs", title],
    () => (title ? searchJobsByTitle(title) : Promise.resolve([])),
    {
      enabled: Boolean(title),
      staleTime: 30 * 1000,
      retry: 2,
    }
  );
};
