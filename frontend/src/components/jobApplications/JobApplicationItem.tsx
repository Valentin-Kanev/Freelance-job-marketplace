import { useState } from "react";
import { Link } from "react-router-dom";
import CreateReview from "../Reviews/CreateReview";
import Button from "../UI/Button";
import ExpandableText from "../UI/ExpandableText";

interface ApplicationItemProps {
  application: {
    application_id: number;
    freelancer_id: string;
    username: string;
    cover_letter: string;
  };
}

const ApplicationItem: React.FC<ApplicationItemProps> = ({ application }) => {
  const [isReviewing, setIsReviewing] = useState(false);

  const handleOpenReviewModal = () => {
    setIsReviewing(true);
  };

  const handleCloseReviewModal = () => {
    setIsReviewing(false);
  };

  return (
    <div className="flex flex-col space-y-2 border rounded p-4 shadow-sm hover:shadow-md transition-shadow w-full">
      <p className="text-lg font-medium text-gray-800">
        <strong>Applicant:</strong>{" "}
        <Link
          to={`/profiles/${application.freelancer_id}`}
          className="text-blue-600 hover:text-blue-800 underline"
        >
          {application.username}
        </Link>
      </p>

      <div className="w-full max-w-full break-all whitespace-normal">
        <ExpandableText text={application.cover_letter} />
      </div>

      <div className="mt-6 flex justify-left">
        <Button
          label="Add Review"
          onClick={handleOpenReviewModal}
          className="bg-blue-600 text-white py-2 px-6 rounded-full hover:bg-blue-700 transition duration-300 ease-in-out"
        />
      </div>

      {isReviewing && (
        <CreateReview
          freelancerId={application.freelancer_id}
          isOpen={isReviewing}
          onClose={handleCloseReviewModal}
        />
      )}
    </div>
  );
};

export default ApplicationItem;
