import { useQuery, useMutation, useQueryClient } from "react-query";
import {
  submitReview,
  fetchFreelancerReviews,
  fetchClientReviews,
} from "../api/ReviewApi";
import { Review } from "../types/ReviewTypes";

type SubmitReviewArgs = {
  freelancerId: string;
  data: { client_id: string; rating: number; review_text: string };
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

export const useClientWrittenReviews = (clientId: string) => {
  return useQuery(
    ["clientReviews", clientId],
    () => fetchClientReviews(clientId),
    {
      enabled: !!clientId,
    }
  );
};
