import { useState } from "react";
import { useFetchUserProfile } from "../../hooks/profiles/useFetchUserProfile";
import { ProfileDetails } from "./ProfileDetails";
import { useUpdateProfile } from "../../hooks/profiles/useUpdateProfile";
import { useParams } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import UpdateProfileForm from "./UpdateProfileForm";
import StatusMessage from "../UI/StatusMessage";
import { UpdateProfileData } from "./ProfileTypes";

export const ProfileContainer: React.FC = () => {
  const { freelancerId } = useParams<{ freelancerId: string }>();
  const { loggedInUserId, userType } = useAuth();
  const userId = freelancerId ?? loggedInUserId;

  const { data: profile, isLoading, isError } = useFetchUserProfile(userId);
  const { mutate: updateProfileMutation } = useUpdateProfile();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const isOwner = loggedInUserId === profile?.userId;

  const handleSave = (updatedData: UpdateProfileData) => {
    if (!profile) return;
    const { hourlyRate, ...rest } = updatedData;
    const dataToSend =
      userType === "freelancer" ? { ...rest, hourlyRate } : rest;

    updateProfileMutation({ profileId: profile.profileId, data: dataToSend });
    setIsModalOpen(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {isLoading ? (
        <StatusMessage message="Loading profile..." />
      ) : isError ? (
        <StatusMessage message="Error loading profile." />
      ) : !profile ? (
        <StatusMessage message="No profile data available." />
      ) : (
        <>
          <ProfileDetails
            profile={profile}
            onUpdate={() => setIsModalOpen(true)}
            isOwner={isOwner}
          />
          <UpdateProfileForm
            profile={profile}
            onSave={handleSave}
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
          />
        </>
      )}
    </div>
  );
};
