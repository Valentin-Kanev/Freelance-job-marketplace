import { useState, useEffect } from "react";
import { useUserProfile } from "../../hooks/useProfiles";
import { ProfileDetails } from "./ProfileDetails";
import { useUpdateProfile } from "../../hooks/useProfiles";
import { useParams } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import EditProfileForm from "./EditProfileForm";
import StatusMessage from "../UI/StatusMessage";

interface ProfileContainerProps {
  userId?: string | null;
}

export function ProfileContainer({
  userId: propUserId,
}: ProfileContainerProps) {
  const { freelancerId } = useParams<{ freelancerId: string }>();
  const { userId: loggedInUserId } = useAuth();
  const userId = propUserId ?? freelancerId ?? loggedInUserId;

  const { data: profile, isLoading, isError, refetch } = useUserProfile(userId);
  const { mutate: updateProfile } = useUpdateProfile();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (userId) refetch();
  }, [userId, refetch]);

  if (isLoading) return <StatusMessage message="Loading profile..." />;
  if (isError) return <StatusMessage message="Error loading profile." />;
  if (!profile) return <StatusMessage message="No profile data available." />;

  const isOwner = loggedInUserId === profile.userId;

  const handleSave = (updatedData: any) => {
    updateProfile({ id: profile.profileId, data: updatedData });
    setIsModalOpen(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
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
    </div>
  );
}
