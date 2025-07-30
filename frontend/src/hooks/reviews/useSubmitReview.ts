import { useMutation, useQueryClient } from "react-query";
import { submitReview } from "../../api/reviewApi";

type SubmitReviewArgs = {
  freelancerId: string;
  data: { clientId: string; rating: number; reviewText: string };
};

export const useSubmitReview = (onSuccess?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation(
    ({ freelancerId, data }: SubmitReviewArgs) =>
      submitReview(freelancerId, data),
    {
      onSuccess: (freelancerId) => {
        queryClient.invalidateQueries(["freelancerReviews", freelancerId]);
        onSuccess?.();
      },
      onError: (error: Error) => {
        console.error("Error submitting review:", error.message);
        error = error.message
          ? new Error(error.message)
          : new Error(
              "An unexpected error occurred while submitting the review."
            );
        throw error;
      },
    }
  );
};
