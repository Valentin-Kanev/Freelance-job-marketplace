export interface Review {
  id: number;
  freelancer_id: number;
  client_id: number;
  rating: number;
  review_text: string;
}

interface SubmitReviewData {
  client_id: number;
  rating: number;
  review_text: string;
}

const BASE_URL = "/reviews";

const fetchClient = async <T>(
  url: string,
  options?: RequestInit
): Promise<T> => {
  const response = await fetch(`${BASE_URL}${url}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData?.message || "Something went wrong");
  }

  return response.json();
};

// Submit a review for a freelancer
export const submitReview = async (
  freelancerId: number,
  data: SubmitReviewData
): Promise<Review> => {
  return fetchClient<Review>(`/profiles/${freelancerId}/reviews`, {
    method: "POST",
    body: JSON.stringify(data),
  });
};

// Fetch all reviews for a freelancer
export const fetchFreelancerReviews = async (
  freelancerId: number
): Promise<Review[]> => {
  return fetchClient<Review[]>(`/profiles/${freelancerId}/reviews`);
};
