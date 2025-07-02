import { useFreelancerReviews } from "../../hooks/useReview";
import { useAuth } from "../../contexts/AuthContext";
import ExpandableText from "../UI/ExpandableText";
import { Link } from "react-router-dom";

interface ReviewListProps {
  freelancerId: string;
  isFreelancer: boolean;
}

export default function FreelancerReviewList({
  freelancerId,
  isFreelancer,
}: ReviewListProps) {
  const { isLoggedIn } = useAuth();
  const { data: reviews, error, isError } = useFreelancerReviews(freelancerId);

  return (
    isFreelancer && (
      <div className="space-y-6">
        {!isLoggedIn ? (
          <div className="text-gray-500">
            Please log in or register to view reviews.
          </div>
        ) : isError ? (
          <div className="text-red-500">
            Error fetching reviews: {error?.message}
          </div>
        ) : reviews && reviews.length > 0 ? (
          reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))
        ) : (
          <div className="text-gray-500">No reviews yet.</div>
        )}
      </div>
    )
  );
}

function ReviewCard({
  review,
}: {
  review: {
    id: string;
    client_id: string;
    client_username: string;
    rating: number;
    review_text: string;
  };
}) {
  return (
    <div className="p-4 border border-gray-200 rounded-lg shadow-sm bg-white">
      <Link
        to={`/profiles/${review.client_id}`}
        className="text-lg font-semibold text-blue-600"
      >
        {review.client_username}
      </Link>
      <p className="text-yellow-500 font-semibold">
        Rating: {"⭐".repeat(review.rating)}
      </p>
      <ExpandableText text={review.review_text} />
    </div>
  );
}
