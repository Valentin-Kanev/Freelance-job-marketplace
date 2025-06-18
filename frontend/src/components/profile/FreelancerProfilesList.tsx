import { useProfiles } from "../../hooks/useProfiles";
import Button from "../UI/Button";
import { Link } from "react-router-dom";
import StatusMessage from "../UI/StatusMessage";
import ExpandableText from "../UI/ExpandableText";

const FreelancerProfilesList = () => {
  const { data: profiles, isLoading, isError, error } = useProfiles();

  return (
    <div className="max-w-6xl mx-auto px-4 py-4 mt-16">
      <h1 className="text-2xl font-bold text-center mb-8">
        Freelancer Profiles
      </h1>
      <div className="h-[calc(100vh-180px)] overflow-y-auto custom-scrollbar">
        {isLoading ? (
          <StatusMessage message="Loading profiles..." />
        ) : isError ? (
          <StatusMessage
            message={`Failed to load profiles. ${error?.message}`}
          />
        ) : !profiles || profiles.length === 0 ? (
          <StatusMessage message="No freelancer profiles found." />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-8 p-4">
            {profiles.map((profile) => (
              <div
                key={profile.profileId}
                className="flex flex-col items-center bg-white border border-gray-200 shadow-lg rounded-xl p-6 hover:shadow-xl transition-shadow h-full"
              >
                <h2 className="text-lg font-bold text-gray-800 text-center">
                  {profile.username}
                </h2>
                <div className="text-sm text-gray-600 mt-2 text-center w-full">
                  <ExpandableText
                    text={profile.description || "No description provided"}
                  />
                </div>
                <p className="text-sm text-gray-600 mt-2 text-center">
                  <span className="font-medium">Skills:</span>{" "}
                  {profile.skills || "Not specified"}
                </p>
                <p className="text-sm text-gray-600 mt-2 text-center">
                  <span className="font-medium">Hourly Rate:</span>{" "}
                  {profile.hourlyRate
                    ? `$${profile.hourlyRate}/hr`
                    : "Not specified"}
                </p>
                <Link
                  to={`/profiles/${profile.userId}`}
                  className="mt-auto w-full"
                >
                  <Button label="View Profile" className="mt-4 w-full" />
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FreelancerProfilesList;
