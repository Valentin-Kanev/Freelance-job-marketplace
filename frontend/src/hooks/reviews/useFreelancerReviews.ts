import { useQuery } from "react-query";
import { Review } from "../../types/ReviewTypes";
import { fetchFreelancerReviews } from "../../api/reviewApi";

export const useFreelancerReviews = (freelancerId: string) => {
  return useQuery<Review[], Error>(
    ["freelancerReviews", freelancerId],
    () => fetchFreelancerReviews(freelancerId),
    {
      staleTime: 30 * 1000,
      retry: 2,
      onError: (error: Error) => {
        console.error("Error fetching reviews:", error.message);
      },
    }
  );
};
