import { useQuery } from "react-query";
import { searchJobsByTitle } from "../../api/jobApi";
import { Job } from "../../components/jobs/JobTypes";

export const useSearchJobsByTitle = (title: string) => {
  return useQuery<Job[], Error>(
    ["jobs", title],
    () => (title ? searchJobsByTitle(title) : Promise.resolve([])),
    {
      enabled: !!title,
      retry: 2,
    }
  );
};
