import { useQuery } from "react-query";
import { fetchClientReviews } from "../../api/ReviewApi";
import { Link } from "react-router-dom";

const ClientmadeReviews = ({ clientId }: { clientId: string }) => {
  const {
    data: reviews,
    isLoading,
    error,
  } = useQuery(
    ["clientReviews", clientId],
    () => fetchClientReviews(clientId),
    {
      enabled: !!clientId,
    }
  );

  if (isLoading) return <p>Loading reviews...</p>;
  if (error instanceof Error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">My Reviews</h1>
      {reviews?.length ? (
        <ul className="  space-y-3">
          {reviews.map((review) => (
            <li key={review.id}>
              <div className="border rounded p-4 shadow-sm hover:shadow-md transition-shadow">
                <h2 className="text-lg font-bold">
                  <Link
                    to={`/profiles/${review.freelancer_id}`}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    {review.freelancer_username}
                  </Link>
                </h2>
                <p className="text-gray-800">
                  <strong>Rating:</strong> {review.rating} / 5
                </p>
                <p className="text-gray-600">
                  <strong>Review:</strong> {review.review_text}
                </p>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-600">You have not written any reviews yet.</p>
      )}
    </div>
  );
};

export default ClientmadeReviews;
