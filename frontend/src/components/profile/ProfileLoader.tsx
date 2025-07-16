import { useParams } from "react-router-dom";
import { useUserProfile } from "../../hooks/useProfiles";
import { ProfileDetails } from "./ProfileDetails";
import { useAuth } from "../../contexts/AuthContext";

const ProfileLoader = () => {
  const { user_id } = useParams();
  const {
    data: profile,
    isLoading,
    isError,
    error,
  } = useUserProfile(user_id || null);
  const { loggedInUserId } = useAuth();
  const isOwner = profile?.userId === loggedInUserId;

  return (
    <>
      {isLoading ? (
        <div className="text-center mt-24">Loading profile...</div>
      ) : isError ? (
        <div className="text-center mt-24 text-red-500">
          Failed to load profile. {error?.message}
        </div>
      ) : !profile ? (
        <div className="text-center mt-24">Profile not found.</div>
      ) : (
        <ProfileDetails
          profile={profile}
          isOwner={isOwner}
          onEdit={() => alert("Redirect to Edit Profile Page")}
        />
      )}
    </>
  );
};

export default ProfileLoader;
