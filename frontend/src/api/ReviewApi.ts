import { Review, SubmitReviewData } from "../components/reviews/ReviewTypes";
import { fetchClient } from "./apiUtils/fetchClientApi";

export const submitReview = async (
  freelancerId: string,
  data: SubmitReviewData
): Promise<Review> => {
  return fetchClient<Review>(`/profiles/${freelancerId}/reviews`, {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const fetchFreelancerReviews = async (
  freelancerId: string
): Promise<Review[]> => {
  return fetchClient<Review[]>(`/profiles/${freelancerId}/reviews`);
};

export const fetchClientReviews = async (
  clientId: string
): Promise<Review[]> => {
  return fetchClient<Review[]>(`/reviews/client/${clientId}`);
};
