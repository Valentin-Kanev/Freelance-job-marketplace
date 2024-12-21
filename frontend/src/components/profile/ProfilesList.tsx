import { useProfiles } from "../../hooks/useProfiles";
import Button from "../UI/Button";
import { Link } from "react-router-dom";

const FreelancerProfilesList = () => {
  const { data: profiles, isLoading, isError, error } = useProfiles();

  if (isLoading) {
    return (
      <div className="text-center text-gray-500 mt-10">Loading profiles...</div>
    );
  }

  if (isError) {
    return (
      <div className="text-center text-red-500 mt-10">
        Failed to load profiles. {error?.message}
      </div>
    );
  }

  if (!profiles || profiles.length === 0) {
    return (
      <div className="text-center text-gray-500 mt-10">
        No freelancer profiles found.
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 mt-16">
      {" "}
      {/* Add mt-20 here */}
      <h1 className="text-2xl font-bold text-center mb-8">
        Freelancer Profiles
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
        {profiles.map((profile) => (
          <div
            key={profile.profileId}
            className="flex flex-col items-center bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow h-full"
          >
            <h2 className="text-lg font-bold text-gray-800">
              {profile.username}
            </h2>
            <p className="text-sm text-gray-600 mt-2 text-center font-semibold truncate">
              {profile.description || "No description provided"}
            </p>
            <p className="text-sm text-gray-600 mt-2">
              <span className="font-semibold">Skills:</span>{" "}
              {profile.skills || "Not specified"}
            </p>
            <p className="text-sm text-gray-600 mt-2">
              <span className="font-semibold">Hourly Rate:</span>{" "}
              {profile.hourlyRate
                ? `$${profile.hourlyRate}/hr`
                : "Not specified"}
            </p>
            <Link to={`/profiles/${profile.userId}`} className="mt-4">
              <Button label="View Profile" className="mt-4" />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FreelancerProfilesList;
