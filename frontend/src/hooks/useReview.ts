// src/hooks/useReviews.ts
import { useQuery, useMutation, useQueryClient } from "react-query";
import { submitReview, fetchFreelancerReviews, Review } from "../api/ReviewApi";

// Submit a review for a freelancer
export const useSubmitReview = () => {
  const queryClient = useQueryClient();

  return useMutation(
    ({
      freelancerId,
      data,
    }: {
      freelancerId: number;
      data: { client_id: number; rating: number; review_text: string };
    }) => submitReview(freelancerId, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("freelancerReviews"); // Invalidate the reviews query to refetch
        console.log("Review submitted successfully");
      },
      onError: (error: Error) => {
        console.error("Error submitting review:", error.message);
      },
    }
  );
};

// Fetch all reviews for a freelancer
export const useFreelancerReviews = (freelancerId: number) => {
  return useQuery<Review[], Error>(
    ["freelancerReviews", freelancerId],
    () => fetchFreelancerReviews(freelancerId),
    {
      staleTime: 5 * 60 * 1000, // Cache reviews for 5 minutes
      retry: 2, // Retry failed requests twice
      onError: (error: Error) => {
        console.error("Error fetching reviews:", error.message);
      },
    }
  );
};
