import { useState } from "react";
import { Link } from "react-router-dom";

interface ApplicationItemProps {
  application: {
    id: string;
    freelancer_id: string;
    username: string;
    cover_letter: string;
  };
}

const ApplicationItem: React.FC<ApplicationItemProps> = ({ application }) => {
  const [showMore, setShowMore] = useState(false);
  const isLongText = application.cover_letter.length > 200;

  return (
    <li className="py-4">
      <div className="flex flex-col space-y-2">
        <p className="text-lg font-medium text-gray-800">
          <strong>Applicant:</strong>{" "}
          <Link
            to={`/profiles/${application.freelancer_id}`}
            className="text-blue-600 hover:text-blue-800 underline"
          >
            {application.username}
          </Link>
        </p>
        <div className="text-gray-700">
          <strong>Cover Letter:</strong>{" "}
          {isLongText && !showMore
            ? `${application.cover_letter.slice(0, 200)}...`
            : application.cover_letter}
          {isLongText && (
            <button
              onClick={() => setShowMore(!showMore)}
              className="ml-2 text-blue-600 hover:text-blue-800 underline"
            >
              {showMore ? "Show Less" : "Show More"}
            </button>
          )}
        </div>
      </div>
    </li>
  );
};

export default ApplicationItem;
