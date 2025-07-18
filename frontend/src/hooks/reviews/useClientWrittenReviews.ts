import { useQuery } from "react-query";
import { fetchClientReviews } from "../../api/reviewApi";

export const useClientWrittenReviews = (clientId: string) => {
  return useQuery(
    ["clientReviews", clientId],
    () => fetchClientReviews(clientId),
    {
      enabled: !!clientId,
    }
  );
};
