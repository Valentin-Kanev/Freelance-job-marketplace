import { useQuery, useMutation, useQueryClient } from "react-query";
import { submitReview, fetchFreelancerReviews } from "../api/ReviewApi";
import { Review } from "../types/ReviewTypes";

export const useSubmitReview = (
  onSuccess?: () => void,
  onError?: (error: Error) => void
) => {
  const queryClient = useQueryClient();

  return useMutation(
    ({
      freelancerId,
      data,
    }: {
      freelancerId: string;
      data: { client_id: string; rating: number; review_text: string };
    }) => submitReview(freelancerId, data),
    {
      onSuccess: (_, { freelancerId }) => {
        queryClient.invalidateQueries(["freelancerReviews", freelancerId]);
        if (onSuccess) onSuccess();
      },
      onError: (error: Error) => {
        if (error.message.includes("already submitted")) {
        } else {
          console.error("Error submitting review:", error.message);
        }
        if (onError) onError(error);
      },
    }
  );
};

export const useFreelancerReviews = (freelancerId: string) => {
  return useQuery<Review[], Error>(
    ["freelancerReviews", freelancerId],
    () => fetchFreelancerReviews(freelancerId),
    {
      staleTime: 5 * 60 * 1000,
      retry: 2,
      onError: (error: Error) => {
        console.error("Error fetching reviews:", error.message);
      },
    }
  );
};
