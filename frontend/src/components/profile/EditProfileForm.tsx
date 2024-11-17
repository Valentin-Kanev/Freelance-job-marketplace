// src/components/EditProfileForm.tsx
import { useState } from "react";
import { Profile } from "../../api/profileApi";

interface EditProfileFormProps {
  profile: Profile;
  onSave: (data: {
    skills: string;
    description: string;
    hourly_rate: number;
  }) => void;
}

export function EditProfileForm({ profile, onSave }: EditProfileFormProps) {
  const [skills, setSkills] = useState(profile.skills);
  const [description, setDescription] = useState(profile.description);
  const [hourlyRate, setHourlyRate] = useState(profile.hourlyRate);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ skills, description, hourly_rate: hourlyRate });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow-lg rounded-xl p-8 max-w-xl mx-auto"
    >
      <div className="mb-6">
        <label className="block text-gray-700 text-lg font-medium mb-2">
          Skills
        </label>
        <input
          type="text"
          value={skills}
          onChange={(e) => setSkills(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
        />
      </div>
      <div className="mb-6">
        <label className="block text-gray-700 text-lg font-medium mb-2">
          Description
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
        />
      </div>
      <div className="mb-6">
        <label className="block text-gray-700 text-lg font-medium mb-2">
          Hourly Rate
        </label>
        <input
          type="number"
          value={hourlyRate}
          onChange={(e) => setHourlyRate(Number(e.target.value))}
          className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
        />
      </div>
      <div className="flex justify-center">
        <button
          type="submit"
          className="bg-blue-600 text-white py-3 px-8 rounded-full hover:bg-blue-700 transition duration-300 ease-in-out transform hover:scale-105"
        >
          Save
        </button>
      </div>
    </form>
  );
}
