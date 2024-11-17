// src/components/ProfileContainer.tsx
import { useState, useEffect } from "react";
import { useUserProfile } from "../../hooks/useProfiles";
import { EditProfileForm } from "./EditProfileForm";
import { ProfilePresentation } from "./ProfilePresentation";
import { useUpdateProfile } from "../../hooks/useProfiles";
import { useParams } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

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
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (userId) refetch();
  }, [userId, refetch]);

  if (isLoading) return <div className="text-center">Loading profile...</div>;
  if (isError)
    return (
      <div className="text-center text-red-500">Error loading profile.</div>
    );
  if (!profile)
    return <div className="text-center">No profile data available.</div>;

  const isOwner = loggedInUserId === profile.userId;

  const handleSave = (updatedData: any) => {
    updateProfile({ id: profile.profileId, data: updatedData });
    setIsEditing(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {!isEditing ? (
        <ProfilePresentation
          profile={profile}
          onEdit={() => setIsEditing(true)}
          isOwner={isOwner}
        />
      ) : (
        <EditProfileForm profile={profile} onSave={handleSave} />
      )}
    </div>
  );
}
