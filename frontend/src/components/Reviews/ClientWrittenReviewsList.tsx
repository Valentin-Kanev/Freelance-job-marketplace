import { Link } from "react-router-dom";
import StatusMessage from "../UI/StatusMessage";
import ExpandableText from "../UI/ExpandableText";
import { useFetchClientWrittenReviews } from "../../hooks/reviews/useFetchClientWrittenReviews";

const ClientWrittenReviewsList = ({ clientId }: { clientId: string }) => {
  const {
    data: reviews,
    isLoading,
    error,
  } = useFetchClientWrittenReviews(clientId);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">My Reviews</h1>
      {isLoading ? (
        <StatusMessage message="Loading reviews..." />
      ) : error instanceof Error ? (
        <StatusMessage message={`Error: ${error.message}`} />
      ) : reviews?.length ? (
        <ul className="space-y-3">
          {reviews.map((review) => (
            <li key={review.id}>
              <div className="border rounded p-4 shadow-sm hover:shadow-md transition-shadow">
                <h2 className="text-lg font-bold">
                  <Link
                    to={`/profiles/${review.freelancerId}`}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    {review.freelancerUsername}
                  </Link>
                </h2>
                <p className="text-gray-800">
                  <strong>Rating:</strong> {review.rating} / 5
                </p>
                <ExpandableText text={review.reviewText} />
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <StatusMessage message="You have not written any reviews yet." />
      )}
    </div>
  );
};

export default ClientWrittenReviewsList;
