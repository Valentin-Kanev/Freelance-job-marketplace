import { useState } from "react";
import Modal from "../UI/Modal";
import Toast from "../UI/Toast";
import Input from "../UI/Input";
import Button from "../UI/Button";
import { Profile } from "../../types/ProfileTypes";

interface EditProfileProps {
  profile: Profile;
  onSave: (data: {
    skills: string;
    description: string;
    hourly_rate: number;
  }) => void;
  isOpen: boolean;
  onClose: () => void;
}

const EditProfileForm: React.FC<EditProfileProps> = ({
  profile,
  onSave,
  isOpen,
  onClose,
}) => {
  const [skills, setSkills] = useState(profile.skills);
  const [description, setDescription] = useState(profile.description);
  const [hourlyRate, setHourlyRate] = useState(profile.hourlyRate);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const isFreelancer = localStorage.getItem("userType") === "freelancer";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ skills, description, hourly_rate: hourlyRate });
    setToastMessage("Profile updated successfully!");
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} title="Edit Profile">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Skills"
            name="skills"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            required
          />
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          {isFreelancer && (
            <Input
              label="Hourly Rate"
              name="hourlyRate"
              type="number"
              value={hourlyRate}
              onChange={(e) => setHourlyRate(Number(e.target.value))}
              required
            />
          )}

          <div className="flex justify-center">
            <Button
              type="submit"
              label="Save"
              className="bg-blue-600 text-white py-2 px-14 hover:bg-blue-700 transition"
            />
          </div>
        </form>
      </Modal>

      {toastMessage && (
        <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
      )}
    </>
  );
};

export default EditProfileForm;
