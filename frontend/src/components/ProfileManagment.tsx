import React, { useState } from "react";
import {
  useProfiles,
  useCreateProfile,
  useUpdateProfile,
} from "../hooks/useProfiles";

const ProfileManagement: React.FC = () => {
  const { data: profiles, isLoading, isError, error } = useProfiles();
  const createProfileMutation = useCreateProfile();
  const updateProfileMutation = useUpdateProfile();

  const [userId, setUserId] = useState<number>(0);
  const [skills, setSkills] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [hourlyRate, setHourlyRate] = useState<number>(0);
  const [isEditing, setIsEditing] = useState(false);
  const [profileIdToEdit, setProfileIdToEdit] = useState<number | null>(null);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    createProfileMutation.mutate({
      user_id: userId,
      skills,
      description,
      hourly_rate: hourlyRate,
    });
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (profileIdToEdit) {
      updateProfileMutation.mutate({
        id: profileIdToEdit,
        data: { skills, description, hourly_rate: hourlyRate },
      });
      setIsEditing(false);
      setProfileIdToEdit(null);
    }
  };

  const handleEdit = (profile: any) => {
    setIsEditing(true);
    setProfileIdToEdit(profile.profileId);
    setSkills(profile.skills);
    setDescription(profile.description);
    setHourlyRate(profile.hourlyRate);
  };

  return (
    <div>
      <h1>Profile Management</h1>

      {isLoading && <p>Loading profiles...</p>}
      {isError && <p>Error loading profiles: {error?.message}</p>}

      <form onSubmit={isEditing ? handleUpdate : handleCreate}>
        <div>
          <label>User ID</label>
          <input
            type="number"
            value={userId}
            onChange={(e) => setUserId(Number(e.target.value))}
            disabled={isEditing}
          />
        </div>
        <div>
          <label>Skills</label>
          <input
            type="text"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
          />
        </div>
        <div>
          <label>Description</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div>
          <label>Hourly Rate</label>
          <input
            type="number"
            value={hourlyRate}
            onChange={(e) => setHourlyRate(Number(e.target.value))}
          />
        </div>
        <button type="submit">
          {isEditing ? "Update Profile" : "Create Profile"}
        </button>
      </form>

      <h2>All Profiles</h2>
      {profiles &&
        profiles.map((profile) => (
          <div key={profile.profileId}>
            <p>
              {profile.username} - {profile.skills} (${profile.hourlyRate}/hour)
            </p>
            <button onClick={() => handleEdit(profile)}>Edit</button>
          </div>
        ))}
    </div>
  );
};

export default ProfileManagement;
