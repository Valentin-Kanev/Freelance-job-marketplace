import { Review, SubmitReviewData } from "../types/ReviewTypes";

const BASE_URL = "http://localhost:3001";

const fetchClient = async <T>(
  url: string,
  options?: RequestInit
): Promise<T> => {
  const token = localStorage.getItem("authToken");
  if (!token) {
    throw new Error("User is not authenticated");
  }

  const response = await fetch(`${BASE_URL}${url}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const errorData = await response
      .json()
      .catch(() => ({ message: response.statusText }));
    throw new Error(errorData?.message || "Something went wrong");
  }

  return response.json();
};

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
