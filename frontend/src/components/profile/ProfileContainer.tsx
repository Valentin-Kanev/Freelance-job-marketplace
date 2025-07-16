import { useState } from "react";
import { useUserProfile } from "../../hooks/useProfiles";
import { ProfileDetails } from "./ProfileDetails";
import { useUpdateProfile } from "../../hooks/useProfiles";
import { useParams } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import EditProfileForm from "./EditProfileForm";
import StatusMessage from "../UI/StatusMessage";
import { UpdateProfileData } from "../../types/ProfileTypes";

interface ProfileContainerProps {
  userId?: string | null;
}

export function ProfileContainer({
  userId: propUserId,
}: ProfileContainerProps) {
  const { freelancerId } = useParams<{ freelancerId: string }>();
  const { loggedInUserId, userType } = useAuth();
  const userId = propUserId ?? freelancerId ?? loggedInUserId;

  const { data: profile, isLoading, isError } = useUserProfile(userId);
  const { mutate: updateProfile } = useUpdateProfile();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const isOwner = loggedInUserId === profile?.userId;

  const handleSave = (updatedData: UpdateProfileData) => {
    if (!profile) return;
    const { hourly_rate, ...rest } = updatedData;
    const dataToSend =
      userType === "freelancer" ? { ...rest, hourly_rate } : rest;

    updateProfile({ profileId: profile.profileId, data: dataToSend });
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
            onEdit={() => setIsModalOpen(true)}
            isOwner={isOwner}
          />
          <EditProfileForm
            profile={profile}
            onSave={handleSave}
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
          />
        </>
      )}
    </div>
  );
}
