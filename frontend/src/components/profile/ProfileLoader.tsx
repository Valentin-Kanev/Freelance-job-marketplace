import { useParams, useNavigate } from "react-router-dom";
import { useFetchUserProfile } from "../../hooks/profiles/useFetchUserProfile";
import { ProfileDetails } from "./ProfileDetails";
import { useAuth } from "../../contexts/AuthContext";

export const ProfileLoader: React.FC = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const {
    data: profile,
    isLoading,
    isError,
    error,
  } = useFetchUserProfile(userId || null);
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
          onUpdate={() => navigate("/profile-management")}
        />
      )}
    </>
  );
};
