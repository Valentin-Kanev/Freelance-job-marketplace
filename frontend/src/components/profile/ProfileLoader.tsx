import { useParams, useNavigate } from "react-router-dom";
import { useUserProfile } from "../../hooks/profiles/useUserProfile";
import { ProfileDetails } from "./ProfileDetails";
import { useAuth } from "../../contexts/AuthContext";

const ProfileLoader = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const {
    data: profile,
    isLoading,
    isError,
    error,
  } = useUserProfile(userId || null);
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
          onEdit={() => navigate("/profile-management")}
        />
      )}
    </>
  );
};

export default ProfileLoader;
