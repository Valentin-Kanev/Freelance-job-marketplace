import { Link } from "react-router-dom";
import ExpandableText from "../UI/ExpandableText";

export default function ReviewCard({
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
