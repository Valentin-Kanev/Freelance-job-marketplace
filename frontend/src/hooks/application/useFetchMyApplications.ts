import { useQuery } from "react-query";
import { fetchMyApplications } from "../../api/applicationApi";
import { MyApplication } from "../../components/jobApplications/ApplicationTypes";

export const useFetchMyApplications = () => {
  return useQuery<MyApplication[], Error>(
    "myApplications",
    fetchMyApplications,
    {
      retry: 2,
    }
  );
};
