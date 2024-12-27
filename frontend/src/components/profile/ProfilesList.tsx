import { useProfiles } from "../../hooks/useProfiles";
import Button from "../UI/Button";
import { Link } from "react-router-dom";
import StatusMessage from "../UI/StatusMessage";

const FreelancerProfilesList = () => {
  const { data: profiles, isLoading, isError, error } = useProfiles();

  if (isLoading) {
    return <StatusMessage message="Loading profiles..." />;
  }

  if (isError) {
    return (
      <StatusMessage message={`Failed to load profiles. ${error?.message}`} />
    );
  }

  if (!profiles || profiles.length === 0) {
    return <StatusMessage message="No freelancer profiles found." />;
  }

  return (
    <div className="max-w-5xl mx-auto px-2 py-2 mt-24">
      <h1 className="text-2xl font-bold text-center mb-8">
        Freelancer Profiles
      </h1>
      <div className="h-[calc(100vh-250px)] overflow-y-auto custom-scrollbar">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-8 p-4">
          {profiles.map((profile) => (
            <div
              key={profile.profileId}
              className="flex flex-col items-center bg-white border border-gray-200 shadow-lg rounded-xl p-6 hover:shadow-xl transition-shadow h-full"
            >
              <h2 className="text-lg font-bold text-gray-800 text-center">
                {profile.username}
              </h2>
              <p className="text-sm text-gray-600 mt-2 text-center truncate">
                {profile.description || "No description provided"}
              </p>
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
      </div>
    </div>
  );
};

export default FreelancerProfilesList;
