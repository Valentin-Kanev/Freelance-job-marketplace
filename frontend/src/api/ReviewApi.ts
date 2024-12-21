export interface Review {
  id: string;
  freelancer_id: string;
  client_id: string;
  rating: number;
  review_text: string;
  client_username: string;
  freelancer_username: string;
}

interface SubmitReviewData {
  client_id: string;
  rating: number;
  review_text: string;
}

const BASE_URL = "http://localhost:3001";

const fetchClient = async <T>(
  url: string,
  options?: RequestInit
): Promise<T> => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("User is not authenticated");
  }

  console.log(`Making request to: ${url} with options:`, options);

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
    console.error(`Error ${response.status}:`, errorData);
    throw new Error(errorData?.message || "Something went wrong");
  }

  const data = await response.json();
  console.log("Response data:", data);
  return data;
};

// Submit a review for a freelancer
export const submitReview = async (
  freelancerId: string,
  data: SubmitReviewData
): Promise<Review> => {
  return fetchClient<Review>(`/profiles/${freelancerId}/reviews`, {
    method: "POST",
    body: JSON.stringify(data),
  });
};

// Fetch all reviews for a freelancer
export const fetchFreelancerReviews = async (
  freelancerId: string
): Promise<Review[]> => {
  console.log(`Fetching reviews for freelancer_id: ${freelancerId}`);
  return fetchClient<Review[]>(`/profiles/${freelancerId}/reviews`);
};

// Fetch all reviews written by a client
export const fetchClientReviews = async (
  clientId: string
): Promise<Review[]> => {
  console.log(`Fetching reviews for client_id: ${clientId}`);
  return fetchClient<Review[]>(`/reviews/client/${clientId}`);
};
