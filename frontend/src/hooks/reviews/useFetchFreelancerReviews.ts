import { useQuery } from "react-query";
import { Review } from "../../components/reviews/ReviewTypes";
import { fetchFreelancerReviews } from "../../api/reviewApi";

export const useFetchFreelancerReviews = (freelancerId: string) => {
  return useQuery<Review[], Error>(
    ["freelancerReviews", freelancerId],
    () => fetchFreelancerReviews(freelancerId),
    {
      retry: 2,
    }
  );
};
