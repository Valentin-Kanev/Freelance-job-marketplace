import { useMutation, useQueryClient } from "react-query";
import { submitReview } from "../../api/reviewApi";

type SubmitReviewArgs = {
  freelancerId: string;
  data: { clientId: string; rating: number; reviewText: string };
};

export const useSubmitReview = (
  onSuccess?: () => void,
  onError?: (error: Error) => void
) => {
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
        onError?.(error);
      },
    }
  );
};
