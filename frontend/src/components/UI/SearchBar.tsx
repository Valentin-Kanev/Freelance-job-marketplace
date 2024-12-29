import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSearchJobsByTitle } from "../../hooks/useJobs";
import { useSearchProfiles } from "../../hooks/useProfiles";
import { Job } from "../../api/jobApi";
import { Profile } from "../../api/profileApi";

const SearchBar: React.FC = () => {
  const [title, setTitle] = useState("");
  const [searchType, setSearchType] = useState<"jobs" | "freelancers">("jobs");
  const navigate = useNavigate();

  const {
    data: jobs,
    error: jobsError,
    isLoading: jobsLoading,
  } = useSearchJobsByTitle(searchType === "jobs" ? title : "");
  const {
    data: profiles,
    error: profilesError,
    isLoading: profilesLoading,
  } = useSearchProfiles(searchType === "freelancers" ? title : "");

  const handleToggle = () => {
    setSearchType((prevType) => (prevType === "jobs" ? "freelancers" : "jobs"));
    setTitle("");
  };

  const handleSuggestionClick = (id: string) => {
    if (searchType === "jobs") {
      navigate(`/jobs/${id}`);
      setTitle("");
    } else {
      navigate(`/profiles/${id}`);
      setTitle("");
    }
  };

  return (
    <div className="relative max-w-lg mx-auto">
      {/* Search bar and toggle button */}
      <div className="flex items-center space-x-2">
        <form className="flex-1 flex items-center bg-gray-700 rounded-full h-8">
          {" "}
          {/* Set a fixed height for the form */}
          <button
            onClick={handleToggle}
            type="button"
            className="w-32 text-xs font-medium text-white bg-indigo-600 rounded-l-full hover:bg-indigo-500 transition whitespace-nowrap h-full flex items-center justify-center"
          >
            {searchType === "jobs" ? "Search Freelancers" : "Search Jobs"}
          </button>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={`Search ${searchType} by ${
              searchType === "jobs" ? "title" : "username"
            }`}
            className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-r-full focus:outline-none focus:ring-2 focus:ring-indigo-500 h-full"
          />
        </form>
      </div>

      {/* Dropdown suggestions */}
      {title && (
        <div className="relative mt-2">
          {searchType === "jobs" && jobsLoading && (
            <p className="text-sm text-gray-400">Loading jobs...</p>
          )}
          {searchType === "jobs" && jobsError && (
            <p className="text-sm text-red-400">Error: {jobsError.message}</p>
          )}
          {searchType === "jobs" && jobs && jobs.length > 0 && (
            <ul className="absolute left-0 w-full bg-gray-800 rounded-lg shadow-lg z-10 max-h-60 overflow-auto">
              {jobs.map((job: Job) => (
                <li
                  key={job.id}
                  className="px-4 py-2 text-white hover:bg-gray-700 cursor-pointer"
                  onClick={() => handleSuggestionClick(job.id)}
                >
                  {job.title}
                </li>
              ))}
            </ul>
          )}
          {searchType === "jobs" && jobs && jobs.length === 0 && (
            <p className="text-sm text-gray-400">No jobs found</p>
          )}

          {searchType === "freelancers" && profilesLoading && (
            <p className="text-sm text-gray-400">Loading freelancers...</p>
          )}
          {searchType === "freelancers" && profilesError && (
            <p className="text-sm text-red-400">
              Error: {profilesError.message}
            </p>
          )}
          {searchType === "freelancers" && profiles && profiles.length > 0 && (
            <ul className="absolute left-0 w-full bg-gray-800 rounded-lg shadow-lg z-10 max-h-60 overflow-auto">
              {profiles.map((profile: Profile) => (
                <li
                  key={profile.profileId}
                  className="px-4 py-2 text-white hover:bg-gray-700 cursor-pointer"
                  onClick={() => handleSuggestionClick(profile.userId)}
                >
                  {profile.username}
                </li>
              ))}
            </ul>
          )}
          {searchType === "freelancers" &&
            profiles &&
            profiles.length === 0 && (
              <p className="text-sm text-gray-400">No freelancers found</p>
            )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
