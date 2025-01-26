import { useParams } from "react-router-dom";
import { useUserProfile } from "../../hooks/useProfiles";
import { ProfileDetails } from "./ProfileDetails";

const ProfileLoader = () => {
  const { user_id } = useParams();
  const {
    data: profile,
    isLoading,
    isError,
    error,
  } = useUserProfile(user_id || null);

  if (isLoading) {
    return <div className="text-center mt-24">Loading profile...</div>;
  }

  if (isError) {
    return (
      <div className="text-center mt-24 text-red-500">
        Failed to load profile. {error?.message}
      </div>
    );
  }

  if (!profile) {
    return <div className="text-center mt-24">Profile not found.</div>;
  }

  const isOwner = profile.userId === localStorage.getItem("userId");

  return (
    <ProfileDetails
      profile={profile}
      isOwner={isOwner}
      onEdit={() => alert("Redirect to Edit Profile Page")}
    />
  );
};

export default ProfileLoader;
