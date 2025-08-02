import { useFetchFreelancerReviews } from "../../hooks/reviews/useFetchFreelancerReviews";
import { useAuth } from "../../contexts/AuthContext";
import StatusMessage from "../UI/StatusMessage";
import ReviewCard from "../reviews/ReviewCard";

type ReviewListProps = {
  freelancerId: string;
  isFreelancer: boolean;
};

const FreelancerReviewsList: React.FC<ReviewListProps> = ({
  freelancerId,
  isFreelancer,
}: ReviewListProps) => {
  const { isLoggedIn } = useAuth();
  const {
    data: reviews,
    error,
    isError,
  } = useFetchFreelancerReviews(freelancerId);

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
};

export default FreelancerReviewsList;
