import { Link } from "react-router-dom";
import ExpandableText from "../UI/ExpandableText";

type ReviewCardProps = {
  review: {
    clientId: string;
    clientUsername: string;
    rating: number;
    reviewText: string;
  };
};

const ReviewCard: React.FC<ReviewCardProps> = ({
  review: { clientId, clientUsername, rating, reviewText },
}) => {
  return (
    <div className="p-4 border border-gray-200 rounded-lg shadow-sm bg-white">
      <Link
        to={`/profiles/${clientId}`}
        className="text-lg font-semibold text-blue-600"
      >
        {clientUsername}
      </Link>
      <p className="text-yellow-500 font-semibold">
        Rating: {"⭐".repeat(rating)}
      </p>
      <ExpandableText text={reviewText} />
    </div>
  );
};

export default ReviewCard;
