import { useFreelancerReviews } from "../../hooks/useReview";
import { useAuth } from "../../contexts/AuthContext";
import { useEffect } from "react";

interface ReviewListProps {
  freelancerId: string;
  isFreelancer: boolean;
}

export default function ReviewList({
  freelancerId,
  isFreelancer,
}: ReviewListProps) {
  const { isLoggedIn } = useAuth();
  const {
    data: reviews,
    error,
    isError,
    refetch,
  } = useFreelancerReviews(freelancerId);

  useEffect(() => {
    refetch();
  }, [freelancerId, refetch]);

  if (!isFreelancer) {
    return null;
  }

  if (!isLoggedIn) {
    return (
      <div className="text-gray-500">
        Please log in or register to view reviews.
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-red-500">
        Error fetching reviews: {error?.message}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {reviews && reviews.length > 0 ? (
        reviews.map((review) => (
          <div
            key={review.id}
            className="p-4 border border-gray-200 rounded-lg shadow-sm bg-white"
          >
            <p className="text-lg font-semibold text-gray-800">
              Client: {review.client_username}
            </p>
            <p className="text-yellow-500 font-semibold">
              Rating: {"⭐".repeat(review.rating)}
            </p>
            <p className="text-gray-700">{review.review_text}</p>
          </div>
        ))
      ) : (
        <div className="text-gray-500">No reviews yet.</div>
      )}
    </div>
  );
}
