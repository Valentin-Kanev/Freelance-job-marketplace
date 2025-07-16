import { useFreelancerReviews } from "../../hooks/useReview";
import { useAuth } from "../../contexts/AuthContext";
import ExpandableText from "../UI/ExpandableText";
import { Link } from "react-router-dom";
import StatusMessage from "../UI/StatusMessage";

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
          <StatusMessage message="Please log in or register to view reviews." />
        ) : isError ? (
          <StatusMessage
            message={`Error fetching reviews: ${error?.message}`}
          />
        ) : reviews && reviews.length > 0 ? (
          reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))
        ) : (
          <StatusMessage message="No reviews yet." />
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
    clientId: string;
    clientUsername: string;
    rating: number;
    reviewText: string;
  };
}) {
  return (
    <div className="p-4 border border-gray-200 rounded-lg shadow-sm bg-white">
      <Link
        to={`/profiles/${review.clientId}`}
        className="text-lg font-semibold text-blue-600"
      >
        {review.clientUsername}
      </Link>
      <p className="text-yellow-500 font-semibold">
        Rating: {"⭐".repeat(review.rating)}
      </p>
      <ExpandableText text={review.reviewText} />
    </div>
  );
}
